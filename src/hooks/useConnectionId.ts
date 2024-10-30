import { useSearchParams } from "react-router-dom";
import { ParamKey } from "../paramKey";

function useConnectionId() {
    let [params] = useSearchParams();

    let ssh = params.get(ParamKey.ConnectionId) || '';
    return +ssh;
}

export default useConnectionId;