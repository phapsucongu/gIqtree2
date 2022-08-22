import { ipcRenderer } from "electron-better-ipc";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import { getBinaryPath } from "../../../../platform";
import { NegativeButton, PositiveButton } from "../components/actionButton";
import useExecutionState from "./useExecutionState";

function useActionButtons(
    path: string,
    preparedCommand: string[][],
    preparedCommandWithRedo: string[][],
    onSaveSettings: () => void | undefined
) {
    let [params, ] = useSearchParams();
    let navigate = useNavigate();
    let [executing, refresh] = useExecutionState(path);

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            return (
                <>
                    <NegativeButton onClick={() => navigate(-1)}>
                        Cancel
                    </NegativeButton>
                    <PositiveButton
                        onClick={() => {
                            onSaveSettings?.();
                            navigate(-1)
                        }}>
                        Save
                    </PositiveButton>
                </>
            )
        }
        case ProjectScreen.Log: {
            return (
                <>
                    <NegativeButton
                        disabled={!executing}
                        onClick={() => {
                            ipcRenderer.callMain('kill', path);
                        }}>
                        Pause
                    </NegativeButton>
                    <NegativeButton
                        disabled={executing}
                        onClick={async () => {
                            await ipcRenderer.callMain('spawn', {
                                id: path,
                                arguments: preparedCommand,
                                binary: getBinaryPath()
                            });
                            refresh();
                        }}>
                        Continue
                    </NegativeButton>
                    <PositiveButton
                        disabled={executing}
                        onClick={async () => {
                            await ipcRenderer.callMain('spawn', {
                                id: path,
                                arguments: preparedCommandWithRedo,
                                binary: getBinaryPath()
                            });
                            refresh();
                        }}>
                        Execute
                    </PositiveButton>
                </>
            )
        }
        default: return null;
    }
}

export default useActionButtons;