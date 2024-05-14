import { join } from "path";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../../paramKey";
import { getBinaryPath, getBinaryPathRemote } from "../../../../platform";
import { NegativeButton, PositiveButton } from "../components/actionButton";
import { getOutputFolder } from "../folder";
import useExecutionState from "./useExecutionState";
import { WrapLogoLight, WrapLogoOpaque } from "../../../../icons";
import useSsh from "../../../../hooks/useSsh";
import { useContext } from "react";
import { NativeContext } from "../../../../natives/nativeContext";
import { Settings } from "../../../../interfaces";

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
    settings?: Settings
}

function useActionButtons(
    { path, preparedCommand, preparedCommandWithRedo, onSaveSettings, wordWrap, canSaveSettings, settings } : ActionButtonsConfig
) {
    let [params, ] = useSearchParams();
    let navigate = useNavigate();
    let [executing, refresh] = useExecutionState(path);
    let ssh = useSsh();
    let native = useContext(NativeContext);

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
                                native.killAllTask(path);
                            }}>
                            Pause
                        </NegativeButton>
                    )}
                    {!executing && (
                        <NegativeButton
                            disabled={executing}
                            onClick={async () => {
                                native.spawn(preparedCommand.map(command => {
                                    return {
                                        id: path,
                                        arguments: command,
                                        binary: ssh ? getBinaryPathRemote() : getBinaryPath()!,
                                        cwd: path,
                                        host: ssh,
                                        submitCommand: settings?.others?.submitCommand,
                                        submitTemplate: settings?.others?.submitTemplate,
                                        checkCommand: settings?.others?.checkCommand
                                    }
                                }))
                                refresh();
                            }}>
                            Continue
                        </NegativeButton>
                    )}
                    <PositiveButton
                        disabled={executing}
                        onClick={async () => {
                            native.rimraf({
                                path: join(getOutputFolder(path), '*'),
                                host: ssh
                            })
                                .then(() => {
                                    native.spawn(preparedCommandWithRedo.map(command => {
                                        return {
                                            id: path,
                                            arguments: command,
                                            binary: ssh ? getBinaryPathRemote() : getBinaryPath()!,
                                            cwd: path,
                                            host: ssh,
                                            submitCommand: settings?.others?.submitCommand,
                                            submitTemplate: settings?.others?.submitTemplate,
                                            checkCommand: settings?.others?.checkCommand
                                        }
                                    }))
                                })
                            refresh();
                        }}>
                        Submit
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