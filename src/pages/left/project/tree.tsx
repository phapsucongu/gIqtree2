import { Tree } from "react-arborist";
import { statSync, readdirSync } from "fs";
import { basename, join } from "path";
import { useContext } from "react";
import { PaneWidthContext } from "../../../App";

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

function Files({ path, onFileChosen, height }: { path: string, onFileChosen?: (s: string) => void, height: number }) {
    let ctx = useContext(PaneWidthContext);
    let files = recurse(path);
    return (
        <div>
            <Tree
                width={ctx - 40}
                data={files}
                height={height}
                hideRoot>
                {({ styles, data }) => {

                    let clickable = !data.isFolder && !data.name.endsWith('.gz');
                    return (
                        <div
                            className={
                                ''
                                + (clickable ? ' cursor-pointer' : ' text-gray-400')
                            }
                            style={styles.row}
                            key={data.id}>
                            <div style={styles.indent} onClick={() => {
                                if (clickable)
                                    onFileChosen?.(data.path);
                            }}>
                                {data.name}
                            </div>
                        </div>
                    )
                }}
            </Tree>
        </div>
    )
}

export default Files;