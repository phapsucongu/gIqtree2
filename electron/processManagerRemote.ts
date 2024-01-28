import EventEmitter from 'events';
import { getConnection } from './ssh';
import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';
import { Stream } from 'stream';
import { ipcMain } from 'electron-better-ipc';

const currentProcess = new Map<string, RemoteTask[]>();

interface SpawnData {
    id: string;
    arguments: string[][];
    binary: string;
    cwd: string,
    connection: string
}

export class RemoteTask extends EventEmitter {
    public readonly binary: string = '';
    public readonly arguments: string[] = [];
    public readonly cwd: string = '';

    public connection: NodeSSH | undefined;

    public outputStream?: Stream;
    public outputBuffer : Buffer[] = [];
    public errorBuffer : Buffer[] = [];
    public result? : SSHExecCommandResponse;

    public constructor(binary: string, execArguments: string[], cwd: string, connection: NodeSSH) {
        super();
        this.binary = binary;
        this.arguments = execArguments;
        this.cwd = cwd;
        this.connection = connection;
    }

    serialize() {
        return Buffer.concat([...this.outputBuffer, ...this.errorBuffer]).toString('utf-8');
    }

    async start() {
        await this.connection?.exec('chmod +x', [this.binary]);

        this.connection!.exec(this.binary, this.arguments, {
            stream: 'both',
            cwd: this.cwd,
            onStdout: (c) => {
                this.outputBuffer.push(c);
                this.emit('output');
            },
            onStderr: (c) => {
                this.errorBuffer.push(c);

            },
        })
            .then(result => {
                this.result = result;
                this.emit('done');
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                this.emit('done');
            })

        console.log('Executing', this.binary, 'w/ args', `"${this.arguments.join(' ')}"`);

        return this;
    }
}

ipcMain.answerRenderer('spawn_ssh', async (data: SpawnData) => {
    if (currentProcess.has(data.id)) {
        let records = currentProcess.get(data.id)!
        if (records.some(r => r.result?.code === null && !r.result?.signal))
            return false;
    }

    let c = getConnection(data.connection);

    let tasks = data.arguments.map(process => new RemoteTask(data.binary, process, data.cwd, c));
    currentProcess.set(data.id, tasks);

    let split = async () => {
        try {
            for (let [idx, task] of tasks.entries()) {
                task.start();
                task.on('output', () => {
                    ipcMain.sendToRenderers('command-data', { id: data.id, outputs: tasks.map(t => t.serialize()) })
                })
                console.log(`Starting task ${idx} on connection ${c}`);
                await new Promise(res => task.on('done', res));
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

ipcMain.answerRenderer('list_ssh', () => {
    return [...currentProcess].map(pair => <const>[pair[0], pair[1][0]]);
})

ipcMain.answerRenderer('get_ssh', (id: string) => {
    if (!currentProcess.has(id)) {
        return false;
    }

    return JSON.parse(
        JSON.stringify(currentProcess.get(id)!)
    );
})

ipcMain.answerRenderer('get-stdout_ssh', async (id: string) => {
    if (!currentProcess.has(id)) {
        return false;
    }

    let tasks = currentProcess.get(id)!;
    return tasks.map(t => t.serialize());
})

ipcMain.answerRenderer('kill_ssh', async (id: string) => {
    if (!currentProcess.has(id)) {
        return false;
    }

    let tasks = currentProcess.get(id)!;
})

ipcMain
    .on('spawn_ssh', console.log)
    // .on('get-stdout', console.log)
    .on('get_ssh', console.log);
