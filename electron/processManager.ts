import { ChildProcess, execFile } from 'child_process';
import { ReReadable } from 'rereadable-stream';
import { ipcMain } from 'electron-better-ipc';
import merge from 'merge-stream';
import { accessSync, chmodSync, constants, statSync } from 'fs';

const currentProcess = new Map<string, [ChildProcess, ReReadable]>();

interface SpawnData {
    id: string;
    arguments: string[];
    binary: string;
}

ipcMain.answerRenderer('spawn', (data: SpawnData) => {
    if (currentProcess.has(data.id) && (currentProcess.get(data.id)![0].exitCode === null)) {
        return false;
    }
    try {
        try {
            accessSync(data.binary, constants.X_OK);
        } catch {
            let fileStat = statSync(data.binary);
            chmodSync(data.binary, fileStat.mode | constants.S_IXUSR);
        }
        let process = execFile(data.binary, data.arguments, {
            maxBuffer: 1024 * 1024 * 50
        });

        console.log(`spawning process id ${process.pid} with arguments "${data.arguments.join(' ')}"`);
        process.on('exit', () => {
            console.log(`child process id ${process.pid} exited with exit code ${process.exitCode}`);
        })

        currentProcess.set(data.id, [
            process,
            merge(process.stdout!, process.stderr!)!.pipe(new ReReadable({
                length: 1024 * 1024 * 50
            }))
        ])
    } catch (e) {
        console.error('An error occurred trying to spawn child process.')
        console.error(e);
        return false;
    }
})

ipcMain.answerRenderer('list', () => {
    return [...currentProcess].map(pair => <const>[pair[0], pair[1][0]]);
})

ipcMain.answerRenderer('get', (id: string) => {
    if (!currentProcess.has(id)) {
        return false;
    }

    return JSON.parse(
        JSON.stringify(currentProcess.get(id)![0])
    );
})

ipcMain.answerRenderer('get-stdout', async (id: string) => {
    if (!currentProcess.has(id))  {
        return false;
    }

    const chunks : Buffer[] = [];

    let stdout = await new Promise((res, rej) => {
        let stream = currentProcess.get(id)![1].rewind();
        stream.on('data', c => chunks.push(Buffer.from(c)));
        stream.on('error', rej);
        let output = () => res(Buffer.concat(chunks).toString('utf-8'));
        setTimeout(output, 100);
        stream.on('end', output)
    })

    return stdout as string;
})

ipcMain
    .on('spawn', console.log)
    .on('get-stdout', console.log)
    .on('get', console.log);
