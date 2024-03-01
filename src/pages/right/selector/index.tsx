import { useState } from 'react';
import useSsh from '../../../hooks/useSsh';
import { LocalNative } from '../../../natives';
import { NativeContext } from '../../../natives/nativeContext';
import { RemoteNative } from '../../../natives/remote';
import { EnsureRemote } from '../../ensureremote';
import SelectorMain from './selector';

function Selector() {
    let [ready, setReady] = useState(false);

    let key = useSsh();
    let integration = key ? new RemoteNative(key) : new LocalNative();

    if (!ready) {
        return (
            <>
                <NativeContext.Provider value={integration}>
                    <EnsureRemote onReady={() => setReady(true)} requireDownload={false} />
                </NativeContext.Provider>
            </>
        )
    }

    return (
        <>
            <NativeContext.Provider value={integration}>
                <SelectorMain />
            </NativeContext.Provider>
        </>
    )
}

export default Selector;