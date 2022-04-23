import { join } from "path";
import { Settings } from "../interfaces";
import assessmentSetting from "./assessmentSetting";
import dataSetting from "./dataSetting";
import treeSearchSetting from "./treeSearchSetting";

export function prepareCommand (setting: Settings, basename: string, outputPath?: string) {
    return [
        ...dataSetting(setting),
        ...treeSearchSetting(setting),
        ...assessmentSetting(setting)
    ]
        .concat('--redo')
        .concat(outputPath ? ['--prefix', join(outputPath, basename)] : [])
        .map(argument => argument.includes(" ") ? `"${argument}"` : argument);
}