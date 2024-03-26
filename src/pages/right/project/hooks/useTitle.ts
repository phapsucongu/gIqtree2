import { basename } from "path";
import { useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import useExecutionState, { Job } from "./useExecutionState";
import { useContext, useEffect, useState } from "react";
import { NativeContext } from "../../../../natives/nativeContext";

function useTitle(path: string) {
    let [params, ] = useSearchParams();
    let [executing, , [count, maxCount]] = useExecutionState(path);
    let [failed, setFailed] = useState(false);
    let native = useContext(NativeContext);

    useEffect(() => {
        if (!executing) {
            native.getState(path)
                .then(res => {
                    let processes = res;
                    if (processes) {
                        let failed: boolean;
                        if (processes.some(r => 'pending' in r)) {
                            let pp = processes as Job[];
                            failed = pp.some(r => r.exited && r.exited !== 2);
                        } else {
                            failed = processes.some(p => p.exitCode !== 0 && !p.kill);
                        }
                        setFailed(failed);
                    }
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path, executing]);

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            return 'Settings';
        }
        case ProjectScreen.File: {
            let file = params.get(ParamKey.ProjectFile)!;
            return basename(file);
        }
        case ProjectScreen.Log: {
            return 'Console' + (
                executing
                ? ` / In Progress (${count} / ${maxCount})`
                : (failed ? ' / Execution failed' : '')
            );
        }
    }
}

export default useTitle;