import { Link } from "react-router-dom";
import { HomeLogo, IQTREELogo } from "../../icons";

export default () => {
    return (
        <div className='pl-6 flex flex-col h-full'>
            <div className='flex flex-row items-center gap-2 py-6 font-arvo'>
                <IQTREELogo />
                <b className="text-lg">IQ-TREE</b>
            </div>
            <div className="flex flex-grow font-arvo">
                <b>
                    Input
                </b>
            </div>
            <div className="flex flex-grow font-arvo">
                <b>
                    Output
                </b>
            </div>
            <div>
                <Link to="/" className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2'>
                        <HomeLogo />
                    </div>
                    <div className="mt-1">
                        Home
                    </div>
                </Link>
            </div>
        </div>
    )
}