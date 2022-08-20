import { readFileSync } from "fs-extra";
import { basename } from "path";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Highlight, { defaultProps } from 'prism-react-renderer';
import useResizeObserver from "use-resize-observer";
import { ParamKey } from "../../../../paramKey";
import { RightPaneWidthContext } from "../../../../App";
import './index.css';

function File() {
    let [params] = useSearchParams();
    let file = params.get(ParamKey.ProjectFile)!;
    let [content, setContent] = useState('');
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);
    let width = useContext(RightPaneWidthContext);
    let { ref: containerRef, height: containerHeight = 0 } = useResizeObserver();
    let { ref: titleRef, height: titleHeight = 0 } = useResizeObserver();

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

    let contentComponent = (
        <div style={{ height: containerHeight - titleHeight - 40, width }} className="overflow-x-scroll" id="file-content">
            <Highlight
                {...defaultProps}
                language={"" as any}
                code={content}
            >
                {(props) => {
                    return (
                        <pre className={props.className + ' text-white'}>
                            {props.tokens.map((line, i) => (
                                <div
                                    key={i}
                                    {...props.getLineProps({ line, key: i })}
                                    style={{}}
                                    className="table-row text-black">
                                    <span className="opacity-50 text-gray-700 table-cell select-none text-right">
                                        {i + 1}&nbsp;&nbsp;
                                    </span>
                                    <span>
                                        {line.map((token, key) => (
                                            <span
                                                key={key}
                                                {...props.getTokenProps({ token, key })}
                                                className="text-gray-700" />
                                        ))}
                                    </span>
                                </div>
                            ))}
                        </pre>
                    )
                }}
            </Highlight>
        </div>
    );

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
            {!error && contentComponent}
        </div>
    )
}


export default File;