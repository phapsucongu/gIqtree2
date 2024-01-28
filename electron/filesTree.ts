import { basename, join } from "path";
import { statSync, readdirSync } from "fs";
import { ipcMain } from "electron-better-ipc";
import { NodeSSH } from "node-ssh";
import { getConnection } from "./ssh";

type Node = {
    id: string;
    path: string;
    children?: Node[];
    name: string;
    isFolder: boolean;
}

function recurse(path: string) {
    const baseNode: Node = { id: path, name: basename(path), path, isFolder: false }

    try {
        if (statSync(path).isDirectory()) {
            baseNode.isFolder = true;
            baseNode.children = readdirSync(path)
                .map(dir => join(path, dir))
                .map(recurse);
        }
    } catch (e: any) {
        if (e.code !== 'ENOENT') {
            // ENOENTs happen because the statSync call may run when the file is gone
            throw e;
        }
    }

    return baseNode;
}

async function recurseSsh(connection: NodeSSH, path: string) {
    const baseNode: Node = { id: path, name: basename(path), path, isFolder: false };

    try {
        let res = await connection.exec('ls -ld', [path]);
        let is_dir = res.startsWith('d');

        if (is_dir) {
            baseNode.isFolder = true;

            let sub = await connection.exec('ls', [path]);
            let p = sub.split('\n').filter(Boolean).map(dir => join(path, dir));
            let p2 = p.map(r => recurseSsh(connection, r));

            baseNode.children = await Promise.all(p2);
        }
    } catch (e: any) {
        console.log(e);
    }

    return baseNode;
}

ipcMain.answerRenderer('recurse', (path: string) => {
    return recurse(path);
})

// key, path
ipcMain.answerRenderer('recurse_ssh', async (data: [string, string]) => {
    let [key, path] = data;
    let c = getConnection(key);
    return await recurseSsh(c, path);
})