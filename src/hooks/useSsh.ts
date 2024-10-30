import { useSearchParams } from "react-router-dom";
import { ParamKey } from "../paramKey";

function useSsh() {
    let [params] = useSearchParams();

    let ssh = params.get(ParamKey.SshConnection) || '';
    return ssh;
}

export default useSsh;