import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faList } from '@fortawesome/free-solid-svg-icons'
import { faWindowMaximize, faWindowMinimize, faSquarePlus, faFolderOpen, faWindowRestore } from '@fortawesome/free-regular-svg-icons';
import './titlebar.css';

import { app, dialog } from '@electron/remote';
import { Link } from 'react-router-dom';
import { useWindow } from '../hooks/useWindow';
import { useWindowMaximized } from '../hooks/useWindowMaximized';

function TitleBar() {
    let window = useWindow();
    let maximized = useWindowMaximized();
    let [, setSearchParams] = useSearchParams();
    let navigate = useNavigate();

    return (
        <div className='draggable flex flex-row justify-between border-b-2 border-cyan-900'>
            <div className='flex flex-row'>
                <div className='titlebar-button'>
                    <img alt="gIqtree" src={app.isPackaged ? "./icon.png" : "/icon.png"} className='h-8' />
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
                    <FontAwesomeIcon icon={faWindowMinimize} className="h-6 w-8" />
                </button>
                <button
                    className='titlebar-button hover:bg-neutral-300'
                    onClick={() => maximized ? window?.unmaximize() : window?.maximize()}>
                    <FontAwesomeIcon icon={maximized ? faWindowRestore : faWindowMaximize} className="h-6 w-6" />
                </button>
                <button
                    className='titlebar-button hover:bg-red-400'
                    onClick={() => window?.close()}>
                    <FontAwesomeIcon icon={faXmark} className="h-8 w-8" />
                </button>
            </div>
        </div>
    )
}

export default TitleBar;