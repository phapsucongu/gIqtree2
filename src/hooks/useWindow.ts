import { BrowserWindow } from "@electron/remote";

export function useWindow() {
    // we only have a single window.
    return BrowserWindow.getAllWindows()[0];
}