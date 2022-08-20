import { normalize } from "path";
import { useEffect, useState } from "react";
import { useMatch, useSearchParams } from "react-router-dom"
import { Settings } from "../../../interfaces";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { readSettingsFileSync } from "../../../utils/settingsFile";
import File from "./file/";
import SettingsSubPage from "./settings/";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let m = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let { path } = m.params;
    let [params, ] = useSearchParams();
    let [settings, setSettings] = useState<Settings | null>();
    let [originalSettings, setOriginalSettings] = useState<Settings | null>(null);
    let [error, setError] = useState<string>('');
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
    }

    useEffect(() => onOpenProject?.(path!), [onOpenProject, path]);
    useEffect(() => {
        try {
            let setting = readSettingsFileSync(path!);
            setSettings(setting);
            setOriginalSettings(setting);
        } catch (e) {
            setError(`${e}`)
        }
    }, [path]);

    return (
        <div className="h-full">
            {content}
        </div>
    )
}

export default Project;