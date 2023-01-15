import { memo, useContext, useEffect, useRef, useState } from "react";
import Highlight, { defaultProps } from 'prism-react-renderer';
import useResizeObserver from "use-resize-observer";
import { RightPaneWidthContext } from "../../../../App";
import './textView.css';

function TextView({ content, autoscroll } : { content: string, autoscroll: boolean }) {
    let width = useContext(RightPaneWidthContext);
    let [wrap, setWrap] = useState(false);
    let { ref: containerRef, height: containerHeight = 0 } = useResizeObserver();

    let divRef = useRef<HTMLDivElement>();
    useEffect(() => {
        if (autoscroll) {
            let element = divRef.current;
            element?.scroll({ top: element!.scrollHeight, behavior: 'smooth' })
        }
    }, [content, autoscroll])
    return (
        <div ref={containerRef} className="h-full font-mono">
            <div className="flex flex-row gap-2 items-center">
                <input type='checkbox' checked={wrap} onChange={() => setWrap(!wrap)}/>
                <div>Text wrap</div>
            </div>
            <div
                style={{ height: containerHeight - 80, width: width * 99 / 100 }} ref={divRef as any}
                className="overflow-x-scroll"
                id="file-content">
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
                                        className="table-row text-black break-all">
                                        <span className="font-mono opacity-20 text-gray-700 table-cell select-none text-right">
                                            {i + 1}&nbsp;&nbsp;
                                        </span>
                                        <span style={{ width: width * 99 / 100 }} className="table-cell">
                                            {line.map((token, key) => (
                                                <div
                                                    key={key}
                                                    {...props.getTokenProps({ token, key })}
                                                    className={"font-mono opacity-75 text-gray-700 pr-2 " + (wrap ? "whitespace-pre-wrap" : "")} />
                                            ))}
                                        </span>
                                    </div>
                                ))}
                            </pre>
                        )
                    }}
                </Highlight>
            </div>
        </div>
    )
}


export default memo(TextView);