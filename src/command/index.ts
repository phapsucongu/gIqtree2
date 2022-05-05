import { join } from "path";
import split from 'argv-split';
import { Settings } from "../interfaces";
import assessmentSetting from "./assessmentSetting";
import dataSetting from "./dataSetting";
import treeSearchSetting from "./treeSearchSetting";
import othersSetting from "./otherSetting";
import datingSetting from "./datingSetting";
import modelSetting from "./modelSetting";

export function prepareCommand (setting: Settings, basename: string, outputPath?: string) {
    return [
        ...dataSetting(setting),
        ...modelSetting(setting),
        ...treeSearchSetting(setting),
        ...assessmentSetting(setting),
        ...datingSetting(setting),
        ...othersSetting(setting, outputPath ? join(outputPath, basename) : undefined),
    ]
        .concat('--redo')
        // specifically handle this
        .concat(split(setting.others?.appendCommandLine ?? '', false))
}