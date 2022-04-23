import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import TitleBar from "./components/titlebar";
import Dashboard from './pages/dashboard';
import Project from './pages/project';
import New from './pages/new';
import BinaryDownload from './pages/binarydownload';

function App() {
    let [ready, setReady] = useState(false);

    if (!ready) {
        return <BinaryDownload onReady={() => setReady(true)} />
    }

    return (
        <HashRouter>
            <TitleBar />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/project" element={<Project />} />
                <Route path="/new" element={<New />} />
            </Routes>
        </HashRouter>
    )
}

export default App;