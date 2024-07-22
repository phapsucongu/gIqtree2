import type { ChildProcess } from "child_process";
import { ipcRenderer } from "electron-better-ipc";
import { useEffect, useState } from "react";

function useExecutionState(path: string) {
    let [executing, setExecuting] = useState(false);
    let [count, setCount] = useState([0, 0])

    async function refresh() {
        let processes: { process: ChildProcess }[] | false = await ipcRenderer.callMain('get', path);
        if (processes) {
            let executedCount = processes
                .map(p => +!!(p.process && typeof p.process.exitCode === 'number' && !p.process.signalCode))
                .reduce((a, b) => a + b, 0);
            let anyExecuting = processes
                .some(p => p.process && p.process.exitCode === null && !p.process.signalCode);
            setExecuting(anyExecuting);
            setCount([executedCount + 1, processes.length]);
        }
    }

    useEffect(() => {
        let interval = setInterval(refresh, 50);
        return () => clearInterval(interval);
    })

    return [executing, refresh, count] as const;
}

export default useExecutionState;