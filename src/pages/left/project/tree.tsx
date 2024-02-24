import { Tree } from "react-arborist";
import { basename } from "path";
import { memo, useCallback, useContext, useEffect, useState } from "react";
import { LeftPaneWidthContext } from "../../../App";
import { Link, useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { diff } from 'deep-object-diff';
import useSsh from "../../../hooks/useSsh";
import { NativeContext } from "../../../natives/nativeContext";

function Files({ path, current, height, width }: { path: string, current: string, height: number, width: number }) {
    let ssh = useSsh();
    let native = useContext(NativeContext);
    let [tree, setTree] = useState({ id: path, name: basename(path), path, isFolder: false });

    let recurse = useCallback(path => {
        return native.recurse({ path, host: ssh })
    }, [native, ssh]);

    useEffect(() => {
        (async function () {
            let r = await recurse(path);
            setTree(r);
        })();
    }, [path, ssh, native, recurse]);

    useEffect(() => {
        let interval = setInterval(async () => {
            let old = tree;
            let current = recurse(path);
            if (Object.keys(diff(old, current)).length)
            {
                setTree(await recurse(path));
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [path, tree, ssh, recurse]);

    return (
        <div>
            <Tree
                width={width - 40}
                data={tree}
                height={height}
                hideRoot
                rowHeight={28}>
                {({ styles, data }) => {
                    let clickable = !data.isFolder && !data.name.endsWith('.gz');
                    let chosen = current === data.path;
                    let link = (
                        <Link
                            to={`?${ParamKey.ProjectFile}=${encodeURIComponent(data.path)}&${ParamKey.ProjectScreen}=${ProjectScreen.File}&${ParamKey.SshConnection}=${ssh || ''}`}
                            className={chosen ? ' bg-pink-600 p-0.5 rounded-md text-white' : ''}>
                            {data.name}
                        </Link>
                    );

                    return (
                        <div
                            className={
                                'font-helvetica'
                                + (clickable ? ' cursor-pointer' : ' text-gray-400')}
                            style={styles.row}
                            key={data.id}>
                            <div
                                style={styles.indent}>
                                {clickable ? link : data.name}
                            </div>
                        </div>
                    )
                }}
            </Tree>
        </div>
    )
}

let Memoized = memo(Files);
function MemoizedFiles({ path, height } : { path: string, height: number }) {
    let ctx = useContext(LeftPaneWidthContext);

    let [params] = useSearchParams();
    let file = params.get(ParamKey.ProjectFile)!;
    let memoized = <Memoized current={file} path={path} height={height} width={ctx} />;
    return memoized;
}

export default MemoizedFiles;