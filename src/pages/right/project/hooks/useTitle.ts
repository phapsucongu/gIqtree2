import { basename } from "path";
import { useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../../paramKey";

function useTitle() {
    let [params, ] = useSearchParams();
    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            return 'Settings';
        }
        case ProjectScreen.File: {
            let file = params.get(ParamKey.ProjectFile)!;
            return basename(file);
        }
        case ProjectScreen.Log: {
            return 'Console';
        }
    }
}

export default useTitle;