import { dialog } from '@electron/remote';
import { normalize } from 'path';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useWindow } from '../../../hooks/useWindow';
import { CreateLogo, FolderLogo, HomeLogo, IQTREELogo } from '../../../icons';
import { AppRoute } from '../../../routes';
import CreateModal from './createModal';

export default () => {
    let window = useWindow();
    let navigate = useNavigate();
    let [params, setSearchParams] = useSearchParams();

    return (
        <div className='pl-6'>
            <div className='flex flex-row items-center gap-2 py-6 font-arvo'>
                <IQTREELogo />
                <b className='text-lg'>IQ-TREE</b>
            </div>

            <CreateModal
                className="absolute top-1/4 left-1/4 w-1/2 h-1/2"
                overlayClassName="fixed inset-0 bg-black/50"
                isOpen={params.get('new') === '1'}
                template={+(params.get('template') || '0')}
                onClose={() => setSearchParams({ ...Object.fromEntries(params), new: '0' })}
                onSetTemplate={t => setSearchParams({ ...Object.fromEntries(params), template: t.toString() })} />

            <div className='pr-6 font-helvetica'>
                <div className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2 bg-white rounded drop-shadow-md'>
                        <HomeLogo />
                    </div>
                    <div>Home</div>
                </div>
                <Link
                    to="?new=1"
                    onClick={() => setSearchParams({ new: '1' })}
                    >
                    <div className='mx-auto flex flex-row items-center gap-2 pb-3'>
                        <div className='p-2'>
                            <CreateLogo />
                        </div>
                        <div className='opacity-40 hover:opacity-100'>
                            Create
                        </div>
                    </div>
                </Link>
                <button
                    onClick={() => {
                        if (!window) return;

                        let folder = dialog.showOpenDialogSync(window, {
                            title: "Choose a project folder",
                            properties: ['openDirectory']
                        });

                        if (folder) {
                            navigate({
                                pathname: normalize(AppRoute.Project + '/' + encodeURIComponent(folder[0])),
                            });
                        }
                    }}
                    className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2'>
                        <FolderLogo />
                    </div>
                    <div className='opacity-40 hover:opacity-100'>
                        Open
                    </div>
                </button>
            </div>
        </div>
    )
}