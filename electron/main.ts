import { app, BrowserWindow, session } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import './processManager';
import './sqlite';
import './files';
import './filesRemote';
import './filesTree';
import './ssh';
import './binaryDecompress';
import './processManagerRemote';

require('@electron/remote/main').initialize();

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        },
        frame: false
    })
    // win.maximize();
    require('@electron/remote/main').enable(win.webContents);

    if (app.isPackaged) {
        // 'build/index.html'
        win.loadURL(`file://${__dirname}/../index.html`);
    } else {
        win.loadURL('http://localhost:3000/');

        win.webContents.openDevTools();

        // Hot Reloading on 'node_modules/.bin/electronPath'
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname,
                '..',
                '..',
                'node_modules',
                '.bin',
                'electron' + (process.platform === "win32" ? ".cmd" : "")),
            forceHardReset: true,
            hardResetMethod: 'exit'
        });
    }
}

app.whenReady().then(() => {
    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    session.defaultSession.webRequest.onHeadersReceived({
        urls: [
            'https://github.com/iqtree/iqtree2/releases/download/*',
            'https://objects.githubusercontent.com/*'
        ]
    }, (details, callback) => {
        let { responseHeaders = {} } = details;
            responseHeaders['Access-Control-Allow-Origin'] = ['*'];

        callback({ responseHeaders: responseHeaders });

    })
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});
