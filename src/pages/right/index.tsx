import { normalize } from "path"
import { Routes, Route } from "react-router-dom"
import { AppRoute } from "../../routes"
import Dashboard from "./dashboard"
import Project from "./project"

export default () => {
    return (
        <Routes>
            <Route path={AppRoute.Dashboard} element={<Dashboard />} />
            <Route path={normalize(AppRoute.Project + '/:path')}  element={<Project />} />
        </Routes>
    )
}