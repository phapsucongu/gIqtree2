import { HashRouter, Routes, Route } from 'react-router-dom';
import TitleBar from "./components/titlebar";
import Dashboard from './pages/dashboard';
import Project from './pages/project';

export default () => (
    <>
        <HashRouter>
            <TitleBar />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/project" element={<Project />} />
            </Routes>
        </HashRouter>
    </>
)