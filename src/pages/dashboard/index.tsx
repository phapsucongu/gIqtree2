import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ipcRenderer } from 'electron-better-ipc';
import { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
import { readSettingsFileSync } from '../../utils/settingsFile';

type Record = { path: string, timestamp: string };

function Dashboard() {
    let [records, setRecord] = useState<Record[]>([]);
    let [loading, setLoading] = useState(true);
    let navigate = useNavigate();
    let [, setSearchParams] = useSearchParams();

    let load = () => {
        ipcRenderer.callMain('db_list')
            .then(r => setRecord(
                (r as Record[]).sort((r1, r2) => r2.timestamp.localeCompare(r1.timestamp))
            ))
            .then(r => setLoading(false));
    }

    useEffect(load, []);

    if (loading)
        return (
            <>Loading...</>
        )

    return (
        <div className='p-2'>
            <h4 className='text-2xl font-bold'>
                Recent projects
            </h4>
            <br />
            <br />
            <table className='w-full'>
                <thead>
                    <tr className='text-left'>
                        <th>Path</th>
                        <th>Timestamp</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(r => {
                        let valid = true;
                        try {
                            readSettingsFileSync(r.path);
                        }
                        catch { valid = false };

                        let onClick = () => {
                            navigate({
                                pathname: "/project",
                                search: createSearchParams({ path: r.path }).toString()
                            });
                            navigate(0);
                            setSearchParams({
                                path: r.path
                            });
                        };

                        return (
                            <tr
                                key={r.path}
                                className={`border-y ${valid ? 'hover:bg-slate-200' : ''}`}>
                                <td className={valid ? 'cursor-pointer' : ''} onClick={valid ? onClick : undefined}>
                                    <span className={valid ? '' : 'text-slate-300 line-through'}>
                                        {r.path}
                                    </span>
                                    {!valid && (
                                        <>
                                            <br />
                                            <span className='font-bold text-red-400'>
                                                Could not read from the setting file (project setting corrupt?)
                                            </span>
                                        </>
                                    )}
                                </td>
                                <td className={valid ? 'cursor-pointer' : ''} onClick={valid ? onClick : undefined}>
                                    <TimeAgo date={r.timestamp} />
                                    <br />
                                    <span className="font-light text-slate-400">
                                        {new Date(r.timestamp).toLocaleString('vi-VN')}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className='p-3 bg-red-300 rounded-lg text-white hover:bg-red-500'
                                        onClick={() => {
                                            ipcRenderer.callMain('db_remove', r.path)
                                                .then(load);
                                        }}>
                                        <div className='flex flex-row items-center'>
                                            <FontAwesomeIcon icon={faClose} />
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard;