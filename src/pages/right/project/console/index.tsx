import { ipcRenderer } from "electron-better-ipc";
import { useContext, useEffect, useState } from "react";
import TextView from "../components/textView";
import useExecutionState from "../hooks/useExecutionState";
import { IpcRendererEvent } from "electron";
import useSsh from "../../../../hooks/useSsh";
import { NativeContext } from "../../../../natives/nativeContext";

function Console({ path, wrap } : { path: string, wrap?: boolean }) {
    let [executing] = useExecutionState(path);
    let [log, setLog] = useState<string[]>([]);
    let ssh = useSsh();
    let native = useContext(NativeContext);

    useEffect(() => {
        native.getState(path)
            .then(res => {
                if (res.length) {
                    let result = res.map(r => {
                        let all = r.outputBuffer;
                        let allLength = all.reduce((r, a) => r + a.length, 0);
                        let merged = new Uint8Array(allLength);
                        let offset = 0;
                        all.forEach(item => {
                            merged.set(item, offset);
                            offset += item.length;
                        });

                        return new TextDecoder().decode(merged);
                    });
                    setLog(result);
                }
            })

    }, [ssh, path, native])

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