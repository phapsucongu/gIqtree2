import { NativeIntegration } from "../interfaces";
import { File, FileNode, RecentRecord, Task } from "../interfaces/natives";
import { ipcRenderer } from "electron-better-ipc";
import { LocalNative } from ".";

function assert(a: any) {
    if (!a) {
        throw new Error(`Assert value ${a} failed!`);
    }
}

class RemoteNative implements NativeIntegration {
    private local: LocalNative;
    constructor(private ssh: string) {
        this.local = new LocalNative();
    }

    assertHost(file: File) {
        assert(file.host === this.ssh || file.host === '');
    }

    file_exists(file: File): Promise<boolean> {
        this.assertHost(file);
        return ipcRenderer.callMain('file_exists_string_ssh', [file.host, file.path])
    }

    file_read_string(file: File): Promise<string> {
        this.assertHost(file);
        return ipcRenderer.callMain('file_read_string_ssh', [file.host, file.path]);
    }
    file_write_string(file: File, content: string): Promise<boolean> {
        this.assertHost(file);
        return ipcRenderer.callMain('file_write_string_ssh', [file.host, file.path, content]);
    }
    file_copy(from: File, to: File): Promise<boolean> {
        this.assertHost(from);
        this.assertHost(to);
        return ipcRenderer.callMain('file_copy_ssh', [
            [from.host, from.path],
            [to.host, to.path]
        ])
    }
    directory_create(file: File, recursive: boolean): Promise<boolean> {
        this.assertHost(file);
        return ipcRenderer.callMain('create_directory_ssh', [file.host, file.path, recursive])
    }
    recurse(file: File): Promise<FileNode> {
        this.assertHost(file);
        return ipcRenderer.callMain('recurse_ssh', [file.host, file.path]);
    };
    rimraf(file: File): Promise<void> {
        this.assertHost(file);
        return ipcRenderer.callMain('rimraf_ssh', [file.host, file.path]);
    }
    decompress(zip: Uint8Array, path: File): Promise<void> {
        this.assertHost(path);
        return ipcRenderer.callMain('decompress_ssh', [path.host, zip, path.path]);
    }
    database_recent_list = () => this.local.database_recent_list();
    database_recent_delete = (id: number) => this.local.database_recent_delete(id);
    database_recent_push = (record: RecentRecord) => this.local.database_recent_push(record);
    database_get_connection = (id: number) => this.local.database_get_connection(id);
    getState = (id: string): Promise<Task[]> => {
        return ipcRenderer.callMain('get_ssh_job', id);
    }
    getOutput = async (id: string) => {
        let r = await ipcRenderer.callMain('get-stdout_ssh_job', id);
        if (r === false) return [];
        return r as string[];
    }
    spawn = (t: Parameters<LocalNative['spawn']>[0]) => {
        let res = ipcRenderer.callMain('spawn_ssh_job', {
            id: t[0].id,
            binary: t[0].binary,
            cwd: t[0].cwd,
            arguments: t.map(r => r.arguments),
            connection: t[0].host,
            submitCommand: (t as any)['submitCommand'],
            submitTemplate: (t as any)['submitTemplate']

        })
            .then((v: unknown) => {
                if (v === false) {
                    throw new Error('failed to spawn child process');
                }
            })
        return res;
    }
    killAllTask = (id: string): Promise<void> => {
        return ipcRenderer.callMain('kill_ssh', id);
    }

}

export { RemoteNative };