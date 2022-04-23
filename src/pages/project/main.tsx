import { useEffect, useState } from 'react';
import { Tree } from 'react-arborist';
import { readdirSync, readFileSync, statSync } from 'fs';
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

function ProjectMain({ log, projectPath }: { log: string, projectPath: string }) {
    let [treeHeight, setTreeHeight] = useState(0);
    let [treeWidth, setTreeWidth] = useState(0);
    let [currentFile, setCurrentFile] = useState<string | null>(null);
    let [currentContent, setCurrentContent] = useState('');
    let { ref: treeRef } = useResize({
        onResize({ height, width }) {
            if (height) setTreeHeight(height);
            if (width) setTreeWidth(width);
        }
    })

    useEffect(() => {
        if (currentFile !== null) {
            setCurrentContent(readFileSync(currentFile, 'utf8'));
        }
    }, [currentFile]);


    return (
        <div className='grow flex flex-row gap-2'>
            <div className="ml-2" ref={treeRef}>
                <Tree data={recurse(projectPath)} height={treeHeight - 50}>
                    {({ styles, data }) => (
                        <div className={data.path === currentFile ? 'bg-gray-200' : ''} style={styles.row} key={data.id}>
                            <div style={styles.indent} onClick={() => {
                                if (!data.isFolder)
                                    setCurrentFile(data.path);
                            }}>
                                {data.name}
                            </div>
                        </div>
                    )}
                </Tree>
            </div>
            <pre className='h-[82vh] overflow-y-scroll' style={{
                width: window.innerWidth - treeWidth - 20
            }}>
                {currentFile ? currentContent : log}
            </pre>
        </div>
    )
}

export default ProjectMain;