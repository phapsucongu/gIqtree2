import { useState } from "react";
import { EnsureRemote } from "../../ensureremote";
import useSsh from "../../../hooks/useSsh";
import { LocalNative } from "../../../natives";
import { NativeContext } from "../../../natives/nativeContext";
import ProjectMain from './project';

function Project() {
    let [ready, setReady] = useState(false);

    let key = useSsh();
    let integration = key ? new LocalNative() : new LocalNative();


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