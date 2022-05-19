import { useState } from 'react';
import { Tree } from 'react-arborist';
import { readdirSync, statSync } from 'fs';
import { basename, join } from 'path';
import useResize from 'use-resize-observer';

type Node = {
    id: string;
    path: string;
    children?: Node[];
    name: string;
    isFolder: boolean;
}

function recurse(path: string) {
    const baseNode: Node = { id: path, name: basename(path), path, isFolder: false }

    if (statSync(path).isDirectory()) {
        baseNode.isFolder = true;
        baseNode.children = readdirSync(path)
            .map(dir => join(path, dir))
            .map(recurse);
    }

    return baseNode;
}

function Sidebar(
    { projectPath, currentFile, onFileChosen }:
    { projectPath: string, currentFile?: string, onFileChosen?: (f: string) => void }
) {
    let [treeHeight, setTreeHeight] = useState(0);
    let [treeWidth, setTreeWidth] = useState(0);
    let { ref: treeRef } = useResize({
        onResize({ height, width }) {
            if (height) setTreeHeight(height);
            if (width) setTreeWidth(width);
        }
    })

    return (
        <div className="ml-2 h-full" ref={treeRef}>
            <Tree
                data={recurse(projectPath)}
                width={Math.max(treeWidth, window.visualViewport.width / 7)}
                height={Math.max(treeHeight, window.visualViewport.height * 4 / 5)} className='h-full'>
                {({ styles, data }) => (
                    <div className={data.path === currentFile ? 'bg-gray-200' : ''} style={styles.row} key={data.id}>
                        <div style={styles.indent} onClick={() => {
                            if (!data.isFolder)
                                onFileChosen?.(data.path);
                        }}>
                            {data.name}
                        </div>
                    </div>
                )}
            </Tree>
        </div>
    )
}

export default Sidebar;