import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import BinaryDownload from './pages/binarydownload';
import SplitPane from 'react-split-pane';
import useResizeObserver from 'use-resize-observer';
import Left from './pages/left';
import Right from './pages/right';

function App() {
    let [ready, setReady] = useState(false);
    let { ref, width = window.visualViewport.width } = useResizeObserver();

    if (!ready) {
        return <BinaryDownload onReady={() => setReady(true)} />
    }

    return (
        <div className='h-full' ref={ref}>
            <BrowserRouter>
                <SplitPane split="vertical" minSize={200} maxSize={Math.floor(width * 2 / 5)} defaultSize={Math.max(200, Math.floor(width / 5))}>
                    <div className='left-pane h-full'>
                        <Left />
                    </div>
                    <div className='h-full'>
                        <Right />
                    </div>
                </SplitPane>
            </BrowserRouter>
        </div>
    )
}

export default App;