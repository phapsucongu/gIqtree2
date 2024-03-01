import { ipcMain } from 'electron-better-ipc';
import {NodeSSH} from 'node-ssh';

type TunnelOption = Parameters<NodeSSH['connect']>[0]

async function createTunnel(options: TunnelOption) {
    let n = new NodeSSH();
    let connect = await n.connect(options);
    console.log('Connected to', options.username, 'at', options.host);
    return connect;
}

export const sshTunnels = new Map<string, NodeSSH>();

export function getConnection(key: string) {
    let r = sshTunnels.get(key);
    if (!r) {
        throw new Error('Connection ' + r + ' not established');
    }

    return r;
}

ipcMain.answerRenderer('ssh_get', (id: string) => {
    let r = sshTunnels.get(id);
    if (!r) return false;

    if (r.connection === null) {
        return false;
    }
})

ipcMain.answerRenderer('ssh_create', async (d: [string, TunnelOption]) => {
    if (sshTunnels.has(d[0])) {
        let c = sshTunnels.get(d[0]);
        if (c!.connection) {
            return [true];
        }
    }

    try {
        let tunnel = await createTunnel(d[1]);
        sshTunnels.set(d[0], tunnel);
        return [true];
    } catch (e: any) {
        console.log('Error connecting to SSH', e);
        return [false, `${e}`];
    }
})

ipcMain.answerRenderer('ssh_check_connection', (key: string) => {
    return !!sshTunnels.get(key)?.connection;
})

// key, command
ipcMain.answerRenderer('ssh_exec', async (d: [string, { command: string, args: string[] }]) => {
    let [key, { command, args }] = d;

    let c = getConnection(key);
    console.log(key, '| executing command |', command, args);
    return await c.exec(command, args);
})

// key, path
ipcMain.answerRenderer('ssh_read_dir', async ([key, path]: [string, string]) => {
    let c = getConnection(key);
    let out : { name: string, isDir: boolean }[] = [];
    await c.withSFTP(async ftp => {
        await new Promise<void>((res, rej) => {
            ftp.readdir(path, (err, list) => {
                if (err) return rej(err);
                out = list.map(r => ({
                    name: r.filename,
                    isDir: r.attrs.isDirectory()
                }))

                res()
            })
        })
    })

    return out;
})