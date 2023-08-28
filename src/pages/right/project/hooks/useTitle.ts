import { basename } from "path";
import { useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import useExecutionState from "./useExecutionState";

function useTitle(path: string) {
    let [params, ] = useSearchParams();
    let [executing, _, [count, maxCount]] = useExecutionState(path);
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
                : ''
            );
        }
    }
}

export default useTitle;