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

function formatCommand(command: string[]): string[] {
    let formattedCommand = [...command];

    if (formattedCommand.includes("-m") && formattedCommand.includes("MFP")) {
        const mIndex = formattedCommand.indexOf("-m");
        const mfpIndex = mIndex + 1;

        if (formattedCommand[mfpIndex] === "MF") {
            const nIndex = formattedCommand.indexOf("-n");
            if (nIndex !== -1 && formattedCommand[nIndex + 1] === "0") {
                formattedCommand.splice(nIndex, 2);
            }
        }
    }

    if (formattedCommand.includes("-m") && formattedCommand.includes("TEST")) {
        const mIndex = formattedCommand.indexOf("-m");
        const testIndex = mIndex + 1;

        if (formattedCommand[testIndex] === "TEST") {
            const nIndex = formattedCommand.indexOf("-n");
            if (nIndex !== -1 && formattedCommand[nIndex + 1] === "0") {
                formattedCommand.splice(nIndex, 2);
            }
            formattedCommand[testIndex] = "TESTONLY";
        }
    }

    const tIndex = formattedCommand.indexOf("-t");
    if (tIndex !== -1 && formattedCommand.includes("-n") && formattedCommand.includes("0")) {
        const nIndex = formattedCommand.indexOf("-n");
        if (nIndex !== -1 && formattedCommand[nIndex + 1] === "0") {
            formattedCommand.splice(nIndex, 2);
        }
        const treeFile = formattedCommand[tIndex + 1];
        formattedCommand[tIndex] = "-te";
        formattedCommand[tIndex + 1] = treeFile;
    }

    return formattedCommand;
}
