import { useState } from "react";
import ReactModal from "react-modal";
import type {NodeSSH} from 'node-ssh';
import { ipcRenderer } from "electron-better-ipc";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { normalize } from 'path';
import { getInputFolder, getOutputFolder } from "../../right/project/folder";

type TunnelOption = Parameters<NodeSSH['connect']>[0]

let inputTextStyles = "w-full p-2 input-bordered";
let buttonBaseStyles = "text-white py-2 px-4 rounded-lg";

async function connect(path: string, options: TunnelOption) {
    return await ipcRenderer.callMain('ssh_create', [path, options]) as [boolean, string?];
}

async function ensureDirectory(key: string, path: string) : Promise<boolean> {
    return await ipcRenderer.callMain('create_directory_ssh', [key, path, true]);
}

async function ensureDirectoryInOut(key: string, path: string) {
    await ipcRenderer.callMain('create_directory_ssh', [key, getInputFolder(path), true]);
    await ipcRenderer.callMain('create_directory_ssh', [key, getOutputFolder(path), true]);
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
    let [path, setPath] = useState('');
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
                        <div className="flex flex-row gap-2">
                            <input
                                value={path || undefined}
                                onChange={e => setPath(e.target.value)}
                                className={inputTextStyles}
                                placeholder="Path" />
                        </div>
                    </div>

                    <div className="flex flex-row justify-end gap-6">
                        <button
                            disabled={connecting}
                            onClick={onClose}
                            className={buttonBaseStyles + " bg-gray-600"}>
                            Cancel
                        </button>
                        <button
                            disabled={!user || !port || !server || connecting || !path}
                            className={buttonBaseStyles + " bg-pink-600 disabled:bg-pink-300"}
                            onClick={() => {
                                setConnecting(true);
                                setError('');

                                let key = `${user}@${server}:${port}:${path}`;

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
                                            await ensureDirectory(key, path);
                                            await ensureDirectoryInOut(key, path);

                                            p.set(ParamKey.SshConnection, key);
                                            navigate({
                                                pathname: normalize(
                                                    AppRoute.Project + '/' + encodeURIComponent(path)
                                                    + '?' + ParamKey.ProjectScreen + '=' + ProjectScreen.Setting
                                                    + '&' + p.toString()
                                                )
                                            })
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