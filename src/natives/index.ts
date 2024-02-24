import { SetOptional } from "type-fest";
import { NativeIntegration } from "../interfaces";
import { File, FileNode, RecentRecord, Task } from "../interfaces/natives";
import { ipcRenderer } from 'electron-better-ipc';

class LocalNative implements NativeIntegration {
    file_exists (file: File) {
        return ipcRenderer.callMain('file_exists_string', file.path) as Promise<boolean>;
    }
    file_read_string (file: File) {
        return ipcRenderer.callMain('file_read_string', file.path) as Promise<string>;
    }
    file_write_string (file: File, content: string) {
        return ipcRenderer.callMain('file_write_string', [file.path, content]) as Promise<true>;
    }
    file_copy (from: File, to: File) {
        return ipcRenderer.callMain('file_copy', [from.path, to.path]) as Promise<true>;
    }

    directory_create (file: File, recursive: boolean) {
        return ipcRenderer.callMain('create_directory', [file.path, recursive]) as Promise<boolean>;
    }

    recurse(file: File) {
        return ipcRenderer.callMain('recurse', file.path) as Promise<FileNode>;
    }

    decompress(zip: Uint8Array, path: File) {
        return ipcRenderer.callMain('decompress', [zip, path.path]) as Promise<void>;
    }

    rimraf (file: File) {
        return ipcRenderer.callMain('rimraf', file.path) as Promise<void>;
    }

    database_recent_list() {
        return ipcRenderer.callMain('db_list') as Promise<RecentRecord[]>;
    }
    database_recent_delete(id: number) {
        return ipcRenderer.callMain('db_remove', id) as Promise<void>;
    }
    database_recent_push(record: RecentRecord) {
        return ipcRenderer.callMain('db_record', record) as Promise<void>;
    }
    database_get_connection(id: number) {
        return ipcRenderer.callMain('db_connection', id) as Promise<RecentRecord['connection']>;
    }
    getState(id: string) {
        return ipcRenderer.callMain('get', id) as Promise<Task[]>
    }
    spawn (t: SetOptional<Task, 'outputBuffer' | 'exitCode' | 'signal'>[]) {
        let res = ipcRenderer.callMain('spawn', {
            id: t[0].id,
            binary: t[0].binary,
            cwd: t[0].cwd,
            arguments: t.map(r => r.arguments)
        })
            .then((v: unknown) => {
                if (v === false) {
                    throw new Error('failed to spawn child process');
                }
            })
        return res;
    }
    killAllTask (id: string) {
        return ipcRenderer.callMain('kill', id) as Promise<void>
    }

}

export { LocalNative };