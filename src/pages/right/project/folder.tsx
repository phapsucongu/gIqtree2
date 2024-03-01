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

export function getOutputFolder(projectPath: string) {
    let folder = join(projectPath, 'output');
    return folder + sep;
}

export function getInputFolder(projectPath: string) {
    let folder = join(projectPath, 'input');
    return folder + sep;
}