import { BrowserWindow } from "@electron/remote";

export function useWindow() {
    return BrowserWindow.getFocusedWindow();
}