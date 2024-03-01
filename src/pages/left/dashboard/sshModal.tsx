import { useState } from "react";
import ReactModal from "react-modal";
import type {NodeSSH} from 'node-ssh';
import { ipcRenderer } from "electron-better-ipc";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { normalize } from 'path';
import { connectionKey } from "../../../utils/connectionKey";

type TunnelOption = Parameters<NodeSSH['connect']>[0]

let inputTextStyles = "w-full p-2 input-bordered";
let buttonBaseStyles = "text-white py-2 px-4 rounded-lg";

async function connect(path: string, options: TunnelOption) {
    return await ipcRenderer.callMain('ssh_create', [path, options]) as [boolean, string?];
}

interface ModalProps extends ReactModal.Props {
    onClose?: () => void;
}

function SshModal(props: ModalProps) {
    let { onClose } = props;
    let [params] = useSearchParams();
    let navigate = useNavigate();

    let [user, setUser] = useState('');
    let [server, setServer] = useState('');
    let [port, setPort] = useState(22);
    let [password, setPassword] = useState('');
    let [connecting, setConnecting] = useState(false);
    // let [path, setPath] = useState('');
    let [error, setError] = useState('');

    return (
        <>
            <ReactModal
                {...props}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={onClose}>
                <div className="flex flex-col gap-8 bg-white rounded-xl p-4 outline-none">
                    <div className="font-arvo font-bold text-xl">
                        Connect to SSH
                    </div>
                    {error && (
                        <b className={"text-red-500 line-clamp-3"}>
                            {error}
                        </b>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-2">
                            <input
                                value={server || undefined}
                                onChange={e => setServer(e.target.value)}
                                className={inputTextStyles}
                                placeholder="Server" />
                            <input
                                type="number"
                                value={port || undefined}
                                onChange={e => setPort(e.target.valueAsNumber)}
                                className={`${inputTextStyles} max-w-[6rem]`}
                                placeholder="Port" />
                        </div>
                        <div className="flex flex-row gap-2">
                            <input
                                value={user || undefined}
                                onChange={e => setUser(e.target.value)}
                                className={inputTextStyles}
                                placeholder="Username" />
                            <input
                                type="password"
                                value={password || undefined}
                                onChange={e => setPassword(e.target.value)}
                                className={inputTextStyles}
                                placeholder="Password" />
                        </div>
                        {/* <div className="flex flex-row gap-2">
                            <input
                                value={path || undefined}
                                onChange={e => setPath(e.target.value)}
                                className={inputTextStyles}
                                placeholder="Path" />
                        </div> */}
                    </div>

                    <div className="flex flex-row justify-end gap-6">
                        <button
                            disabled={connecting}
                            onClick={onClose}
                            className={buttonBaseStyles + " bg-gray-600"}>
                            Cancel
                        </button>
                        <button
                            disabled={!user || !port || !server || connecting}
                            className={buttonBaseStyles + " bg-pink-600 disabled:bg-pink-300"}
                            onClick={() => {
                                setConnecting(true);
                                setError('');

                                let key = connectionKey(server, port, user, password);

                                connect(key, {
                                    username: user,
                                    port: port,
                                    host: server,
                                    password: password
                                })
                                    .then(async (res) => {
                                        let [success, error] = res;
                                        if (success) {
                                            let p = new URLSearchParams(params);
                                            p.set(ParamKey.SshConnection, key);

                                            localStorage.clear();
                                            localStorage.setItem('host', server);
                                            localStorage.setItem('port', port.toString());
                                            localStorage.setItem('user', user);
                                            localStorage.setItem('pass', password);

                                            navigate({
                                                pathname: normalize(
                                                    AppRoute.FolderSelector
                                                        + '?' + ParamKey.ProjectScreen + '=' + ProjectScreen.Setting
                                                        + '&' + p.toString()
                                                        // + `&${ParamKey.ConnectionId}=${res[0].connectionId}`
                                                )
                                            })


                                            // await native.database_recent_push({
                                            //     id: 0, timestamp: '',
                                            //     path: path,
                                            //     connectionId: -1,
                                            //     connection: {
                                            //         host: server,
                                            //         port,
                                            //         username: user,
                                            //         password
                                            //     }
                                            // })

                                            // let res = await native.database_recent_list();
                                            // console.log(res[0]);

                                            // await ensureDirectory(key, path);
                                            // await ensureDirectoryInOut(key, path);


                                            // navigate({
                                            //     pathname: normalize(
                                            //         AppRoute.Project + '/' + encodeURIComponent(path)
                                            //             + '?' + ParamKey.ProjectScreen + '=' + ProjectScreen.Setting
                                            //             + '&' + p.toString()
                                            //             + `&${ParamKey.ConnectionId}=${res[0].connectionId}`
                                            //     )
                                            // })
                                        } else {
                                            setError(error!);
                                        }
                                        setConnecting(false);
                                    })


                                // connect
                            }}>
                            {connecting ? 'Connecting...' : 'Connect'}
                        </button>
                    </div>
                </div>
            </ReactModal>
        </>
    )
}

export default SshModal