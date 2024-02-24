import { extname } from "path";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import BinaryOptions from "../../../../component/binaryoptions";
import { ParamKey } from "../../../../paramKey";
import TextView from "../components/textView";
import TreeView from "../components/treeView";
import useSsh from "../../../../hooks/useSsh";
import { NativeContext } from "../../../../natives/nativeContext";

function File({ wrap } : { wrap?: boolean }) {
    let native = useContext(NativeContext);
    let [params] = useSearchParams();
    let file = params.get(ParamKey.ProjectFile)!;
    let [content, setContent] = useState('');
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);
    let [isTree, setIsTree] = useState(false);
    let { ref: containerRef } = useResizeObserver();
    let ssh = useSsh();

    let isTreeFile = ['.treefile'].some(ext => extname(file).toLowerCase() === ext);
    if (!isTreeFile) isTree = false;

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setContent(await native.file_read_string({ path: file, host: ssh }));
                setError('');
                setLoading(false);
            } catch (e) {
                setError(`${e}`);
                setLoading(false);
            }
        })();
    }, [file, ssh, native]);

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
                    <div>Tree view : </div>
                    <div className="w-1/3">
                        <BinaryOptions
                            value={isTree ?? false}
                            truthyText="On"
                            falsyText="Off"
                            onChange={v => setIsTree(v)} />
                    </div>
                </div>
            )}
            {!error && (
                isTree ? <TreeView file={file} content={content} /> : <TextView wrap={wrap} autoscroll={false} content={content} />
            )}
        </div>
    )
}


export default File;