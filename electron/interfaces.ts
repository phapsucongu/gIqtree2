export interface Task {
    id: string;

    host: string;
    binary: string;
    arguments: string[];
    cwd: string;

    outputBuffer: Uint8Array[];
    exitCode?: number;
    signal?: string;
    kill?: boolean;
}