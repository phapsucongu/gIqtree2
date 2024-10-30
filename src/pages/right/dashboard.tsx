import { basename, normalize, sep } from "path";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useWindowsButtons from "../../hooks/useWindowsButtons";
import { CloseLogo, MagnifierLogo } from "../../icons";
import { ParamKey, ProjectScreen } from "../../paramKey";
import { AppRoute } from "../../routes";
import { TemplateTypes } from "../../templates"
import { ClockIcon, FileIcon } from "./icons";
import { LocalNative } from "../../natives";
import { RecentRecord } from "../../interfaces/natives";
import { connectionKey } from "../../utils/connectionKey";
import { SettingsFile } from "../../utils/settingsFile";
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const types = [
    { name: "Blank Project", type: 0 },
    ...TemplateTypes
]

function Dashboard() {
    let [records, setRecord] = useState<RecentRecord[]>([]);
    let [search, setSearch] = useState('');
    let buttons = useWindowsButtons();
    let [validProjects, setValidProjects] = useState<Map<string, boolean>>(new Map());

    let nativeIntegration = new LocalNative();

    let load = () => {
        nativeIntegration.database_recent_list()
            .then(r => {
                setRecord(
                    r.sort((r1, r2) => r2.timestamp.localeCompare(r1.timestamp))
                );

                return r;
            })
            .then(async r => {
                let valid = r.map(record => {
                    if (!record.connectionId) {
                        let f = new SettingsFile(nativeIntegration);
                        return f.readFile({ path: record.path, host: '' })
                            .then(() => [record.path, true] as const)
                            .catch(() => [record.path, false] as const)
                    }
                    return Promise.resolve([] as const)
                });

                let p = await Promise.all(valid);
                setValidProjects(new Map(
                    p.filter(r => r.length !== 0) as [string, boolean][]
                ));
            })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(load, []);
    let filteredRecord = useMemo(() => {
        return records.filter(r => {
            if (!search) return true;
            return r.path.toLowerCase().includes(search.toLowerCase());
        })
    }, [search, records]);

    const createSection = (
        <>
            <div className="flex flex-row gap-8 items-end">
                <FileIcon />
                <b className="font-arvo">
                    Create
                </b>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:grid-cols-6 pt-4">
                {types.map(t => (
                    <Link
                        to={`?${ParamKey.NewDialog}=1&${ParamKey.NewTemplate}=${t.type}`}
                        key={t.name}
                        className="drop-shadow-lg bg-white rounded-lg p-2 flex flex-row items-center">
                        <div className="text-center flex-grow">
                            {t.name}
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );

    const recentSection = (
        <>
            <div className="flex flex-row justify-between pb-6 items-center">
                <div className="flex flex-row gap-8 h-fit">
                    <ClockIcon />
                    <b className="font-arvo">
                        Recent
                    </b>
                </div>
                <div className="px-2 flex flex-row gap-3 h-fit items-center border-2 border-gray-400 rounded-md">
                    <MagnifierLogo />
                    <input
                        onChange={e => {
                            setSearch(e.target.value);
                        }}
                        className="w-full p-2 pb-1"
                        placeholder="Search your project..."
                        />
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-grow overflow-y-auto my-2">
                {filteredRecord.map(r => {
                    let valid = validProjects.get(r.path) || false;
                    let isRemote = !!r.connectionId;

                    if (isRemote) {
                        valid = true;
                    }

                    let content = (
                        <div className="p-6 bg-gray-200" key={r.path}>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="flex-grow">
                                    <div className={valid ? '' : 'opacity-50 line-through'}>
                                        {basename(r.path)} {isRemote ? <FontAwesomeIcon icon={faLink} /> : <></>}
                                    </div>
                                    {!valid && !isRemote && (
                                        <span className='font-bold text-red-400'>
                                            Could not read from the setting file (project setting corrupt?)
                                        </span>
                                    )}
                                </div>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    nativeIntegration.database_recent_delete(r.id)
                                        .then(() => load())
                                }}>
                                    <CloseLogo />
                                </button>
                            </div>
                            <div className="pt-4 flex flex-row justify-between text-gray-500">
                                <div className="flex flex-row gap-3">
                                    {r.path.split(sep)
                                        .filter(Boolean)
                                        .map((section, index) => (
                                            <React.Fragment key={section}>
                                                {!!index && <div>&gt;&gt;</div>}
                                                <div>{section}</div>
                                            </React.Fragment>
                                        ))}
                                </div>
                                <div>{new Date(r.timestamp).toLocaleString('vi-VN')}</div>
                            </div>
                        </div>
                    )

                    let link = normalize(AppRoute.Project + "/" + encodeURIComponent(r.path))
                            + `?${ParamKey.ProjectScreen}=${ProjectScreen.Log}`;
                    if (isRemote) {
                        let c = r.connection!
                        link += `&${ParamKey.SshConnection}=${connectionKey(
                            c.host,
                            c.port,
                            c.username,
                            c.password
                        )}&${ParamKey.ConnectionId}=${r.connectionId}`;
                    }


                    return (
                        (valid || isRemote)
                        ? (
                            <Link key={r.path} to={link}>
                                {content}
                            </Link>
                        )
                        : content
                    )
                })}
            </div>
        </>
    )

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-row justify-end pt-2 pr-4 pb-6 window-draggable">
                {buttons}
            </div>
            {createSection}
            <br />
            <br />
            {recentSection}
        </div>
    )
}

export default Dashboard;