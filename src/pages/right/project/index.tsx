import { basename, join, normalize } from "path";
import { useCallback, useContext, useEffect, useState } from "react";
import { useMatch, useSearchParams } from "react-router-dom";
import { Settings } from "../../../interfaces";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { readSettingsFileSync, writeSettingsFileSync } from "../../../utils/settingsFile";
import Console from "./console/index";
import File from "./file/index";
import SettingsSubPage from "./settings/index";
import useActionButtons from "./hooks/useActionButtons";
import useTitle from "./hooks/useTitle";
import { prepareCommand } from "../../../command/index";
import { ensureInputOutputFolder, getInputFolder, getOutputFolder } from "./folder";
import useWindowsButtons from "../../../hooks/useWindowsButtons";
import useResizeObserver from "use-resize-observer";
import { HeightContext } from "../../../App";
import Copy from "./copy";
import remap from "../../../utils/remapInputFiles";
import listDependentFileEntries from "../../../utils/listDependentFileEntries";
import BinaryDownload from "../../binarydownload";
import useSsh from "../../../hooks/useSsh";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let height = useContext(HeightContext);
    let [ready, setReady] = useState(false);
    let ssh = useSsh();
    let { ref: titleRef, height: titleHeight } = useResizeObserver();

    let { params: { path = '' } } = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let [params, setSearchParams] = useSearchParams();
    let [settings, setSettings] = useState<Settings | null>();
    let [originalSettings, setOriginalSettings] = useState<Settings | null>(null);
    let [, setError] = useState<string>('');
    let [wordWrap, setWordWrap] = useState(false);
    let buttons = useWindowsButtons();
    let title = useTitle(path);
    let content = <></>;

    let resetCallback = useCallback(() => {
        setSettings(originalSettings);
    }, [originalSettings]);

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            content = settings
                ? <SettingsSubPage
                    setting={settings!}
                    onChange={s => {
                        setSettings(s);
                    }}
                    onReset={resetCallback}/>
                : <></>
            break;
        }
        case ProjectScreen.File: {
            content = <File wrap={wordWrap} />
            break;
        }
        case ProjectScreen.Log: {
            content = <Console path={path} wrap={wordWrap} />;
            break;
        }
        case ProjectScreen.Copy: {
            content = <Copy
                files={
                    listDependentFileEntries(settings)
                        .map(f => {
                            return {
                                source: f,
                                destination: join(getInputFolder(path), basename(f))
                            }
                        })
                }
                onReady={async (copied) => {
                    let remapped = remap(settings!, copied);
                    await writeSettingsFileSync(path, remapped, ssh)
                        .then(() => {
                            setOriginalSettings(remapped);
                            setSettings(remapped);
                        })
                    setSearchParams({ ...params, [ParamKey.ProjectScreen]: ProjectScreen.Log, [ParamKey.SshConnection]: ssh })
                }} />
        }
    }

    useEffect(() => {
        ensureInputOutputFolder(path)
    }, [path])
    useEffect(() => onOpenProject?.(path), [onOpenProject, path]);
    useEffect(() => {
        async function read() {
            try {
                let setting = await readSettingsFileSync(path, ssh);
                setOriginalSettings(setting);
                setSettings(setting);
            } catch (e) {
                setError(`${e}`)
            }
        }

        read();
    }, [path]);

    let preparedCommand : string[][] = [], preparedCommandWithRedo : string[][] = [];
    if (settings && originalSettings) {
        preparedCommand = prepareCommand(originalSettings!, 'output', getOutputFolder(path), true);
        preparedCommandWithRedo = prepareCommand(originalSettings!, 'output', getOutputFolder(path));
    }

    let actions = useActionButtons(
        {
            path,
            preparedCommand,
            preparedCommandWithRedo,
            onSaveSettings: () => {
                setSearchParams({ ...params, [ParamKey.ProjectScreen]: ProjectScreen.Copy, [ParamKey.SshConnection]: ssh });
                if (settings) {
                    setOriginalSettings(settings);
                    writeSettingsFileSync(path, settings, ssh);
                }
            },
            wordWrap: {
                enabled: wordWrap,
                onChange: (e) => setWordWrap(e)
            },
            canSaveSettings: originalSettings !== settings
        },
    );

    if (!ready) {
        return <BinaryDownload onReady={() => setReady(true)} />
    }

    return (
        <div className="h-full">
            <div ref={titleRef} className="flex flex-row items-center justify-between border-b border-b-black/10 py-2 window-draggable">
                <b className="font-arvo py-4 pl-6 justify-self-start window-draggable">
                    {title}
                </b>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-row gap-8 pr-4 window-draggable">
                        {actions}
                    </div>
                    <div className="flex flex-row gap-8 pr-4 window-draggable">
                        {buttons}
                    </div>
                </div>
            </div>
            <div
                style={{ height: (height - (titleHeight ?? 0)) || undefined }}>
                {content}
            </div>
        </div>
    )
}

export default Project;