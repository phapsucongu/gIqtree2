import { readFileSync } from "fs-extra";
import { extname } from "path";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import BinaryOptions from "../../../../component/binaryoptions";
import { ParamKey } from "../../../../paramKey";
import TextView from "../components/textView";
import TreeView from "../components/treeView";
import PhylipView from "../components/phylipView";

function File({ wrap } : { wrap?: boolean }) {
    let [params] = useSearchParams();
    let file = params.get(ParamKey.ProjectFile)!;
    let [content, setContent] = useState('');
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);
    let [isTree, setIsTree] = useState(false);
    let { ref: containerRef } = useResizeObserver();

    let isTreeFile = ['.treefile', '.phy'].some(ext => extname(file).toLowerCase() === ext);
    if (!isTreeFile) isTree = false;

    let text = '';
    switch (extname(file).toLowerCase()) {
        case '.treefile': {
            text = 'Tree view';
            break;
        }

        case '.phy': {
            text = 'Matrix view';
            break;
        }
    }

    let treeComponent = useMemo(() => {
        if (error) {
            return <></>;
        }

        if (isTree) {
            switch (extname(file).toLowerCase()) {
                case '.treefile': {
                    return <TreeView file={file} content={content} />;
                }

                case '.phy': {
                    return (
                        <PhylipView file={file} content={content} />
                    );
                }
            }
        }

        return <TextView wrap={wrap} autoscroll={false} content={content} />;

    }, [content, file, isTreeFile, error, isTree, wrap]);

    useEffect(() => {
        try {
            setLoading(true);
            setContent(readFileSync(file, 'utf8'));
            setError('');
            setLoading(false);
        } catch (e) {
            setError(`${e}`);
            setLoading(false);
        }
    }, [file]);

    return (
        <div ref={containerRef} className="h-full">
            {loading && (
                <div>
                    <div>Loading</div>
                </div>
            )}
            {error && (
                <div>
                    <b>Error</b>
                    <div className="text-red-700">
                        {error}
                    </div>
                </div>
            )}
            {isTreeFile && (
                <div className="flex flex-row gap-8 items-center py-2">
                    <div>{text}: </div>
                    <div className="w-1/3">
                        <BinaryOptions
                            value={isTree ?? false}
                            truthyText="On"
                            falsyText="Off"
                            onChange={v => setIsTree(v)} />
                    </div>
                </div>
            )}

            {!error && treeComponent}
        </div>
    )
}


export default File;