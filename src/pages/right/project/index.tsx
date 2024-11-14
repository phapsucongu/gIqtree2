import { basename, join, normalize } from "path";
import { useCallback, useContext, useEffect, useState } from "react";
import { useMatch, useSearchParams } from "react-router-dom";
import { Settings } from "../../../interfaces";
import { DateInfoType } from "../../../interfaces/datingSettings";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { readSettingsFileSync, writeSettingsFileSync } from "../../../utils/settingsFile";
import Console from "./console/index";
import File from "./file/index";
import SettingsSubPage from "./settings/index";
import useActionButtons from "./hooks/useActionButtons";
import useTitle from "./hooks/useTitle";
import { prepareCommand } from "../../../command/index";
import { getInputFolder, getOutputFolder } from "./folder";
import useWindowsButtons from "../../../hooks/useWindowsButtons";
import useResizeObserver from "use-resize-observer";
import { HeightContext } from "../../../App";
import Copy from "./copy";
import remap from "../../../utils/remapInputFiles";
import listDependentFileEntries from "../../../utils/listDependentFileEntries";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let height = useContext(HeightContext);
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
                onReady={(copied) => {
                    let remapped = remap(settings!, copied);
                    writeSettingsFileSync(path, remapped)
                    setOriginalSettings(remapped);
                    setSettings(remapped);
                    setSearchParams({ ...params, [ParamKey.ProjectScreen]: ProjectScreen.Log })
                }} />
        }
    }

    useEffect(() => onOpenProject?.(path), [onOpenProject, path]);
    useEffect(() => {
        try {
            let setting = readSettingsFileSync(path);
            setSettings(setting);
            setOriginalSettings(setting);
        } catch (e) {
            setError(`${e}`)
        }
    }, [path]);

    
    let preparedCommand: string[][] = [], preparedCommandWithRedo: string[][] = [];
    if (settings) {
        
        preparedCommand = prepareCommand(originalSettings!, 'output', getOutputFolder(path), true);
        preparedCommandWithRedo = prepareCommand(originalSettings!, 'output', getOutputFolder(path));
    }

    preparedCommand = preparedCommand.map(cmd => formatCommand(cmd));
    preparedCommandWithRedo = preparedCommandWithRedo.map(cmd => formatCommand(cmd));

    //console.log(preparedCommand);
    //console.log(preparedCommandWithRedo);

    let actions = useActionButtons(
        {
            path,
            preparedCommand,
            preparedCommandWithRedo,
            onSaveSettings: () => {
                if (settings) {
                    setOriginalSettings(settings);
                    writeSettingsFileSync(path, settings);
                }
            },
            wordWrap: {
                enabled: wordWrap,
                onChange: (e) => setWordWrap(e)
            },
            canSaveSettings: (originalSettings !== settings&& !(settings?.dating.dateInfoType === DateInfoType.Ancestral  && !settings?.dating.dateFile)),
        },
    );

    return (
        <div className="h-full">
            <div ref={titleRef} className="flex flex-row items-center justify-between border-b border-b-black/10 py-2 window-draggable">
                <b className="font-arvo py-4 pl-6 justify-self-start ">
                    {title}
                </b>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-row gap-8 pr-4">
                        {actions}
                    </div>
                    <div className="flex flex-row gap-8 pr-4 ">
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
