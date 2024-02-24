
import { join } from 'path';
import { app } from 'electron';
import { ipcMain } from 'electron-better-ipc';
import init, { Database } from 'sql.js';
import { readFileSync, writeFileSync } from 'fs';

const dbFileName = 'projects2.sqlite';

const filePath = join(app.getPath('userData'), dbFileName);
console.log('Reading from file @', filePath)
let database : Database | undefined;

app.on('will-quit', writeToDisk)

function writeToDisk() {
    if (database) writeFileSync(filePath, database.export())
}

interface Record {
    id: number;
    path: string;
    timestamp: string;
    connectionId: number;
    connection?: {
        host: string;
        port: number;
        username: string;
        password: string;
    }
}

async function ensureDatabaseOpen() {
    let file : Buffer | undefined;
    try {
        file = readFileSync(filePath);
    } catch (e) { console.error(e) };

    if (database) return database;

    let initSql = await init();
    let db = new initSql.Database(file);
    db.run('CREATE TABLE IF NOT EXISTS project (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT, timestamp TEXT, connectionId INTEGER)');
    db.run('CREATE TABLE IF NOT EXISTS connections (id INTEGER PRIMARY KEY AUTOINCREMENT, host TEXT, port INTEGER, username TEXT, password TEXT)');
    return database = db;
}

ipcMain.answerRenderer('db_list', async () => {
    let database = await ensureDatabaseOpen();
    let a = database.exec('SELECT * FROM project');

    if (a.length === 0) return [];

    return a[0].values.map(row => {
        let out = ({
            id: +row[0]?.toString()!,
            path: row[1]?.toString()!,
            timestamp: row[2]?.toString()!
        }) as Record;

        let cId = row[3];
        if (cId) {
            let connection = database.exec('SELECT * FROM connections WHERE id = ?', [cId]);
            if (connection.length) {
                let c = connection[0];

                let r = {
                    host: c.values[0][1],
                    port: +c.values[0][2]!,
                    username: c.values[0][3],
                    password: c.values[0][4],
                } as Record['connection'];
                out.connection = r;
            }
        }

        return out;
    })
})

ipcMain.answerRenderer('db_connection', async (id: number) => {
    let database = await ensureDatabaseOpen();
    let r = database.exec(`SELECT host, port, username, password FROM connections WHERE id = ?`, [id]);
    if (r.length === 0) return null;

    let record = r[0].values[0];
    return {
        host: record[0],
        port: record[1],
        username: record[2],
        password: record[3]
    };
})

ipcMain.answerRenderer('db_record', async (record: Record) => {
    let database = await ensureDatabaseOpen();

    let r = database.exec(`SELECT id FROM project WHERE path = ? AND connectionId = ?`, [record.path, record.connectionId]);

    if (r.length === 0) {
        let c = record.connection;
        let cid = 0;
        if (c) {
            database.exec(`INSERT INTO connections (host, port, username, password) VALUES (?, ?, ?, ?)`, [
                c.host,
                c.port,
                c.username,
                c.password
            ]);
            let r2 = database.exec(`SELECT id FROM connections ORDER BY id DESC LIMIT 1`);
            cid = +r2[0].values[0][0]!;
        }

        database.exec(`INSERT INTO project (path, timestamp, connectionId) VALUES (?, ?, ?)`, [
            record.path,
            new Date().toJSON(),
            cid
        ]);
    } else {
        let id = r[0].values[0][0];
        database.exec(`UPDATE project SET timestamp = ? WHERE id = ?`, [new Date().toJSON(), id]);
        let c = database.exec(`SELECT connectionId FROM project WHERE id = ?`, [id]);
        let cid = c[0].values[0][0];
        if (cid) {
            let conn = record.connection!;
            database.exec(`UPDATE connections SET host = ?, port = ?, username = ?, password = ? WHERE id = ?`, [
                conn.host, +conn.port, conn.username, conn.password
            ]);
        }
    }
    writeToDisk();
})

ipcMain.answerRenderer('db_remove', async (id: number) => {
    let database = await ensureDatabaseOpen();
    database.run(`DELETE FROM project WHERE id = ?`, [id]);
    writeToDisk();
})