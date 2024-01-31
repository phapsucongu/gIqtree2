import { ipcRenderer } from "electron-better-ipc";
import { join } from "path";
import { useNavigate, useSearchParams } from "react-router-dom";
import rimraf from "rimraf";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import { getBinaryPath, getBinaryPathRemote } from "../../../../platform";
import { NegativeButton, PositiveButton } from "../components/actionButton";
import { getOutputFolder } from "../folder";
import useExecutionState from "./useExecutionState";
import { WrapLogoLight, WrapLogoOpaque } from "../../../../icons";
import useSsh from "../../../../hooks/useSsh";

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
    canSaveSettings?: boolean
}

function useActionButtons(
    { path, preparedCommand, preparedCommandWithRedo, onSaveSettings, wordWrap, canSaveSettings } : ActionButtonsConfig
) {
    let [params, ] = useSearchParams();
    let navigate = useNavigate();
    let [executing, refresh] = useExecutionState(path);
    let ssh = useSsh();

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
        )

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            return (
                <>
                    <NegativeButton onClick={() => navigate(-1)}>
                        Cancel
                    </NegativeButton>
                    <PositiveButton
                        disabled={!canSaveSettings}
                        onClick={() => {
                            onSaveSettings?.();
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
                                ipcRenderer.callMain(ssh ? 'kill_ssh' : 'kill', path);
                            }}>
                            Pause
                        </NegativeButton>
                    )}
                    {!executing && (
                        <NegativeButton
                            disabled={executing}
                            onClick={async () => {
                                await ipcRenderer.callMain(ssh ? 'spawn_ssh' : 'spawn', {
                                    id: path,
                                    arguments: preparedCommand,
                                    binary: ssh ? getBinaryPathRemote() : getBinaryPath(),
                                    cwd: ssh ? '' : path,
                                    connection: ssh
                                });
                                refresh();
                            }}>
                            Continue
                        </NegativeButton>
                    )}
                    <PositiveButton
                        disabled={executing}
                        onClick={async () => {
                            // TODO: Handle remote
                            rimraf.sync(join(getOutputFolder(path), '*'));
                            console.log(ssh ? 'spawn_ssh' : 'spawn');
                            await ipcRenderer.callMain(ssh ? 'spawn_ssh' : 'spawn', {
                                id: path,
                                arguments: preparedCommandWithRedo,
                                binary: ssh ? getBinaryPathRemote() : getBinaryPath(),
                                cwd: ssh ? '' : path,
                                connection: ssh
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