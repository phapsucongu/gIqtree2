import { ipcRenderer } from "electron-better-ipc";
import { basename, normalize, sep } from "path";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppRoute } from "../../routes";
import { TemplateType } from "../../templates"
import { readSettingsFileSync } from "../../utils/settingsFile";
import { ClockIcon, FileIcon } from "./icons"

const types = [
    { name: "Blank Project", type: null },
    { name: "Find Model", type: TemplateType.FindModel },
    { name: "Merge Partitions", type: TemplateType.MergePartitions },
    { name: "Infer Tree", type: TemplateType.InferTree },
    { name: "Assess Support", type: TemplateType.AssessSupport },
    { name: "Date Tree", type: TemplateType.DateTree },
]

export type Record = { path: string, timestamp: string };

export default () => {
    let [records, setRecord] = useState<Record[]>([]);
    let [loading, setLoading] = useState(true);

    let load = () => {
        ipcRenderer.callMain('db_list')
            .then(r => setRecord(
                (r as Record[]).sort((r1, r2) => r2.timestamp.localeCompare(r1.timestamp))
            ))
            .then(r => setLoading(false));
    }

    useEffect(load, []);

    const createSection = (
        <>
            <div className="flex flex-row gap-8 items-end">
                <FileIcon />
                <b className="font-arvo">
                    Create
                </b>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 lg:grid-cols-6 pt-4">
                {types.map(t => (
                    <button
                        key={t.name}
                        className="drop-shadow-lg bg-white rounded-lg p-2">
                        {t.name}
                    </button>
                ))}
            </div>
        </>
    );

    const recentSection = (
        <>
            <div className="flex flex-row gap-8 items-end">
                <ClockIcon />
                <b className="font-arvo">
                    Recent
                </b>
            </div>
            <div className="pt-6 flex flex-col gap-2">
                {records.map(r => {
                    let valid = true;
                    try {
                        readSettingsFileSync(r.path);
                    }
                    catch { valid = false };

                    let content = (
                        <div className="p-6 bg-gray-200">
                            <div className={valid ? '' : 'opacity-50 line-through'}>
                                {basename(r.path)}
                            </div>
                            {!valid && (
                                <span className='font-bold text-red-400'>
                                    Could not read from the setting file (project setting corrupt?)
                                </span>
                            )}
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

                    return (
                        valid
                        ? (
                            <Link key={r.path} to={normalize(AppRoute.Project + "/" + encodeURIComponent(r.path))}>
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
        <div className="p-6">
            {createSection}
            <br />
            <br />
            {recentSection}
        </div>
    )
}