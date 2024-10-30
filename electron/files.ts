import { ipcMain } from "electron-better-ipc";
import { readFileSync, writeFileSync, existsSync, lstatSync, accessSync, constants, mkdirSync, realpathSync, mkdtempSync } from "fs";
import { sync as rimraf } from 'rimraf';
import { copySync } from 'fs-extra';

ipcMain.answerRenderer('file_exists_string', (path: string) => {
    return existsSync(path);
})

ipcMain.answerRenderer('file_read_string', (path: string) => {
    let result = readFileSync(path, 'utf-8');
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

// source, destination
ipcMain.answerRenderer('file_copy', (data: [string, string]) => {
    let [src, dst] = data;
    if (realpathSync(src) !== dst) {
        rimraf(dst);
        copySync(src, dst);
    }

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