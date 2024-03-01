import { useSearchParams } from "react-router-dom";
import useSsh from "../../hooks/useSsh";
import { ParamKey } from "../../paramKey";
import { useCallback, useEffect, useState } from "react";
import { SshIntegration } from "../../natives/ssh";
import { LocalNative } from "../../natives";
import { RecentRecord } from "../../interfaces/natives";
import BinaryDownload from "../binarydownload";
import { ipcRenderer } from "electron-better-ipc";

const retryLimit = 5;

export function EnsureRemote({ onReady, requireDownload = true }: { onReady?: () => void, requireDownload?: boolean }) {
    let ssh_connection = useSsh();
    let [params] = useSearchParams();
    let connectionId = +params.get(ParamKey.ConnectionId)!;
    let [connectionInfo, setConnectionInfo] = useState<RecentRecord['connection']>(undefined)
    let [retry, setRetry] = useState(0);
    let [loadError, setLoadError] = useState('');
    let [connectionError, setConnectionError] = useState('');

    let [connected, setConnected] = useState(false);

    if (!connectionId && !ssh_connection && !connected) {
        setConnected(true);
    }

    useEffect(() => {
        if (connected) return;
        if (!connectionId) return;
        if (loadError) return;

        let l = new LocalNative();
        l.database_get_connection(connectionId)
            .then(r => {
                console.log(connectionId, r);
                if (r) {
                    setConnectionInfo(r);
                } else {
                    setLoadError('Non existent connection ID! Database is corrupt!');
                }
            })

    }, [connectionId, loadError, connected])

    let load = useCallback(async () => {
        let check: boolean = await ipcRenderer.callMain('ssh_check_connection', ssh_connection);
        if (check) {
            setConnected(true);
            return;
        }

        if (!connected && connectionInfo) {
            let integration = new SshIntegration();
            let { username, password, host, port } = connectionInfo;
            let key = ssh_connection;
            let present = await integration.checkConnection(key);
            if (present) {
                console.log('connected!');
                setConnected(true);
                return;
            }

            console.log('trying', key, connectionInfo);

            await integration.createConnection(
                key,
                {
                    host,
                    port,
                    username,
                    password
                }
            )
                .then(([success, err]) => {
                    if (!success) {
                        setRetry(retry + 1);
                        setConnectionError(err!);
                        setConnected(false);
                    } else {
                        setConnected(true);
                    }
                })
                .catch(err => {
                    setConnectionError(`${err}`);
                    setConnected(false);
                })
        }
    }, [retry, connectionInfo, connected, ssh_connection]);

    useEffect(() => {
        if (retry < retryLimit) {
            load();
        }
    }, [retry, connectionInfo, connected, ssh_connection, load]);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!connectionError && !loadError) {
            if (connected && !requireDownload) {
                onReady?.();
            }
        }
    }, [connectionError, loadError, connected, requireDownload]);

    if (connectionError) {
        if (retry < retryLimit) {
            return (
                <>
                    Error occurred. Retrying connection...
                </>
            )
        } else {
            return (
                <>
                    {connectionError}
                </>
            )
        }
    }

    if (loadError) {
        return (
            <>
                {loadError}
            </>
        )
    }

    if (!connected) {
        return (
            <>
                Connecting...
            </>
        )
    }

    if (!requireDownload) {
        return (
            <></>
        )
    }

    return (
        <>
            <BinaryDownload onReady={() => {
                onReady?.();
            }} />
        </>
    )
}