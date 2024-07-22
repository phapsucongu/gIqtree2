import { normalize } from 'path';
import { Routes, Route } from 'react-router-dom'
import { AppRoute } from '../../routes';
import Dashboard from './dashboard/index';
import Project from './project/index';
function Left() {
    return (
        <Routes>
            <Route path={AppRoute.Dashboard} element={<Dashboard />} />
            <Route path={normalize(AppRoute.Project + '/:path')}  element={<Project />} />
        </Routes>
    )
}

export default Left;