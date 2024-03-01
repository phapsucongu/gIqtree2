import { useContext, useEffect, useState } from "react";
import { NativeContext } from "../../../../natives/nativeContext";

function useExecutionState(path: string) {
    let native = useContext(NativeContext);
    let [executing, setExecuting] = useState(false);
    let [count, setCount] = useState([0, 0])

    async function refresh() {
        let processes = await native.getState(path);
        if (processes) {
            let executedCount = processes
                .map(p => +!!(typeof p.exitCode === 'number' && !p.signal))
                .reduce((a, b) => a + b, 0);
            let anyExecuting = processes
                .some(p => p.exitCode === undefined && !p.signal);
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