import { Tree } from "react-arborist";
import { statSync, readdirSync } from "fs";
import { basename, join } from "path";
import { memo, useContext, useEffect, useState } from "react";
import { PaneWidthContext } from "../../../App";
import { Link } from "react-router-dom";
import { ParamKey, ProjectScreen } from "../../../paramKey";
import { diff } from 'deep-object-diff';

type Node = {
    id: string;
    path: string;
    children?: Node[];
    name: string;
    isFolder: boolean;
}

function recurse(path: string) {
    const baseNode: Node = { id: path, name: basename(path), path, isFolder: false }

    try {
        if (statSync(path).isDirectory()) {
            baseNode.isFolder = true;
            baseNode.children = readdirSync(path)
                .map(dir => join(path, dir))
                .map(recurse);
        }
    } catch (e: any) {
        if (e.code !== 'ENOENT') {
            // ENOENTs happen because the statSync call may run when the file is gone
            throw e;
        }
    }

    return baseNode;
}

function Files({ path, height, width }: { path: string, height: number, width: number }) {
    let [tree, setTree] = useState({ id: path, name: basename(path), path, isFolder: false });

    useEffect(() => {
        setTree(recurse(path));
    }, [path])

    useEffect(() => {
        let interval = setInterval(() => {
            let old = tree;
            let current = recurse(path);
            if (Object.keys(diff(old, current)).length)
            {
                setTree(recurse(path));
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [path, tree]);

    return (
        <div>
            <Tree
                width={width - 40}
                data={tree}
                height={height}
                hideRoot>
                {({ styles, data }) => {
                    let clickable = !data.isFolder && !data.name.endsWith('.gz');
                    let link = (
                        <Link to={`?${ParamKey.ProjectFile}=${data.path}&${ParamKey.ProjectScreen}=${ProjectScreen.File}`}>
                            {data.name}
                        </Link>
                    );

                    return (
                        <div
                            className={(clickable ? ' cursor-pointer' : ' text-gray-400')}
                            style={styles.row}
                            key={data.id}>
                            <div style={styles.indent}>
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
    let ctx = useContext(PaneWidthContext);
    let memoized = <Memoized path={path} height={height} width={ctx} />;
    return memoized;
}

export default MemoizedFiles;