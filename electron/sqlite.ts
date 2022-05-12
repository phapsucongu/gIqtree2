
import { join } from 'path';
import { app } from 'electron';
import { ipcMain } from 'electron-better-ipc';
import init, { Database } from 'sql.js';
import { readFileSync, writeFileSync } from 'fs';

const dbFileName = 'projects.sqlite';

const filePath = join(app.getPath('userData'), dbFileName);
console.log('Reading from file @', filePath)
let database : Database | undefined;

app.on('will-quit', writeToDisk)

function writeToDisk() {
    if (database) writeFileSync(filePath, database.export())
}

async function ensureDatabaseOpen() {
    let file : Buffer | undefined;
    try {
        file = readFileSync(filePath);
    } catch (e) { console.error(e) };

    if (database) return database;

    let initSql = await init();
    let db = new initSql.Database(file);
    db.run('CREATE TABLE IF NOT EXISTS project (id TEXT PRIMARY KEY, timestamp TEXT)');
    return database = db;
}

ipcMain.answerRenderer('db_list', async () => {
    let database = await ensureDatabaseOpen();
    let a = database.exec('SELECT * FROM project');

    if (a.length === 0) return [];

    return a[0].values.map(row => ({
        path: row[0]?.toString()!,
        timestamp: row[1]?.toString()!
    }))
})

ipcMain.answerRenderer('db_record', async (path: string) => {
    let database = await ensureDatabaseOpen();
    database.run(`INSERT OR REPLACE INTO project (id, timestamp) VALUES (?, ?)`, [path, new Date().toJSON()]);
    writeToDisk();
})

ipcMain.answerRenderer('db_remove', async (path: string) => {
    let database = await ensureDatabaseOpen();
    database.run(`DELETE FROM project WHERE id = ?`, [path]);
    writeToDisk();
})