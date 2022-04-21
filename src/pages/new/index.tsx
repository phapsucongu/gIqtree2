import { faFloppyDisk, faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { dialog } from "@electron/remote";
import { useWindow } from "../../hooks/useWindow";
import { accessSync, constants, lstatSync } from "fs";
import { hasSettingsFileSync } from "../../utils/settingsFile";
import { useNavigate, createSearchParams, useSearchParams } from 'react-router-dom';

enum TemplateType {
    FindModel = 1,
    MergePartitions,
    InferTree,
    AssessSupport,
    DateTree
}

const types = [
    { name: "Find Model", type: TemplateType.FindModel },
    { name: "Merge Partitions", type: TemplateType.MergePartitions },
    { name: "Infer Tree", type: TemplateType.InferTree },
    { name: "Assess Support", type: TemplateType.AssessSupport },
    { name: "Date Tree", type: TemplateType.DateTree },

]

export default () => {
    let [name, setName] = useState<string | null>(null);
    let [currentType, setCurrentType] = useState<TemplateType>(TemplateType.FindModel);
    let [path, setPath] = useState('');
    let window = useWindow();
    let navigate = useNavigate();
    let [_, setSearchParams] = useSearchParams();

    let validPath = false;

    let error = '', tolerable = false;
    try {
        if (path) {
            let lstat = lstatSync(path);
            accessSync(path, constants.W_OK | constants.R_OK);

            validPath = lstat.isDirectory();
            if (!lstat.isDirectory()) {
                error = 'Path is not a directory!';
            }
            if (hasSettingsFileSync(path)) {
                error = 'Folder ALREADY contains a project - creating a new one WILL OVERWRITE IT!';
                tolerable = true;
            }
        }
    } catch {
        error = `Couldn't check the project path. Make sure the directory exists & it is writable.`;
    };

    return (
        <div>
            <div className="flex flex-row px-2 justify-between">
                <div className="text-2xl font-bold">
                    New project
                </div>
                <div>
                    <button
                        disabled={(!!error && !tolerable) || !validPath}
                        className="top-bar-button top-bar-button-colored"
                        onClick={() => {
                            navigate({
                                pathname: "/project",
                                search: createSearchParams({ path }).toString()
                            });
                            navigate(0);
                            setSearchParams({ path });
                        }}>
                        <div className='flex items-center'>
                            <FontAwesomeIcon icon={faFloppyDisk} className='top-bar-button-icon' />
                        </div>
                        <div>Create project</div>
                        <div></div>
                    </button>
                </div>
            </div>
            <div className="pt-3 flex flex-row gap-5">
                <div className="flex flex-col text-lg basis-1/6">
                    {types.map(type => (
                        <button
                            className={"text-left left-column-item " + (type.type === currentType ? 'left-column-item-chosen' : '')}
                            onClick={() => setCurrentType(type.type)}>
                            {type.name}
                        </button>
                    ))}
                </div>
                <div className="grow flex flex-col gap-4">
                    {error && (
                        <b className={tolerable ? "text-yellow-500" : "text-red-500"}>
                            {error}
                        </b>
                    )}
                    <div className="grid grid-cols-7 gap-8 pr-2">
                        <b className="flex flex-row place-items-center">
                            <div>Project name :</div>
                        </b>
                        <input
                            className="col-span-6 grow p-2 border-2 border-gray-400 rounded-lg"
                            type="text"
                            placeholder="Enter project name..."
                            value={name ?? undefined}
                            onChange={e => setName(e.target.value)} />
                        <b className="flex flex-row place-items-center">
                            <div>Project path :</div>
                        </b>
                        <div className="col-span-6 flex flex-row gap-4">
                            <input
                                className={
                                    "grow p-2 border-2 rounded-lg outline-none "
                                    + (!path || validPath ? 'border-gray-400' : 'border-red-600')
                                }
                                type="text"
                                placeholder="Enter path, or click the choose button"
                                value={path ?? undefined}
                                onChange={e => setPath(e.target.value)} />
                            <button
                                className="action-button"
                                onClick={() => {
                                    if (window) {
                                        let folder = dialog.showOpenDialogSync(window, {
                                            title: 'Choose project directory',
                                            properties: ['openDirectory']
                                        });

                                        if (folder) {
                                            setPath(folder[0]);
                                        }
                                    }
                                }}>
                                <FontAwesomeIcon icon={faFolderOpen} className="pr-2" />
                                Choose a folder
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}