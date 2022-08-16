import { normalize } from "path";
import { useEffect } from "react";
import { useMatch } from "react-router-dom"
import { AppRoute } from "../../routes";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let m = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let { path } = m.params;

    useEffect(() => onOpenProject?.(path!), [onOpenProject, path]);
    return (
        <div className='pl-6'>
            {path}
        </div>
    )
}

export default Project;