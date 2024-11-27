import { join, sep } from "path";
import { NativeIntegration } from "../../../interfaces";
import { File } from "../../../interfaces/natives";

export class Folder {
    private native: NativeIntegration;
    constructor(native: NativeIntegration) {
        this.native = native;
    }

    async ensureInputOutputFolder(path: File) {
        await this.native.directory_create({
            path: getInputFolder(path.path),
            host: path.host
        }, true);

        await this.native.directory_create({
            path: getOutputFolder(path.path),
            host: path.host
        }, true);
    }
}

function toPosixPath(path: string): string {
    return path.replace(/\\/g, '/');
}

//temporary fix
export function getOutputFolder(projectPath: string) {
    console.log(toPosixPath(join(projectPath, 'output')))
    let folder = toPosixPath(join(projectPath, 'output'));
    return folder + '/';
}

//temporary fix
export function getInputFolder(projectPath: string) {
    console.log(toPosixPath(join(projectPath, 'input')))
    let folder = toPosixPath(join(projectPath, 'input'));
    return folder + '/';
}