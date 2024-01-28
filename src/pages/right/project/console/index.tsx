import { ipcRenderer } from "electron-better-ipc";
import { useEffect, useState } from "react";
import TextView from "../components/textView";
import useExecutionState from "../hooks/useExecutionState";
import { IpcRendererEvent } from "electron";
import useSsh from "../../../../hooks/useSsh";

function Console({ path, wrap } : { path: string, wrap?: boolean }) {
    let [executing] = useExecutionState(path);
    let [log, setLog] = useState<string[]>([]);
    let ssh = useSsh()

    useEffect(() => {
        (ipcRenderer.callMain(ssh ? 'get-stdout_ssh' : 'get-stdout', path) as Promise<any>)
            .then((res : false | string[]) => {
                if (res) {
                    setLog(res);
                }
            })

    }, [ssh, path])

    useEffect(() => {
        let listener = (ev: IpcRendererEvent, data : { id: string, outputs: string[] }) => {
            if (data.id === path) {
                setLog(data.outputs);
            }
        }
        ipcRenderer.on('command-data', listener);
        return () => {
            ipcRenderer.removeListener('command-data', listener);
        }
    }, [path, executing])

    return (
        <>
            <TextView wrap={wrap} autoscroll={true} content={log.join('\n')} />
        </>
    )
}

export default Console;