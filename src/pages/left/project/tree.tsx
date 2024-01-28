import { Tree } from "react-arborist";
import { basename } from "path";
import { memo, useContext, useEffect, useState } from "react";
import { LeftPaneWidthContext } from "../../../App";
import { Link, useSearchParams } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { diff } from 'deep-object-diff';
import { ipcRenderer } from "electron-better-ipc";
import useSsh from "../../../hooks/useSsh";

type Node = {
    id: string;
    path: string;
    children?: Node[];
    name: string;
    isFolder: boolean;
}

async function recurse(path: string, ssh : string | null = '') {
    if (ssh) {
        return await ipcRenderer.callMain('recurse_ssh', [ssh, path]) as Node;
    }
    return await ipcRenderer.callMain('recurse', path) as Node;
}

function Files({ path, current,  height, width }: { path: string, current: string, height: number, width: number }) {
    let ssh = useSsh();
    let [tree, setTree] = useState({ id: path, name: basename(path), path, isFolder: false });

    useEffect(() => {
        (async function () {
            let r = await recurse(path, ssh);
            setTree(r);
        })();
    }, [path, ssh]);

    useEffect(() => {
        let interval = setInterval(async () => {
            let old = tree;
            let current = recurse(path, ssh);
            if (Object.keys(diff(old, current)).length)
            {
                setTree(await recurse(path, ssh));
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [path, tree, ssh]);

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