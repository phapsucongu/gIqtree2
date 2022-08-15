import { dialog } from "@electron/remote";
import { ipcRenderer } from "electron-better-ipc";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useWindow } from "../../../hooks/useWindow";
import { getTemplateSettings, TemplateType, TemplateTypes } from "../../../templates";
import type { Record } from '../../right/dashboard';
import { normalize, join } from 'path';
import { accessSync, constants, existsSync, lstatSync, mkdirSync } from "fs";
import { hasSettingsFileSync, writeSettingsFileSync } from "../../../utils/settingsFile";
import Select from 'react-select';
import './createModal.css';
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../../routes";

interface ModalProps extends ReactModal.Props {
    template: TemplateType | 0;
    onClose?: () => void;
    onSetTemplate?: (template: TemplateType | 0) => void;
}

const templateOptions = [
    { type: 0, name: 'Blank Project' },
    ...TemplateTypes
]
    .map(entry => ({
        value: entry.type,
        label: entry.name
    }));


let inputTextStyles = "w-full p-2 input-bordered";
let buttonBaseStyles = "text-white py-2 px-4 rounded-lg";

export default (props: ModalProps) => {
    let window = useWindow();
    let navigate = useNavigate();
    let [name, setName] = useState('');
    let [basePath, setBasePath] = useState('');

    let { template, onClose, onSetTemplate } = props;

    useEffect(() => {
        ipcRenderer.callMain('db_list')
            .then(r => {
                let record = (r as Record[]);
                if (record.length !== 0)
                    setBasePath(normalize(join(record[0].path, '..')));
            })
    }, [])

    let validPath = false;
    let error = '', tolerable = false;
    let pathToMakeAndNavigate = join(...(name ? [basePath, name] : [basePath]));
    try {
        if (basePath) {
            let lstat = lstatSync(basePath);
            accessSync(basePath, constants.W_OK | constants.R_OK);

            validPath = lstat.isDirectory();
            if (!lstat.isDirectory()) {
                error = 'Path is not a directory!';
            }
            // ASCII test - iqtree2 does not seem to be able to handle Unicode on Windows?
            // eslint-disable-next-line
            if (!/^[\x00-\x7F]*$/.test(pathToMakeAndNavigate) && process.platform === 'win32') {
                error = 'Path needs to consist of ASCII characters only!'
            }
            if (hasSettingsFileSync(pathToMakeAndNavigate)) {
                error = 'Folder ALREADY contains a project - creating a new one WILL OVERWRITE IT!';
                tolerable = true;
            }
        }
    } catch {
        error = `Couldn't check the project path. Make sure the directory exists & it is writable.`;
    };

    return (
        <ReactModal
            {...props}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            onRequestClose={onClose}>
            <div className="flex flex-col gap-8 bg-white rounded-xl p-4 outline-none">
                <div className="font-arvo font-bold text-xl">
                    Create project
                </div>
                {error && (
                    <b className={tolerable ? "text-yellow-500" : "text-red-500"}>
                        {error}
                    </b>
                )}
                {!error && basePath && (
                    <div>
                        The project folder will be <span className="underline font-light text-gray-500">
                            {pathToMakeAndNavigate}
                        </span>
                    </div>
                )}
                <div className="flex flex-col gap-10">
                    <div>
                        Name
                        <div>
                            <input
                                value={name || undefined}
                                onChange={e => setName(e.target.value)}
                                className={inputTextStyles}
                                placeholder="Your project name" />
                        </div>
                    </div>
                    <div>
                        Location
                        <div className={inputTextStyles + " flex flex-row items-center gap-2"}>
                            <input
                                className="flex-grow"
                                value={basePath || undefined}
                                onChange={e => setBasePath(e.target.value)}
                                placeholder="Choose a location" />
                            <button
                                className="font-bold"
                                onClick={() => {
                                    if (!window) return;

                                    let folder = dialog.showOpenDialogSync(window, {
                                        title: "Choose a project folder",
                                        properties: ['openDirectory']
                                    });

                                    if (folder) {
                                        setBasePath(folder[0]);
                                    }
                                }}>
                                . . .
                            </button>
                        </div>
                    </div>
                    <div>
                        Template
                        <div>
                            <Select
                                classNamePrefix="react-select"
                                isMulti={false}
                                options={templateOptions}
                                value={templateOptions.find(t => t.value === template)}
                                onChange={(v: any) => onSetTemplate?.(v.value as TemplateType | 0)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-end gap-6">
                    <button
                        onClick={onClose}
                        className={buttonBaseStyles + " bg-gray-600"}>
                        Cancel
                    </button>
                    <button
                        disabled={(!!error && !tolerable) || !validPath}
                        className={buttonBaseStyles + " bg-pink-600 disabled:bg-pink-300"}
                        onClick={() => {
                            if (!existsSync(pathToMakeAndNavigate)) {
                                mkdirSync(pathToMakeAndNavigate);
                            }
                            writeSettingsFileSync(pathToMakeAndNavigate, getTemplateSettings(template || undefined));
                            navigate({
                                pathname: normalize(AppRoute.Project + '/' + encodeURIComponent(pathToMakeAndNavigate))
                            })
                        }}>
                        Create
                    </button>
                </div>
            </div>
        </ReactModal>
    )
}