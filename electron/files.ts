import { ipcMain } from "electron-better-ipc";
import { readFileSync, writeFileSync, existsSync, lstatSync, accessSync, constants, mkdirSync, realpathSync, mkdtempSync } from "fs";
import { sync as rimraf } from 'rimraf';
import { copySync } from 'fs-extra';

import { getConnection } from "./ssh";
import { tmpdir } from "os";
import { join } from "path";

ipcMain.answerRenderer('file_exists_string', (path: string) => {
    return existsSync(path);
})

// key, path
ipcMain.answerRenderer('file_exists_string_ssh', async (data: [string, string]) => {
    let [key, path] = data;
    let connection = getConnection(key);

    try {
        await connection.exec('ls', [path]);
        return true;
    } catch {
        return false;
    }
})

ipcMain.answerRenderer('file_read_string', (path: string) => {
    let result = readFileSync(path, 'utf-8');
    return result;
})

ipcMain.answerRenderer('file_read_string_ssh', async (data: [string, string]) => {
    let [key, path] = data;
    let connection = getConnection(key);
    let result = await connection.exec('cat', [path]);
    console.log('reading file', path);

    return result;
})

// path, content
ipcMain.answerRenderer('file_write_string', (data: [string, string]) => {
    let [path, text] = data;
    writeFileSync(path, text, {
        encoding: 'utf-8'
    });
    return true;
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

    rimraf(tmp)
    return true;
})

ipcMain.answerRenderer('check_directory_writable', (path: string) => {
    let lstat = lstatSync(path);
    try {
        accessSync(path, constants.W_OK | constants.R_OK);
    } catch {
        return { result: false }
    }
    return { result: true, is_dir: lstat.isDirectory() };
})

// path, create if not exist
ipcMain.answerRenderer('create_directory', (data: [string, boolean]) => {
    let [path, create] = data;
    if (!existsSync(path)) {
        if (create) {
            try {
                mkdirSync(path);
                return true;
            } catch {
                return false
            }
        }

        return false;
    }
    return true;
})


// connection, path, create if not exist
ipcMain.answerRenderer('create_directory_ssh', async (data: [string, string, boolean]) => {
    let [key, path, create] = data;
    let connection = getConnection(key);

    try {
        try {
            let res = await connection.exec('ls -ld', [path]);
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
})

// source, destination
ipcMain.answerRenderer('file_copy', (data: [string, string]) => {
    let [src, dst] = data;
    if (realpathSync(src) !== dst) {
        rimraf(dst);
        copySync(src, dst);
    }

    return true;
})

// source, [key, destination]
ipcMain.answerRenderer('file_copy_ssh', async (data: [string, [string, string]]) => {
    let [src, [key, dst]] = data;

    let connection = getConnection(key);
    console.log('Connection', key, 'copying from', src, 'to', dst);
    await connection.putFile(src, dst);

    return true;
})

// path, recursive
ipcMain.answerRenderer('directory_create', (data: [string, boolean]) => {
    let [path, recursive] = data;
    mkdirSync(path, { recursive });
})

ipcMain.answerRenderer('rimraf', (path: string) => {
    rimraf(path);
})