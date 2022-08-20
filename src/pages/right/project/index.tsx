import { normalize } from "path";
import { useEffect, useState } from "react";
import { useMatch, useSearchParams } from "react-router-dom"
import { Settings } from "../../../interfaces";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { readSettingsFileSync } from "../../../utils/settingsFile";
import Console from "./console";
import File from "./file/";
import SettingsSubPage from "./settings/";
import useActionButtons from "./hooks/useActionButtons";
import useTitle from "./hooks/useTitle";
import { prepareCommand } from "../../../command";
import { getOutputFolder } from "./folder";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let { params: { path = '' } } = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let [params, ] = useSearchParams();
    let [settings, setSettings] = useState<Settings | null>();
    let [originalSettings, setOriginalSettings] = useState<Settings | null>(null);
    let [error, setError] = useState<string>('');
    let title = useTitle();
    let content = <></>;

    switch (params.get(ParamKey.ProjectScreen)) {
        case ProjectScreen.Setting: {
            content = settings
                ? <SettingsSubPage setting={settings!} onChange={s => setSettings(s)} />
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
        preparedCommand = prepareCommand(originalSettings!, 'output', getOutputFolder(path));
        preparedCommandWithRedo = prepareCommand(originalSettings!, 'output', getOutputFolder(path), true);
    }

    let actions = useActionButtons(path, preparedCommand, preparedCommandWithRedo);

    return (
        <div className="h-full">
            <div className="flex flex-row items-center justify-between border-b border-b-black/10 py-2">
                <b className="font-arvo py-4 pl-6">
                    {title}
                </b>
                <div className="flex flex-row gap-8 pr-4">
                    {actions}
                </div>
            </div>
            {content}
        </div>
    )
}

export default Project;