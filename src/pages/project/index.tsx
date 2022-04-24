import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Settings } from '../../interfaces';
import { readSettingsFileSync, writeSettingsFileSync } from '../../utils/settingsFile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faForward, faSliders } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlay, faFolder, faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { basename } from 'path';
import ProjectSetting from './settings';
import ProjectMain from './main';

import { prepareCommand } from '../../command';
import { ipcRenderer } from 'electron-better-ipc';
import { ChildProcess } from 'child_process';
import { getOutputFolder } from './projectFolder';
import { getBinaryPath } from '../../platform';

function Project() {
    let [searchParams] = useSearchParams();
    let [settings, setSettings] = useState<Settings | null>(null)
    let [error, setError] = useState<string>('');
    let [openSetting, setOpenSetting] = useState(true);
    let [executing, setExecuting] = useState(false);
    let [log, setLog] = useState('');
    const path = searchParams.get('path')!

    useEffect(() => {
        try {
            let setting = readSettingsFileSync(path);
            setSettings(setting);
        } catch (e) {
            setError(`${e}`)
        }
    }, [path]);

    useEffect(() => {
        let interval = setInterval(async () => {
            let result: string | false = await ipcRenderer.callMain('get-stdout', path);
            if (result) {
                setLog(result);
            }

            let process: ChildProcess | false = await ipcRenderer.callMain('get', path);
            if (process) {
                setExecuting(process.exitCode === null);
            }
        }, 500);
        return () => clearInterval(interval);
    });

    if (error) {
        return (
            <div>
                Error occurred :
                <br />{error}
            </div>
        )
    }

    let preparedCommand : string[] = [];
    if (settings)
        preparedCommand = prepareCommand(settings, 'output', getOutputFolder(path));

    return (
        <div className='pt-1 grow flex flex-col'>
            <div className='flex flex-row justify-between'>
                <div className='flex flex-row items-center gap-4 text-2xl font-bold pl-4'>
                    {!settings?.name && <FontAwesomeIcon icon={faFolder} className='h-8' />}
                    <div>{settings?.name ?? basename(path)}</div>
                </div>
                <div className='flex flex-row gap-2 pr-2 w-1/2 justify-end items-center'>
                    <button
                        className={
                            'top-bar-button w-1/4 hover:border-cyan-500 hover:bg-cyan-200 '
                            + 'active:bg-cyan-700 active:text-white active:border-cyan-800 '
                            + (openSetting ? 'border-cyan-200 bg-cyan-100' : '')
                        }
                        onClick={() => setOpenSetting(!openSetting)}>
                        <div className='flex items-center'>
                            <FontAwesomeIcon icon={faSliders} className='top-bar-button-icon' />
                        </div>
                        <div>Settings</div>
                        <div></div>
                    </button>
                    {settings && openSetting && (
                        <button
                            className='top-bar-button w-1/4 hover:border-gray-500 hover:bg-gray-100 active:border-black active:text-white'
                            onClick={() => {
                                if (settings) writeSettingsFileSync(path, settings)
                                setOpenSetting(false);
                            }}>
                            <div className='flex items-center'>
                                <FontAwesomeIcon icon={faFloppyDisk} className='top-bar-button-icon' />
                            </div>
                            <div>Save</div>
                            <div></div>
                        </button>
                    )}
                    <button
                        className='top-bar-button w-1/4 top-bar-button-colored'
                        disabled={executing}
                        onClick={async () => {
                            await ipcRenderer.callMain('spawn', {
                                id: path,
                                arguments: preparedCommand,
                                binary: getBinaryPath()
                            });
                            setExecuting(true);
                            setOpenSetting(false);
                        }}>
                        <div className='flex items-center'>
                            <FontAwesomeIcon icon={faCirclePlay} className='top-bar-button-icon' />
                        </div>
                        <div>{executing ? 'Executing...' : 'Execute'}</div>
                        <div></div>
                    </button>
                    <button className='top-bar-button w-1/4 top-bar-button-colored'>
                        <div className='flex items-center'>
                            <FontAwesomeIcon icon={faPause} className='top-bar-button-icon' />
                        </div>
                        <div>Pause</div>
                        <div></div>
                    </button>
                    <button className='top-bar-button w-1/4 top-bar-button-colored'>
                        <div className='flex items-center'>
                            <FontAwesomeIcon icon={faForward} className='top-bar-button-icon' />
                        </div>
                        <div>Continue</div>
                        <div></div>
                    </button>
                </div>
            </div>
            {openSetting && settings && <ProjectSetting setting={settings} onChange={setting => setSettings(setting)} />}
            {!openSetting && (
                <>
                    {executing && (
                        <div className='pt-2'>
                            <b>Executing :</b>
                            <code className='overflow-x-scroll'>
                                {preparedCommand.join(' ')}
                            </code>
                        </div>
                    )}
                    <div className='pt-2 grow flex flex-col'>
                        <ProjectMain log={log} projectPath={path} />
                    </div>
                </>
            )}
        </div>
    )
}

export default Project;