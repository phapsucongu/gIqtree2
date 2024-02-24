import { useSearchParams } from "react-router-dom";
import useSsh from "../../hooks/useSsh";
import { ParamKey } from "../../paramKey";
import { useEffect, useState } from "react";
import { SshIntegration } from "../../natives/ssh";
import { LocalNative } from "../../natives";
import { RecentRecord } from "../../interfaces/natives";
import BinaryDownload from "../binarydownload";

const retryLimit = 5;

export function EnsureRemote({ onReady }: { onReady?: () => void }) {
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
                if (r) {
                    setConnectionInfo(r);
                } else {
                    setLoadError('Non existent connection ID! Database is corrupt!');
                }
            })

    }, [connectionId, loadError, connected])

    useEffect(() => {
        let load = async () => {
            if (!connected && connectionInfo) {
                let integration = new SshIntegration();
                let { username, password, host, port } = connectionInfo;
                let key = ssh_connection;
                let present = await integration.checkConnection(key);

                if (present) {
                    return;
                }

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
                        }
                    })
                    .catch(err => {
                        setConnectionError(`${err}`)
                    })
            }
        };

        if (retry < retryLimit) {
            load();
        }
    }, [retry, connectionInfo, connected, ssh_connection]);

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

    return (
        <>
            <BinaryDownload onReady={() => {
                onReady?.();
            }} />
        </>
    )
}