import { createContext, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import BinaryDownload from './pages/binarydownload';
import SplitPane from 'react-split-pane';
import useResizeObserver from 'use-resize-observer';
import Left from './pages/left';
import Right from './pages/right';

let width = window.visualViewport.width;
let initial = Math.max(200, Math.floor(width / 5));
export const LeftPaneWidthContext = createContext(initial);
export const RightPaneWidthContext = createContext(width - initial);


function App() {
    let [ready, setReady] = useState(false);
    let { ref, width = window.visualViewport.width } = useResizeObserver();
    let [paneWidth, setPaneWidth] = useState(initial);
    let { ref: remainingRef, width: remainingWidth = window.visualViewport.width - width } = useResizeObserver();

    if (!ready) {
        return <BinaryDownload onReady={() => setReady(true)} />
    }

    return (
        <div className='h-full' ref={ref}>
            <HashRouter>
                <LeftPaneWidthContext.Provider value={paneWidth}>
                    <RightPaneWidthContext.Provider value={Math.min(remainingWidth, width - paneWidth - 10)}>
                        <SplitPane
                            onChange={newSize => setPaneWidth(newSize)}
                            split="vertical"
                            minSize={200}
                            maxSize={Math.floor(width * 2 / 5)}
                            defaultSize={Math.max(200, Math.floor(width / 5))}
                            resizerStyle={{ width: 10 }}>
                            <div className='left-pane h-full'>
                                <Left />
                            </div>
                            <div className='h-full' ref={remainingRef}>
                                <Right />
                            </div>
                        </SplitPane>
                    </RightPaneWidthContext.Provider>
                </LeftPaneWidthContext.Provider>
            </HashRouter>
        </div>
    )
}

export default App;