import { normalize } from "path";
import { useMatch } from "react-router-dom"
import { AppRoute } from "../../routes";

export default () => {
    let m = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let { path } = m.params;
    return (
        <div className='pl-6'>
            {path}
        </div>
    )
}