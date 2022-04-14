import { Settings } from "../interfaces";
import dataSetting from "./dataSetting";

export function prepareCommand (setting: Settings, outputPath?: string) {
    return [
        ...dataSetting(setting)
    ]
        .concat('--redo')
        .concat(outputPath ? ['--prefix', outputPath] : [])
        .map(argument => argument.includes(" ") ? `"${argument}"` : argument);
}