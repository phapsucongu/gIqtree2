import { ipcRenderer } from "electron-better-ipc";
import { join } from "path";
import { useNavigate, useSearchParams } from "react-router-dom";
import rimraf from "rimraf";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import { getBinaryPath } from "../../../../platform";
import { NegativeButton, PositiveButton } from "../components/actionButton";
import { getOutputFolder } from "../folder";
import useExecutionState from "./useExecutionState";
import { WrapLogoLight, WrapLogoOpaque } from "../../../../icons";
import { DateInfoType } from "../../../../interfaces/datingSettings";

interface WordWrapSettings {
    enabled: boolean,
    onChange: (enabled: boolean) => void;
}

interface ActionButtonsConfig {
    path: string,
    preparedCommand: string[][],
    preparedCommandWithRedo: string[][],
    onSaveSettings?: () => void | undefined,
    wordWrap?: WordWrapSettings,
    canSaveSettings?: boolean,
    datingSettings?: { dateInfoType: string; dateFile?: string; }
}

function useActionButtons(
    { path, preparedCommand, preparedCommandWithRedo, onSaveSettings, wordWrap, canSaveSettings, datingSettings } : ActionButtonsConfig
) {
    let [params, setSearchParams] = useSearchParams();
    let navigate = useNavigate();
    let [executing, refresh] = useExecutionState(path);
    let wordWrapButton = wordWrap?.enabled
    
        ? (
            <PositiveButton onClick={() => wordWrap?.onChange(!wordWrap?.enabled)}>
                <div className="flex flex-row gap-4">
                    <WrapLogoLight /> Word wrap
                </div>
            </PositiveButton>
        )
        : (
            <NegativeButton onClick={() => wordWrap?.onChange(!wordWrap?.enabled)}>
                <div className="flex flex-row gap-4">
                    <WrapLogoOpaque /> Word wrap
                </div>
            </NegativeButton>
        );

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            const isDating = datingSettings?.dateInfoType === DateInfoType.Ancestral && !datingSettings?.dateFile;

            return (
                <>
                    <NegativeButton onClick={() => navigate(-1)}>
                        Cancel
                    </NegativeButton>
                    <PositiveButton
                        disabled={!canSaveSettings || isDating} // Disable if required condition is not met
                        onClick={() => {
                            console.log(datingSettings);
                            if (isDating) {
                                alert("Date File is required");
                                return;
                            }
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
                                    binary: getBinaryPath(),
                                    cwd: path
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
                                binary: getBinaryPath(),
                                cwd: path
                            });
                            refresh();
                        }}>
                        Execute
                    </PositiveButton>
                </>
            )
        }
        case ProjectScreen.File: {
            return (
                <>
                    {wordWrapButton}
                </>
            )
        }
        default: return null;
    }
}

export default useActionButtons;
