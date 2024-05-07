import { useMemo, useState } from "react";
import { EnsureRemote } from "../../ensureremote";
import useSsh from "../../../hooks/useSsh";
import { LocalNative } from "../../../natives";
import { NativeContext } from "../../../natives/nativeContext";
import ProjectMain from './project';
import { RemoteNative } from "../../../natives/remote";

function Project() {
    let [ready, setReady] = useState(false);

    let key = useSsh();
    let integration = useMemo(() => {
        return key ? new RemoteNative(key) : new LocalNative();
    }, [key]);

    if (!ready) {
        return (
            <>
                <NativeContext.Provider value={integration}>
                    <EnsureRemote onReady={() => setReady(true)} />
                </NativeContext.Provider>
            </>
        )
    }

    return (
        <>
            <NativeContext.Provider value={integration}>
                <ProjectMain />
            </NativeContext.Provider>
        </>
    )
}

export default Project;