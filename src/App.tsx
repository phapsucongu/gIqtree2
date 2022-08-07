import { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import BinaryDownload from './pages/binarydownload';
import SplitPane from 'react-split-pane';
import useResizeObserver from 'use-resize-observer';
import Left from './pages/left';

function App() {
    let [ready, setReady] = useState(false);
    let { ref, width = window.visualViewport.width } = useResizeObserver();

    if (!ready) {
        return <BinaryDownload onReady={() => setReady(true)} />
    }

    return (
        <div className='h-full' ref={ref}>
            <SplitPane split="vertical" minSize={100} maxSize={Math.floor(width * 2 / 5)} defaultSize={Math.floor(width / 5)}>
                <div className='left-pane h-full'>
                    <HashRouter>
                        <Left />
                    </HashRouter>
                </div>
                <div className='h-full'>right</div>
            </SplitPane>
        </div>
    )
}

export default App;