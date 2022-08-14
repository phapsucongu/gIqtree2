import { dialog } from '@electron/remote';
import { normalize } from 'path';
import { useNavigate } from 'react-router-dom';
import { useWindow } from '../../hooks/useWindow';
import { CreateLogo, FolderLogo, HomeLogo, IQTREELogo } from '../../icons';
import { AppRoute } from '../../routes';

export default () => {
    let window = useWindow();
    let navigate = useNavigate();

    return (
        <div className='pl-6'>
            <div className='flex flex-row items-center gap-2 py-6 font-arvo'>
                <IQTREELogo />
                <b className='text-lg'>IQ-TREE</b>
            </div>
            <div className='pr-6 font-helvetica'>
                <div className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2 bg-white rounded drop-shadow-md'>
                        <HomeLogo />
                    </div>
                    <div>Home</div>
                </div>
                <div className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2'>
                        <CreateLogo />
                    </div>
                    <div className='opacity-40'>
                        Create
                    </div>
                </div>
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