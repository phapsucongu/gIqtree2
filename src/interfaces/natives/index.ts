import type { SetOptional } from 'type-fest';
export interface File {
    /**
     * Host that contains this file.
     * Meaning of this field is up to backend.
     */
    host: string;
    path: string;
}

/**
 * For recursion purposes
 */
export interface FileNode {
    id: string;
    path: string;
    children?: FileNode[];
    name: string;
    isFolder: boolean;
}

export interface Task {
    id: string;

    host: string;
    binary: string;
    arguments: string[];
    cwd: string;

    outputBuffer: Uint8Array[];
    exitCode?: number;
    signal?: string;
}

export interface RecentRecord {
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

export interface NativeIntegration {
    // file ops
    file_exists: (file: File) => Promise<boolean>;
    file_read_string: (file: File) => Promise<string>;
    file_write_string: (file: File, content: string) => Promise<boolean>;
    file_copy: (from: File, to: File) => Promise<boolean>;

    directory_create: (file: File, recursive: boolean) => Promise<boolean>;

    recurse: (file: File) => Promise<FileNode>;
    rimraf: (file: File) => Promise<void>;

    // extract binaries
    decompress: (zip: Uint8Array, path: File) => Promise<void>;

    // records
    database_recent_list: () => Promise<RecentRecord[]>;
    database_recent_delete: (id: number) => Promise<void>;
    database_recent_push: (record: RecentRecord) => Promise<void>;
    database_get_connection: (id: number) => Promise<RecentRecord['connection']>;

    // process management
    getState: (id: string) => Promise<Task[]>;
    // getOutput: () => Promise<string[]>;
    spawn: (t: SetOptional<Task, 'outputBuffer' | 'exitCode' | 'signal'>[]) => Promise<void>;
    killAllTask: (id: string) => Promise<void>;

}