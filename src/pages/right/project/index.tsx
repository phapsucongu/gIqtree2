import { normalize } from "path";
import { useContext, useEffect, useState } from "react";
import { useMatch, useSearchParams } from "react-router-dom"
import { Settings } from "../../../interfaces";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { readSettingsFileSync, writeSettingsFileSync } from "../../../utils/settingsFile";
import Console from "./console";
import File from "./file/";
import SettingsSubPage from "./settings/";
import useActionButtons from "./hooks/useActionButtons";
import useTitle from "./hooks/useTitle";
import { prepareCommand } from "../../../command";
import { getOutputFolder } from "./folder";
import useWindowsButtons from "../../../hooks/useWindowsButtons";
import useResizeObserver from "use-resize-observer";
import { HeightContext } from "../../../App";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let height = useContext(HeightContext);
    let { ref: titleRef, height: titleHeight } = useResizeObserver();

    let { params: { path = '' } } = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let [params, ] = useSearchParams();
    let [settings, setSettings] = useState<Settings | null>();
    let [originalSettings, setOriginalSettings] = useState<Settings | null>(null);
    let [, setError] = useState<string>('');
    let buttons = useWindowsButtons();
    let title = useTitle();
    let content = <></>;

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            content = settings
                ? <SettingsSubPage
                    setting={settings!}
                    onChange={s => {
                        setSettings(s);
                    }}/>
                : <></>
            break;
        }
        case ProjectScreen.File: {
            content = <File />
            break;
        }
        case ProjectScreen.Log: {
            content = <Console path={path} />;
            break;
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

    let preparedCommand : string[][] = [], preparedCommandWithRedo : string[][] = [];
    if (settings) {
        preparedCommand = prepareCommand(originalSettings!, 'output', getOutputFolder(path), true);
        preparedCommandWithRedo = prepareCommand(originalSettings!, 'output', getOutputFolder(path));
    }

    let actions = useActionButtons(
        path,
        preparedCommand,
        preparedCommandWithRedo,
        () => {
            if (settings) {
                setOriginalSettings(settings);
                writeSettingsFileSync(path, settings);
            }
        }
    );

    console.log(height - (titleHeight ?? 0));
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