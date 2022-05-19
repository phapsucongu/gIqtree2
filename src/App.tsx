import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import TitleBar from "./components/titlebar";
import Dashboard from './pages/dashboard';
import Project from './pages/project';
import New from './pages/new';
import BinaryDownload from './pages/binarydownload';
import { ipcRenderer } from 'electron-better-ipc';

function App() {
    let [ready, setReady] = useState(false);

    if (!ready) {
        return <BinaryDownload onReady={() => setReady(true)} />
    }

    return (
        <HashRouter>
            <div className='sticky top-0 bg-white drop-shadow-lg mb-2'>
                <TitleBar />
            </div>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/project" element={<Project onOpenProject={path => {
                    ipcRenderer.callMain('db_record', path);
                }} />} />
                <Route path="/new" element={<New />} />
            </Routes>
        </HashRouter>
    )
}

export default App;