import type { ChildProcess } from "child_process";
import { ipcRenderer } from "electron-better-ipc";
import { useEffect, useState } from "react";

function useExecutionState(path: string) {
    let [executing, setExecuting] = useState(false);

    async function refresh() {
        let processes: { process: ChildProcess }[] | false = await ipcRenderer.callMain('get', path);
        if (processes) {
            setExecuting(processes.some(p => p.process.exitCode === null && !p.process.signalCode));
        }
    }

    useEffect(() => {
        let interval = setInterval(refresh, 50);
        return () => clearInterval(interval);
    })

    return [executing, refresh] as const;
}

export default useExecutionState;