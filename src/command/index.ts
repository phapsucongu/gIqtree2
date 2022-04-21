import { sep } from "path";
import { Settings } from "../interfaces";
import dataSetting from "./dataSetting";
import treeSearchSetting from "./treeSearchSetting";

export function prepareCommand (setting: Settings, outputPath?: string) {
    if (outputPath && outputPath.endsWith(sep))
        outputPath += sep;

    return [
        ...dataSetting(setting),
        ...treeSearchSetting(setting)
    ]
        .concat('--redo')
        .concat(outputPath ? ['--prefix', outputPath] : [])
        .map(argument => argument.includes(" ") ? `"${argument}"` : argument);
}