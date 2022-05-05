import { useEffect, useRef, useState } from 'react';
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
    let [error, setError] = useState('');
    let [currentFile, setCurrentFile] = useState<string | null>(null);
    let [currentContent, setCurrentContent] = useState('');
    let { ref: treeRef } = useResize({
        onResize({ height, width }) {
            if (height) setTreeHeight(height);
            if (width) setTreeWidth(width);
        }
    })

    let divRef = useRef<HTMLDivElement>();
    useEffect(() => {
        let element = divRef.current;
        element?.scroll({ top: element!.scrollHeight, behavior: 'smooth' })
        console.log('scroll', element);
    }, [log])

    useEffect(() => {
        if (currentFile !== null) {
            try {
                setCurrentContent(readFileSync(currentFile, 'utf8'));
                setError('');
            }
            catch (e) {
                setError(`${e}`);
            }
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
            <div ref={divRef as any} className='h-[82vh] overflow-y-scroll snap-y snap-mandatory snap-end'>
                <pre className='' style={{
                    width: Math.floor(window.innerWidth * 95 / 100) - treeWidth
                }}>
                    {error ? error : currentFile ? currentContent : log}
                </pre>
            </div>
        </div>
    )
}

export default ProjectMain;