import { ipcMain } from "electron-better-ipc";
import { getConnection } from "./ssh";
import { writeFileSync, mkdtempSync } from "fs";
import { sync as rimraf } from 'rimraf';
import { copyFileSync, statSync } from 'fs-extra';

import { tmpdir } from "os";
import { join } from "path";

// key, path
ipcMain.answerRenderer('file_exists_string_ssh', async (data: [string, string]) => {
    let [key, path] = data;
    let connection = getConnection(key);

    try {
        await connection.exec('ls', [path]);
        return true;
    } catch (e) {
        return false;
    }
})

// key, path
ipcMain.answerRenderer('file_read_string_ssh', async (data: [string, string]) => {
    let [key, path] = data;
    let connection = getConnection(key);
    let result = await connection.exec('cat', [path]);
    console.log('reading file', path);

    return result;
})

// connection, path, content
ipcMain.answerRenderer('file_write_string_ssh', async (data: [string, string, string]) => {
    let [key, path, text] = data;
    let connection = getConnection(key);
    let tmp = mkdtempSync(join(tmpdir(), 'iqtree-tmp'));
    let file = join(tmp, 'ex');

    writeFileSync(file, text, { encoding: 'utf-8' });

    await connection.putFile(file, path);
    console.log('Connection', key, 'copied from', file, 'to', path);

    rimraf(tmp);
    return true;
})

// connection, path, create if not exist
ipcMain.answerRenderer('create_directory_ssh', async (data: [string, string, boolean]) => {
    let [key, path, create] = data;
    let connection = getConnection(key);

    try {
        try {
            let res = await connection.exec('ls', ['-ld', path]);
            return res.startsWith('d');
        } catch {
            if (create) {
                await connection.exec('mkdir', [create ? '-p' : '', path].filter(Boolean));
                return true;
            }
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
});

ipcMain.answerRenderer('file_copy_ssh', async (data: [[string, string], [string, string]]) => {
    let [[key_s, src], [key_d, dst]] = data;

    if (key_s !== '' && key_s !== key_d) {
        throw new Error('Only support copying from local or on-server!')
    }

    if (key_d) {
        let connection = getConnection(key_d);

        if (key_s) {
            console.log('Connection', key_d, 'copying from', src, 'to', dst);
            await connection.exec('cp', [src, dst])
        } else {
            console.log('Connection', key_d, 'copying from (local)', src, 'to', dst);
            await connection.exec('rm', ['-rf', dst]);
            if (statSync(src).isDirectory()) {
                await connection.putDirectory(src, dst);
            } else {
                await connection.putFile(src, dst);
            }
        }
    } else {
        if (!key_s) {
            copyFileSync(src, dst)
        } else {
            let connection = getConnection(key_d);
            await connection.getFile(dst, src);
        }
    }

    return true;
})

ipcMain.answerRenderer('rimraf_ssh', async ([key, path]: [string, string]) => {
    let connection = getConnection(key);
    await connection.exec('rm', ['-rf', path]);
})