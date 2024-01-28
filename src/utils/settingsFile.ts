import { join } from 'path';

import { Settings } from '../interfaces';
import { ipcRenderer } from 'electron-better-ipc';
import { getTemplateSettings } from '../templates';

const filename = 'settings.json';

export async function hasSettingsFileSync(projectPath: string, sshConnection: string | null | undefined = '') {
    let path = join(projectPath, filename);
    let result: boolean;
    if (sshConnection) {
        result = await ipcRenderer.callMain('file_exists_string', [sshConnection, path]);
    } else {
        result = await ipcRenderer.callMain('file_exists_string', path);
    }
    return result;
}

export async function readSettingsFileSync(projectPath: string, sshConnection: string | null | undefined = '') {
    let path = join(projectPath, filename);
    try {
        let result: string = sshConnection
            ? await ipcRenderer.callMain('file_read_string_ssh', [sshConnection, path])
            : await ipcRenderer.callMain('file_read_string', path)
        return JSON.parse(result);
    } catch (e) {
        let t = getTemplateSettings();
        let text = JSON.stringify(t);
        if (sshConnection) {
            await ipcRenderer.callMain('file_write_string_ssh', [sshConnection, path, text]);
        } else {
            await ipcRenderer.callMain('file_write_string', [path, text]);
        }

        let r2: string = sshConnection
            ? await ipcRenderer.callMain('file_read_string_ssh', [sshConnection, path])
            : await ipcRenderer.callMain('file_read_string', path)
        return JSON.parse(r2);
    }
}

export async function writeSettingsFileSync(projectPath: string, setting : Settings, sshConnection: string | null | undefined = '') {
    let file = join(projectPath, filename);
    let text = JSON.stringify(setting);
    if (sshConnection) {
        await ipcRenderer.callMain('file_write_string_ssh', [sshConnection, file, text]);
    } else {
        await ipcRenderer.callMain('file_write_string', [file, text]);
    }
}