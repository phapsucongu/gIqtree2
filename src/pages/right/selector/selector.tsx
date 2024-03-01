import { useCallback, useEffect, useState } from "react";
import useSsh from "../../../hooks/useSsh";
import { ipcRenderer } from "electron-better-ipc";
import { join, normalize } from 'path';
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocalNative } from "../../../natives";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { getInputFolder, getOutputFolder } from "../project/folder";

function exec(key: string, command: string, args: string[]) {
    return ipcRenderer.callMain('ssh_exec', [key, { command, args }]) as Promise<string>;
}

function list(key: string, path: string) {
    console.log('reading', path);
    return ipcRenderer.callMain('ssh_read_dir', [key, path]) as Promise<{ name: string, isDir: boolean }[]>;
}

async function ensureDirectory(key: string, path: string) : Promise<boolean> {
    return await ipcRenderer.callMain('create_directory_ssh', [key, path, true]);
}

async function ensureDirectoryInOut(key: string, path: string) {
    await ipcRenderer.callMain('create_directory_ssh', [key, getInputFolder(path), true]);
    await ipcRenderer.callMain('create_directory_ssh', [key, getOutputFolder(path), true]);
}


function Selector() {
    let ssh = useSsh();
    let [cwd, setCwd] = useState('');
    let [folder, setFolders] = useState<string[]>([]);
    let [params] = useSearchParams();
    let navigate = useNavigate();

    let pwd = useCallback(() => {
        return exec(ssh, 'pwd', [])
            .then(cwd => {
                setCwd(cwd);
            })
    }, [ssh])

    useEffect(() => {
        pwd();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setFolders([]);
        list(ssh, cwd)
            .then(f => {
                setFolders(
                    f.filter(r => r.isDir).map(r => r.name)
                );
            })
    }, [cwd, ssh])

    return (
        <>
            <div className="p-4">
                <h3 className="font-bold">
                    Pick the project folder...
                </h3>
                <br />
                <div className="flex flex-row justify-between">
                    <div>
                        Current directory : <b>{cwd}</b>
                    </div>
                    <div>
                        <button className="bg-pink-600 p-1 rounded-md text-white" onClick={async () => {
                            let p = new URLSearchParams(params);
                            let native = new LocalNative();
                            let path = cwd;


                            await native.database_recent_push({
                                id: 0, timestamp: '',
                                path: path,
                                connectionId: -1,
                                connection: {
                                    host: localStorage.getItem('host')!,
                                    port: +localStorage.getItem('port')!,
                                    username: localStorage.getItem('user')!,
                                    password: localStorage.getItem('pass')!
                                }
                            })

                            let res = await native.database_recent_list();
                            console.log(res[0]);

                            await ensureDirectory(ssh, path);
                            await ensureDirectoryInOut(ssh, path);


                            navigate({
                                pathname: normalize(
                                    AppRoute.Project + '/' + encodeURIComponent(path)
                                    + '?' + ParamKey.ProjectScreen + '=' + ProjectScreen.Setting
                                    + '&' + p.toString()
                                    + `&${ParamKey.ConnectionId}=${res[0].connectionId}`
                                )
                            })
                        }}>
                            Choose this directory
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                        <button className="border border-black p-2" onClick={() => {
                            setCwd(
                                join(cwd, '..')
                            )
                        }}>
                            ../
                        </button>
                    </div>
                    {folder.map(r => {
                        return (
                            <div>
                                <button className="border border-black p-2"
                                    onClick={() => {
                                        setCwd(
                                            join(cwd, r)
                                        )
                                    }}>
                                    {r}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Selector;