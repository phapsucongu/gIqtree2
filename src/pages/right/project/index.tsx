import { normalize } from "path";
import { useEffect, useState } from "react";
import { useMatch, useSearchParams } from "react-router-dom"
import { Settings } from "../../../interfaces";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import { readSettingsFileSync } from "../../../utils/settingsFile";
import File from "./file/";
import SettingsSubPage from "./settings/";
import useTitle from "./useTitle";

function Project({ onOpenProject } : { onOpenProject?: (path: string) => void }) {
    let m = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let title = useTitle();
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
            <div  className="h-full font-mono">
                <div className="flex flex-row items-center justify-between border-b border-b-black/10 py-2">
                    <b className="font-arvo py-4 pl-6">
                        {title}
                    </b>
                </div>
                {content}
            </div>
        </div>
    )
}

export default Project;