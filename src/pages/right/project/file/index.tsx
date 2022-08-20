import { readFileSync } from "fs-extra";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import { ParamKey } from "../../../../paramKey";
import TextView from "../components/textView";

function File() {
    let [params] = useSearchParams();
    let file = params.get(ParamKey.ProjectFile)!;
    let [content, setContent] = useState('');
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);
    let { ref: containerRef } = useResizeObserver();

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
        <div ref={containerRef} className="h-full font-mono">
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
            {!error && (
                <TextView content={content} />
            )}
        </div>
    )
}


export default File;