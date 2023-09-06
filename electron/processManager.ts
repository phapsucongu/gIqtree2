import { ChildProcess, execFile } from 'child_process';
import { ReReadable } from 'rereadable-stream';
import { ipcMain } from 'electron-better-ipc';
import merge from 'merge-stream';
import { accessSync, chmodSync, constants, statSync } from 'fs';
import { WriteStream } from 'tty';
import { Stream } from 'stream';
import EventEmitter from 'events';

const currentProcess = new Map<string, Task[]>();

interface SpawnData {
    id: string;
    arguments: string[][];
    binary: string;
}

export class Task extends EventEmitter {
    public readonly binary: string = '';
    public readonly arguments: string[] = [];
    public process: ChildProcess | undefined;
    public outputStream?: Stream;
    public outputBuffer : Buffer[] = [];
    public constructor(binary: string, execArguments: string[]) {
        super();
        this.binary = binary;
        this.arguments = execArguments;
    }

    start() {
        this.process = execFile(this.binary, this.arguments, {
            maxBuffer: 1024 * 1024 * 50
        })
        this.outputStream = merge(this.process.stdout! as WriteStream, this.process.stderr! as WriteStream)!;
        this.outputStream.on('data', c => {
            this.outputBuffer.push(Buffer.from(c));
            // this.emit('output', this.serialize());
            this.emit('output');
        });

        console.log(`spawning process id ${this.process.pid} with arguments "${this.arguments.join(' ')}"`);
        this.process.on('exit', () => {
            console.log(`child process id ${this.process!.pid} exited with exit code ${this.process!.exitCode}`);
            if (this.process!.signalCode !== null)
                console.log(`child process id ${this.process!.pid} seems to be killed with code ${this.process!.signalCode}`)
        });

        return this.process;
    }

    serialize() {
        return Buffer.concat(this.outputBuffer).toString('utf-8');
    }
}

ipcMain.answerRenderer('spawn', async (data: SpawnData) => {
    if (currentProcess.has(data.id)) {
        let records = currentProcess.get(data.id)!
        if (records.some(r => r.process?.exitCode === null && !r.process?.signalCode))
            return false;
    }

    let tasks = data.arguments.map(process => new Task(data.binary, process));
    currentProcess.set(data.id, tasks);

    let split = async () => {
        try {
            try {
                accessSync(data.binary, constants.X_OK);
            } catch {
                let fileStat = statSync(data.binary);
                chmodSync(data.binary, fileStat.mode | constants.S_IXUSR);
            }

            let first : number | undefined;
            for (let task of tasks) {
                task.start();
                task.on('output', () => {
                    ipcMain.sendToRenderers('command-data', { id: data.id, outputs: tasks.map(t => t.serialize()) })
                })
                if (first === undefined) {
                    first = task.process!.pid;
                    console.log(`Starting task, first PID is ${first}`);
                }
                else {
                    console.log(`Spawned child w/ PID ${task.process!.pid}, from task w/ first PID ${first}`);
                }
                await new Promise(res => task.process!.on('close', res));
            }
        } catch (e) {
            console.error('An error occurred trying to spawn child process.')
            console.error(e);
            return false;
        }
    };

    // don't block
    split();
})

ipcMain.answerRenderer('list', () => {
    return [...currentProcess].map(pair => <const>[pair[0], pair[1][0]]);
})

ipcMain.answerRenderer('get', (id: string) => {
    if (!currentProcess.has(id)) {
        return false;
    }

    return JSON.parse(
        JSON.stringify(currentProcess.get(id)!)
    );
})

ipcMain.answerRenderer('get-stdout', async (id: string) => {
    if (!currentProcess.has(id)) {
        return false;
    }

    let tasks = currentProcess.get(id)!;
    return tasks.map(t => t.serialize());
})

ipcMain.answerRenderer('kill', async (id: string) => {
    if (!currentProcess.has(id)) {
        return false;
    }

    let tasks = currentProcess.get(id)!;
    for (let task of tasks) task.process?.kill('SIGKILL');
})

ipcMain
    .on('spawn', console.log)
    // .on('get-stdout', console.log)
    .on('get', console.log);
