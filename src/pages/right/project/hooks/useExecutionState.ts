import { useContext, useEffect, useState } from "react";
import { NativeContext } from "../../../../natives/nativeContext";
import { Task } from "../../../../interfaces/natives";

export interface Job extends Task {
    pending: boolean;
    running: boolean;
    exited: number;
}

function useExecutionState(path: string) {
    let native = useContext(NativeContext);
    let [executing, setExecuting] = useState(false);
    let [count, setCount] = useState([0, 0])

    async function refresh() {
        let processes = await native.getState(path);
        let executedCount = 0;
        let anyExecuting = false;
        if (processes) {
            if (processes.some(r => 'pending' in r)) {
                let pp = processes as Job[];
                executedCount = pp
                    .map(p => +!!(p.exited))
                    .reduce((a, b) => a + b, 0);
                anyExecuting = pp.some(p => p.pending || p.running);
            } else {
                executedCount = processes
                    .map(p => +!!(typeof p.exitCode === 'number' && !p.signal))
                    .reduce((a, b) => a + b, 0);
                anyExecuting = processes
                    .some(p => p.exitCode === undefined && !p.signal);
            }

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