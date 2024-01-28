
import { ipcRenderer } from "electron-better-ipc";
import { join, sep } from "path";

export async function ensureInputOutputFolder(projectPath: string) {
    await ipcRenderer.callMain('directory_create', [getInputFolder(projectPath), true]);
    await ipcRenderer.callMain('directory_create', [getOutputFolder(projectPath), true]);
}

export function getOutputFolder(projectPath: string) {
    let folder = join(projectPath, 'output');
    return folder + sep;
}

export function getInputFolder(projectPath: string) {
    let folder = join(projectPath, 'input');
    return folder + sep;
}