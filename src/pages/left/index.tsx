import { Routes, Route } from 'react-router-dom'
import Dashboard, { route } from './dashboard'
function Left() {
    return (
        <Routes>
            <Route path={route} element={<Dashboard />} />
        </Routes>
    )
}

export default Left;