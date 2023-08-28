import type { ChildProcess } from "child_process";
import { ipcRenderer } from "electron-better-ipc";
import { useEffect, useState } from "react";

function useExecutionState(path: string) {
    let [executing, setExecuting] = useState(false);
    let [count, setCount] = useState([0, 0])

    async function refresh() {
        let processes: { process: ChildProcess }[] | false = await ipcRenderer.callMain('get', path);
        if (processes) {
            let runningCount = processes
                .map(p => +!!(p.process.exitCode === null && !p.process.signalCode))
                .reduce((a, b) => a + b, 0);
            setExecuting(!!runningCount);
            setCount([runningCount, processes.length]);
        }
    }

    useEffect(() => {
        let interval = setInterval(refresh, 50);
        return () => clearInterval(interval);
    })

    return [executing, refresh, count] as const;
}

export default useExecutionState;