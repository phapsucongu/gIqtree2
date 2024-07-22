import { useEffect, useState } from 'react';
import { useWindow } from './useWindow';

export function useWindowMaximized() {
    let window = useWindow();
    let [maximized, setMaximized] = useState(window?.isMaximized || false);

    useEffect(() => {
        let maximizeCallback = () => setMaximized(true);
        let unmaximizeCallback = () => setMaximized(false);

        window.removeAllListeners('maximize');
        window.removeAllListeners('unmaximize');
        window
            .on('maximize', maximizeCallback)
            .on('unmaximize', unmaximizeCallback);

        return () => {
            window
                .removeListener('maximize', maximizeCallback)
                .removeListener('unmaximize', unmaximizeCallback)
        }
    }, [window])

    return maximized;
}