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

function recurseSsh(s: string[], path: string) {
    const baseNode: Node = { id: path, name: basename(path), path, isFolder: false };

        try {
            let res = s.find(r => r === path || r === path + '/');
            let is_dir = res?.endsWith('/') || false;
            if (res !== undefined) {
                if (res === path + '/') {
                    path += '/';
                }
            }

            if (is_dir) {
                baseNode.isFolder = true;

                let sub = s.filter(r => {
                    if (r.startsWith(path) && r !== path) {
                        let l = r.slice(path.length).split('/');
                        return l.length <= 2 && !l[1];
                    } else {
                        return false;
                    }
                });
                let p2 = sub.map(r => recurseSsh(s, r));
                baseNode.children = p2;
            }
        } catch (e) {
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
    let lines = await c.exec('find', [path, '-type', 'd', '-printf', '%p/\\n', '-or', '-print']);
    let l = lines.split('\n').filter(Boolean);
    console.log(key, 'listing files under', path);
    return recurseSsh(l, path);
})