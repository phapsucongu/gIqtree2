import { ChildProcess } from "child_process";
import { ipcRenderer } from "electron-better-ipc";
import { useEffect, useState } from "react";
import TextView from "../components/textView";
import useExecutionState from "../hooks/useExecutionState";

function Console({ path } : { path: string }) {
    let [executing] = useExecutionState(path);
    let [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        if (!executing) {
            ipcRenderer.callMain('get', path)
                .then(res => {
                    let processes = res as { process: ChildProcess }[] | false;
                    if (processes) {
                        let failed = processes.some(p => p.process.exitCode !== 0 && !p.process.killed);
                        if (failed) {
                            alert('Execution failed!');
                        }
                    }
                })
        }
    }, [path, executing]);

    useEffect(() => {
        ipcRenderer.on('command-data', (ev, data : { id: string, outputs: string[] }) => {
            if (data.id === path) {
                setLog(data.outputs);
            }
        });
    }, [path, executing])

    return (
        <>
            <TextView autoscroll={true} content={log.join('\n')} />
        </>
    )
}

export default Console;