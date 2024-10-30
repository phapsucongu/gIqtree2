import { createContext, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import SplitPane from 'react-split-pane';
import useResizeObserver from 'use-resize-observer';
import Left from './pages/left/index';
import Right from './pages/right/index';

let width = window.visualViewport!.width;
let initial = Math.max(200, Math.floor(width / 5));
export const LeftPaneWidthContext = createContext(initial);
export const RightPaneWidthContext = createContext(width - initial);
export const HeightContext = createContext(window.visualViewport!.height);


function App() {
    let { ref, width = window.visualViewport!.width } = useResizeObserver();
    let [paneWidth, setPaneWidth] = useState(initial);
    let { ref: remainingRef, width: remainingWidth = window.visualViewport!.width - width, height } = useResizeObserver();

    return (
        <div className='h-full' ref={ref}>
            <HashRouter>
                <LeftPaneWidthContext.Provider value={paneWidth}>
                    <RightPaneWidthContext.Provider value={Math.min(remainingWidth, width - paneWidth - 10)}>
                        <HeightContext.Provider value={height ?? window.visualViewport!.height}>
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
                        </HeightContext.Provider>
                    </RightPaneWidthContext.Provider>
                </LeftPaneWidthContext.Provider>
            </HashRouter>
        </div>
    )
}

export default App;