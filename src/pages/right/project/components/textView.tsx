import { memo, useContext } from "react";
import Highlight, { defaultProps } from 'prism-react-renderer';
import useResizeObserver from "use-resize-observer";
import { RightPaneWidthContext } from "../../../../App";
import './textView.css';

function TextView({ content } : { content: string }) {
    let width = useContext(RightPaneWidthContext);
    let { ref: containerRef, height: containerHeight = 0 } = useResizeObserver();

    return (
        <div ref={containerRef} className="h-full font-mono">
            <div style={{ height: containerHeight - 80, width }} className="overflow-x-scroll" id="file-content">
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
                                        <span className="font-mono opacity-20 text-gray-700 table-cell select-none text-right">
                                            {i + 1}&nbsp;&nbsp;
                                        </span>
                                        <span>
                                            {line.map((token, key) => (
                                                <span
                                                    key={key}
                                                    {...props.getTokenProps({ token, key })}
                                                    className="font-mono opacity-75 text-gray-700" />
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