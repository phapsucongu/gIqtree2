import { ipcRenderer } from "electron-better-ipc";
import { join } from "path";
import { useNavigate, useSearchParams } from "react-router-dom";
import rimraf from "rimraf";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import { getBinaryPath } from "../../../../platform";
import { NegativeButton, PositiveButton } from "../components/actionButton";
import { getOutputFolder } from "../folder";
import useExecutionState from "./useExecutionState";

function useActionButtons(
    path: string,
    preparedCommand: string[][],
    preparedCommandWithRedo: string[][],
    onSaveSettings: () => void | undefined
) {
    let [params, setSearchParams] = useSearchParams();
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
                            setSearchParams({ ...params, [ParamKey.ProjectScreen]: ProjectScreen.Copy });
                        }}>
                        Save
                    </PositiveButton>
                </>
            )
        }
        case ProjectScreen.Log: {
            return (
                <>
                    {executing && (
                        <NegativeButton
                            disabled={!executing}
                            onClick={() => {
                                ipcRenderer.callMain('kill', path);
                            }}>
                            Pause
                        </NegativeButton>
                    )}
                    {!executing && (
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
                    )}
                    <PositiveButton
                        disabled={executing}
                        onClick={async () => {
                            rimraf.sync(join(getOutputFolder(path), '*'));
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