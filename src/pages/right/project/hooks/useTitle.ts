import { basename } from "path";
import { useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import useExecutionState from "./useExecutionState";
import { ipcRenderer } from "electron-better-ipc";
import { useEffect, useState } from "react";
import { ChildProcess } from "child_process";

function useTitle(path: string) {
    let [params, ] = useSearchParams();
    let [executing, , [count, maxCount]] = useExecutionState(path);
    let [failed, setFailed] = useState(false);


    useEffect(() => {
        if (!executing) {
            ipcRenderer.callMain('get', path)
                .then(res => {
                    let processes = res as { process: ChildProcess }[] | false;
                    if (processes) {
                        let failed = processes.some(p => p.process.exitCode !== 0 && !p.process.killed);
                        setFailed(failed);
                    }
                })
        }
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