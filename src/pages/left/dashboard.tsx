import { CreateLogo, FolderLogo, HomeLogo, IQTREELogo } from './icons';


export const route = "/";
export default () => {
    return (
        <div className='pl-6'>
            <div className='flex flex-row items-center gap-2 py-6 font-arvo'>
                <IQTREELogo />
                <b>IQ-TREE</b>
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
                <div className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2'>
                        <FolderLogo />
                    </div>
                    <div className='opacity-40'>
                        Open
                    </div>
                </div>
            </div>
        </div>
    )
}