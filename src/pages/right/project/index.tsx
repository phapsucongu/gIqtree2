import { normalize } from "path";
import { useEffect } from "react";
import { useMatch, useSearchParams } from "react-router-dom"
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import File from "./file/";
import Settings from "./settings/";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let m = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let { path } = m.params;
    let [params, ] = useSearchParams();
    let content = <></>;

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            content = <Settings />;
            break;
        }
        case ProjectScreen.File: {
            content = <File />
            break;
        }
    }

    useEffect(() => onOpenProject?.(path!), [onOpenProject, path]);
    return (
        <div className="h-full">
            {content}
        </div>
    )
}

export default Project;