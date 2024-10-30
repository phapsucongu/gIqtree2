import { dialog } from "@electron/remote";
import { useCallback, useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useWindow } from "../../../hooks/useWindow";
import { getTemplateSettings, TemplateType, TemplateTypes } from "../../../templates";
import { normalize, join } from 'path';
import Select from 'react-select';
import './createModal.css';
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../../routes";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { LocalNative } from "../../../natives";
import { SettingsFile } from "../../../utils/settingsFile";
import { ipcRenderer } from "electron-better-ipc";

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

function CreateModal (props: ModalProps) {
    let window = useWindow();
    let navigate = useNavigate();
    let [name, setName] = useState('');
    let [basePath, setBasePath] = useState('');
    let [tolerable, setTolerable] = useState(false);
    let [error, setError] = useState('');
    let [validPath, setValidPath] = useState(false);

    let { template, onClose, onSetTemplate } = props;

    let native = new LocalNative();

    useEffect(() => {
        native.database_recent_list()
            .then(r => {
                if (r.length !== 0)
                    setBasePath(normalize(join(r[0].path, '..')));
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // let validPath = false;
    // let error = '', tolerable = false;
    let pathToMakeAndNavigate = join(...(name ? [basePath, name] : [basePath]));

    let check = useCallback(async () => {
        setValidPath(false);
        setError('');
        setTolerable(false);
        try {
            if (basePath) {
                let result : { result: boolean, is_dir: boolean } = await ipcRenderer.callMain('check_directory_writable', basePath);
                if (!result.result) {
                    throw new Error('project not writable or not existent');
                }

                setValidPath(result.is_dir);
                if (!result.is_dir) {
                    setError('Path is not a directory!');
                }
                // ASCII test - iqtree2 does not seem to be able to handle Unicode on Windows?
                // eslint-disable-next-line
                if (!/^[\x00-\x7F]*$/.test(pathToMakeAndNavigate) && process.platform === 'win32') {
                    setError('Path needs to consist of ASCII characters only!')
                }

                let hasSetting = await native.file_exists({ path: pathToMakeAndNavigate, host: '' });

                if (hasSetting) {
                    setError('Folder ALREADY contains a project - creating a new one WILL OVERWRITE IT!');
                    setTolerable(true);
                }
            }
        } catch {
            setError(`Couldn't check the project path. Make sure the directory exists & it is writable.`);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [basePath, pathToMakeAndNavigate])

    useEffect(() => {
        check();
    }, [pathToMakeAndNavigate, check]);



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
                        onClick={async () => {
                            await native.directory_create({ path: pathToMakeAndNavigate, host: '' }, true);
                            let settingsFile = new SettingsFile(native);
                            settingsFile.writeFile({
                                path: pathToMakeAndNavigate,
                                host: ''
                            }, getTemplateSettings(template || undefined))
                                .then(() => {
                                    navigate({
                                        pathname: normalize(
                                            AppRoute.Project + '/' + encodeURIComponent(pathToMakeAndNavigate)
                                            + '?' + ParamKey.ProjectScreen + '=' + ProjectScreen.Setting
                                        )
                                    })
                                });
                        }}>
                        Create
                    </button>
                </div>
            </div>
        </ReactModal>
    )
}

export default CreateModal;