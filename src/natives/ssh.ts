import { ipcRenderer } from 'electron-better-ipc';
import type {NodeSSH} from 'node-ssh';

type TunnelOption = Parameters<NodeSSH['connect']>[0]

class SshIntegration {
    createConnection(id: string, options: TunnelOption) : Promise<[boolean, string?]> {
        return ipcRenderer.callMain('ssh_create', [id, options]);
    }

    checkConnection(id: string) : Promise<boolean> {
        return ipcRenderer.callMain('ssh_get', id);
    }
}

export { SshIntegration };