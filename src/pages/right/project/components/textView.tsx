import { memo, useContext, useEffect, useRef, useState } from "react";
import Highlight, { defaultProps } from 'prism-react-renderer';
import useResizeObserver from "use-resize-observer";
import { RightPaneWidthContext } from "../../../../App";
import './textView.css';

function TextView({ content, autoscroll, wrap }: { content: string, autoscroll: boolean, wrap?: boolean }) {
    const width = useContext(RightPaneWidthContext);
    const { ref: containerRef, height: containerHeight = 0 } = useResizeObserver();
    const divRef = useRef<HTMLDivElement>();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<{ line: number, index: number }[]>([]);
    const [currentResultIndex, setCurrentResultIndex] = useState<number>(-1);
    const [showSearchBox, setShowSearchBox] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "f") {
                e.preventDefault();
                setShowSearchBox(true);
            }
            if (e.key === "Escape") {
                setShowSearchBox(false);
                clearSearch();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (autoscroll) {
            const element = divRef.current;
            element?.scroll({ top: element!.scrollHeight, behavior: 'smooth' });
        }
    }, [content, autoscroll]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchResults([]);
            setCurrentResultIndex(-1);
            return;
        }

        const results: { line: number, index: number }[] = [];
        const lines = content.split("\n");
        const lowerSearchTerm = searchTerm.toLowerCase();

        lines.forEach((line, lineIndex) => {
            let startIndex = 0;
            while (startIndex < line.length) {
                const index = line.toLowerCase().indexOf(lowerSearchTerm, startIndex);
                if (index === -1) break;
                results.push({ line: lineIndex, index });
                startIndex = index + lowerSearchTerm.length;
            }
        });

        setSearchResults(results);
        setCurrentResultIndex(results.length > 0 ? 0 : -1);
    }, [searchTerm, content]);

    const goToNextResult = () => {
        if (searchResults.length > 0) {
            const nextIndex = (currentResultIndex + 1) % searchResults.length;
            setCurrentResultIndex(nextIndex);
            scrollToResult(nextIndex);
        }
    };

    const goToPreviousResult = () => {
        if (searchResults.length > 0) {
            const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
            setCurrentResultIndex(prevIndex);
            scrollToResult(prevIndex);
        }
    };

    const scrollToResult = (resultIndex: number) => {
        const result = searchResults[resultIndex];
        const lineElement = document.getElementById(`line-${result.line}`);
        if (lineElement && divRef.current) {
            divRef.current.scrollTo({
                top: lineElement.offsetTop,
                behavior: 'smooth'
            });
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
        setCurrentResultIndex(-1);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div ref={containerRef} className="h-full font-mono">
            {showSearchBox && (
                <div className="mb-2 flex items-center space-x-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className="border p-1 w-full"
                    />
                    <span className="text-gray-600">
                        {currentResultIndex >= 0 && searchResults.length > 0
                            ? `${currentResultIndex + 1}/${searchResults.length}`
                            : `0/${searchResults.length}`}
                    </span>
                    <button onClick={goToPreviousResult} className="px-2 py-1 bg-gray-300">
                        &lt;
                    </button>
                    <button onClick={goToNextResult} className="px-2 py-1 bg-gray-300">
                        &gt;
                    </button>
                    <button onClick={() => {
                        setShowSearchBox(false);
                        clearSearch();
                    }} className="px-2 py-1 bg-red-500 text-white">
                        X
                    </button>
                </div>
            )}

            <div
                style={{ height: containerHeight - (showSearchBox ? 80 : 0), width: width * 99 / 100 }}
                ref={divRef as any}
                className="overflow-x-auto overflow-y-auto"
                id="file-content"
            >
                <Highlight
                    {...defaultProps}
                    language={"" as any}
                    code={content}
                >
                    {(props) => {
                        return (
                            <pre className={props.className + ' text-white'}>
                                {props.tokens.map((line, lineIndex) => {
                                    const highlightedLine = line.map((token, tokenIndex) => {
                                        const tokenContent = token.content;
                                        if (searchTerm && tokenContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                                            const parts = tokenContent.split(new RegExp(`(${searchTerm})`, 'gi')); // Chia theo từ khóa không phân biệt hoa thường
                                            return (
                                                <>
                                                    {parts.map((part, index) => (
                                                        <span key={index}>
                                                            {part}
                                                            {index < parts.length - 1 && (
                                                                <span className="bg-yellow-200">{searchTerm}</span>
                                                            )}
                                                        </span>
                                                    ))}
                                                </>
                                            );
                                        } else {
                                            return (
                                                <span
                                                    key={tokenIndex}
                                                    {...props.getTokenProps({ token, key: tokenIndex })}
                                                    className={"font-mono opacity-75 text-gray-700 pr-2 " + (wrap ? "whitespace-pre-wrap" : "")}
                                                />
                                            );
                                        }
                                    });

                                    return (
                                        <div
                                            key={lineIndex}
                                            id={`line-${lineIndex}`}
                                            {...props.getLineProps({ line, key: lineIndex })}
                                            className={`table-row text-black break-all`}
                                        >
                                            <span className="font-mono opacity-20 text-gray-700 table-cell select-none text-right">
                                                {lineIndex + 1}&nbsp;&nbsp;
                                            </span>
                                            <span style={{ width: width * 99 / 100 }} className="table-cell">
                                                {highlightedLine}
                                            </span>
                                        </div>
                                    );
                                })}
                            </pre>
                        );
                    }}
                </Highlight>
            </div>
        </div>
    );
}

export default memo(TextView);
