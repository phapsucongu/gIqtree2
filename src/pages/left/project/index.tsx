import { join, normalize } from "path";
import { memo } from "react";
import { Link, useMatch } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import { ConsoleLogo, HomeLogo, IQTREELogo, SettingsLogo } from "../../../icons";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { AppRoute } from "../../../routes";
import Tree from "./tree";
import useSsh from "../../../hooks/useSsh";

let useResizeObserverOptions = {
    box: 'border-box' as const
};

function Project({ path } : { path: string }) {
    let { ref: containerRef, height: containerHeight = 0 } = useResizeObserver(useResizeObserverOptions);
    let { ref: upperRef, height: upperHeight = 0 } = useResizeObserver(useResizeObserverOptions);
    let { ref: lowerRef, height: lowerHeight = 0 } = useResizeObserver(useResizeObserverOptions);
    let { ref: inputTitleRef, height: inputTitleHeight = 0 } = useResizeObserver(useResizeObserverOptions);
    let { ref: outputTitleRef, height: outputTitleHeight = 0 } = useResizeObserver(useResizeObserverOptions);
    let ssh = useSsh();

    let remaining = containerHeight - upperHeight - lowerHeight - inputTitleHeight - outputTitleHeight;

    return (
        <div className='pl-6 flex flex-col h-full' ref={containerRef}>
            <div className='flex flex-row items-center gap-2 py-6 font-arvo' ref={upperRef}>
                <IQTREELogo />
                <b className="text-lg font-arvo">IQ-TREE</b>
            </div>
            <div className="flex flex-col font-arvo">
                <div ref={inputTitleRef}>
                    <b>Input</b>
                </div>
                <Tree height={remaining / 2} path={join(path!, 'input')} />
            </div>
            <div className="flex flex-col font-arvo">
                <div ref={outputTitleRef}>
                    <b>Output</b>
                </div>
                <Tree height={remaining / 2} path={join(path!, 'output')} />
            </div>
            <div className="flex-grow"></div>
            <div ref={lowerRef}>
                <Link to={`?${ParamKey.ProjectScreen}=${ProjectScreen.Log}&${ParamKey.SshConnection}=${ssh}`} className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2'>
                        <ConsoleLogo />
                    </div>
                    <div className="mt-1">
                        Console
                    </div>
                </Link>
                <Link to={`?${ParamKey.ProjectScreen}=${ProjectScreen.Setting}&${ParamKey.SshConnection}=${ssh}`} className='flex flex-row items-center gap-2 pb-3'>
                    <div className='p-2'>
                        <SettingsLogo />
                    </div>
                    <div className="mt-1">
                        Settings
                    </div>
                </Link>
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

let Memoized = memo(Project);
function MemoizedProject() {
    let m = useMatch(normalize(AppRoute.Project + '/:path'))!;
    let { path } = m.params;
    return <Memoized path={path!} />;
}

export default MemoizedProject;