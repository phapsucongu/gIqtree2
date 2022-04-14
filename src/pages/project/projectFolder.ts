import { mkdirSync } from "fs";
import { join, sep } from "path";

export function getOutputFolder(projectPath: string) {
    let folder = join(projectPath, 'output');
    mkdirSync(folder, { recursive: true });
    return folder + sep;
}