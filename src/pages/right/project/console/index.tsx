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
                        let failed = processes.some(p => p.process.exitCode !== 0);
                        if (failed) {
                            alert('Execution failed!');
                        }
                    }
                })
        }
    }, [path, executing]);

    useEffect(() => {
        let refreshLog = async () => {
            let result: string[] | false = await ipcRenderer.callMain('get-stdout', path);
            if (result) {
                setLog(result);
            }
        };
        if (executing) {
            let interval = setInterval(refreshLog, 100);
            return () => {
                clearInterval(interval)
            }
        }
        else {
            refreshLog();
        }
    }, [path, executing])

    return (
        <>
            <TextView autoscroll={true} content={log.join('\n')} />
        </>
    )
}

export default Console;