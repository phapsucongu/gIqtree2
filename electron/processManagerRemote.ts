import EventEmitter from 'events';
import { getConnection } from './ssh';
import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';
import { PassThrough, Stream, Transform } from 'stream';
import { ipcMain } from 'electron-better-ipc';
import { createJobFile } from './jobGenerator';
import { basename, join } from 'path';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import rimraf from 'rimraf';

const currentProcess = new Map<string, RemoteTask[]>();
const currentProcessJob = new Map<string, Job[]>();

export interface SpawnData {
    id: string;
    arguments: string[][];
    binary: string;
    cwd: string,
    connection: string
}

export interface SpawnDataJob extends SpawnData {
    thread?: number;
}

export class Job extends EventEmitter {
    id: string;
    job_id: number = 0;
    public readonly binary: string = '';
    public readonly arguments: string[] = [];
    public readonly cwd: string = '';
    public readonly thread: number = 1;
    public pending = true;

    constructor(connection: string, binary: string, execArguments: string[], cwd: string, thread?: number) {
        super();
        this.id = connection;
        this.binary = binary;
        this.arguments = execArguments;
        this.cwd = cwd;
        this.thread = Math.floor(thread ?? 0) <= 0 ? 1 : Math.floor(thread ?? 0);
    }

    async submitJob() {
        let connection = getConnection(this.id);

        let absBinary = await connection.exec('realpath', [this.binary]);

        let file = createJobFile(
            'iqtree',
            this.thread,
            this.cwd,
            absBinary,
            this.arguments
        );

        let tmp = mkdtempSync(join(tmpdir(), 'iqtree-tmp'));
        let tmpFile = join(tmp, 'run.sh');
        writeFileSync(tmpFile, file);

        let remoteFile = join(this.cwd, 'test.sh');
        await connection.putFile(tmpFile, remoteFile);
        console.log('Written shell script to', remoteFile);
        rimraf.sync(tmp);

        await connection.exec('chmod', ['+x', remoteFile]);

        let res = await connection.execCommand(`cd ${this.cwd}; rm ${join(this.cwd, 'output', '*')}; bsub < ${remoteFile}`);
        let id = +(res.stderr.match(/Job <(\d+)>/)?.[1] ?? '');
        console.log('stdout', res.stdout)
        console.log('stderr', res.stderr)
        if (id === 0) {
            return false;
        }

        this.job_id = id;

        return true;
    }
}

export class RemoteTask extends EventEmitter {
    public readonly binary: string = '';
    public readonly arguments: string[] = [];
    public readonly cwd: string = '';

    public connection: NodeSSH | undefined;

    public outputStream?: Stream;
    public outputBuffer : Buffer[] = [];
    public errorBuffer : Buffer[] = [];
    public result?: SSHExecCommandResponse;
    public stdin?: Transform;

    exitCode?: number;
    signal?: string;
    kill?: boolean;

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
        this.stdin = new PassThrough();

        this.connection!.exec(this.binary, this.arguments, {
            stream: 'both',
            cwd: this.cwd,
            stdin: this.stdin,
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
                this.exitCode = this.result.code ?? undefined;
                this.signal = this.result.signal ?? undefined;
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

    async stop() {
        this.stdin?.write('\u0003');
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

    let record = currentProcess.get(id)!;
    let out = record.map(r => {
        return {
            ...r,
            outputStream: undefined,
            stdin: undefined,
            connection: undefined,
        }
    })

    return JSON.parse(JSON.stringify(out));
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
    for (let task of tasks) {
        task.stop();
    }
})

ipcMain
    .on('spawn_ssh', console.log)
    // .on('get-stdout', console.log)
    .on('get_ssh', console.log);


ipcMain.answerRenderer('spawn_ssh_job', async (data: SpawnDataJob) => {
    if (currentProcessJob.has(data.id)) {
        let records = currentProcessJob.get(data.id)!
        if (records.some(r => r.pending))
            return false;
    }

    let jobs = data.arguments.map(process => new Job(data.connection, data.binary, process, data.cwd, 1));
    currentProcessJob.set(data.id, jobs);

    let split = async () => {
        try {
            for (let [idx, job] of jobs.entries()) {
                await job.submitJob();
                // job.on('output', () => {
                //     ipcMain.sendToRenderers('command-data', { id: data.id, outputs: jobs.map(t => t.serialize()) })
                // })
                console.log(`Submitted job ${idx} on connection ${data.connection}. Job ID is ${job.job_id}`);
                // await new Promise(res => job.on('done', res));
            }
        } catch (e) {
            console.error('An error occurred trying to spawn job.')
            console.error(e);
            return false;
        }
    };

    // don't block
    split();
})