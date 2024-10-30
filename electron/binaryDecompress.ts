import { ipcMain } from "electron-better-ipc";
import decompress from 'decompress';

import { sshTunnels } from './ssh';
import { mkdtempSync } from "fs";
import { tmpdir } from 'os';
import rimraf from "rimraf";
import { join } from "path";

export const downloadPathSsh = '.config/gIqtree/bin';

// data, path
ipcMain.answerRenderer('decompress', (data : [Uint8Array, string]) => {
    let [b, path] = data;
    let buffer = Buffer.from(b);
    decompress(Buffer.from(buffer), path);
})

// connection, data, path
ipcMain.answerRenderer('decompress_ssh', async (data : [string, Uint8Array, string]) => {
    let [connection_id, b, path] = data;
    let connection = sshTunnels.get(connection_id);

    if (!connection) {
        throw new Error('Connection ' + connection_id + ' not established');
    }

    try {
        let buffer = Buffer.from(b);
        let tmp = mkdtempSync(join(tmpdir(), 'iqtree-tmp'));
        let result = await decompress(Buffer.from(buffer), tmp);
        console.log('decompressed to', tmp);
        for (let r of result.filter(t => t.type === 'file')) {
            console.log('copying from', join(tmp, r.path), 'to', join(downloadPathSsh, r.path));
            await connection.putFile(join(tmp, r.path), join(downloadPathSsh, r.path));
        }

        console.log('Extracted binary to', downloadPathSsh);

        rimraf.sync(tmp);
    } catch (e) {
        console.log(e);
        throw e;
    }
})