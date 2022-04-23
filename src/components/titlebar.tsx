import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faList } from '@fortawesome/free-solid-svg-icons'
import { faWindowMaximize, faWindowMinimize, faSquarePlus, faFolderOpen, faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import './titlebar.css';

import { dialog } from '@electron/remote';
import { Link } from 'react-router-dom';
import { useWindow } from '../hooks/useWindow';

function TitleBar() {
    let window = useWindow();
    let [maximized, setMaximized] = useState(window?.isMaximized || false);
    let [, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    useEffect(() => {
        if (window) {
            window
                .on('maximize', () => setMaximized(true))
                .on('unmaximize', () => setMaximized(false));
        }
    });

    return (
        <div className='flex flex-row justify-between border-b-2 border-cyan-900 mb-2'>
            <div className='flex flex-row'>
                <div className='titlebar-button'>
                    <img alt="gIqtree" src="/icon.png" className='h-12' />
                </div>

                <Link to="/dashboard" className='titlebar-button flex top-link'>
                    <FontAwesomeIcon icon={faList} className="top-link-icon" />
                    <div>Dashboard</div>
                </Link>
                <button
                    className='titlebar-button flex top-link'
                    onClick={() => {
                        navigate('/new');
                        navigate(0);
                    }}>
                    <FontAwesomeIcon icon={faSquarePlus} className="top-link-icon" />
                    <div className='self-center'>
                        New
                    </div>
                </button>
                <button
                    className='titlebar-button flex top-link'
                    onClick={() => {
                        if (!window) return;

                        let folder = dialog.showOpenDialogSync(window, {
                            title: "Choose a project folder",
                            properties: ['openDirectory']
                        });

                        if (folder) {
                            navigate({
                                pathname: "/project",
                                search: createSearchParams({ path: folder[0] }).toString()
                            });
                            navigate(0);
                            setSearchParams({
                                path: folder[0]
                            });
                        }
                    }}>
                    <FontAwesomeIcon icon={faFolderOpen} className="top-link-icon" />
                    <div className='self-center'>
                        Open
                    </div>
                </button>
            </div>
            <div className='flex flex-row'>
                <button
                    className='titlebar-button hover:bg-neutral-300'
                    onClick={() => window?.minimize()}>
                    <FontAwesomeIcon icon={faWindowMinimize} className="h-10 pb-2 w-12" />
                </button>
                <button
                    className='titlebar-button hover:bg-neutral-300'
                    onClick={() => maximized ? window?.unmaximize() : window?.maximize()}>
                    <FontAwesomeIcon icon={maximized ? faWindowRestore : faWindowMaximize} className="h-12 w-12" />
                </button>
                <button
                    className='titlebar-button hover:bg-red-400'
                    onClick={() => window?.close()}>
                    <FontAwesomeIcon icon={faXmark} className="h-12 w-12" />
                </button>
            </div>
        </div>
    )
}

export default TitleBar;