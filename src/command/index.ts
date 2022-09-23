import { join } from "path";
import { cpus } from 'os';
import split from 'argv-split';
import { Settings } from "../interfaces";
import assessmentSetting from "./assessmentSetting";
import dataSetting from "./dataSetting";
import treeSearchSetting from "./treeSearchSetting";
import othersSetting from "./otherSetting";
import datingSetting from "./datingSetting";
import modelSetting from "./modelSetting";
import { PartitionType } from "../interfaces/dataSettings";

export function prepareCommand (setting: Settings, basename: string, outputPath?: string, resume?: boolean) : string[][] {
    let final = [
        ...dataSetting(setting),
        ...modelSetting(setting),
        ...treeSearchSetting(setting),
        ...assessmentSetting(setting),
        ...datingSetting(setting)
    ]

    let speciesTree : string[] = [];
    let concordanceFactorEnabled = !!(setting.assessment.scf?.quartet || setting.assessment.gcf?.enabled);
    let commonThreadCount = setting.others?.thread ? setting.others?.thread : cpus().length;
    if (concordanceFactorEnabled) {
        switch (setting.assessment.speciesTree) {
            case undefined:
                let args = [
                    ...final,
                    ...othersSetting(
                        setting,
                        outputPath ? join(outputPath, 'concat') : undefined,
                        commonThreadCount
                    )
                ];
                speciesTree.push(...args);
                if (outputPath) {
                    final.push('-t', join(outputPath, 'concat') + '.treefile');
                }
                break;
            default:
                final.push('-t', setting.assessment.speciesTree);
                break;
        }
    }

    if (setting.assessment.scf?.quartet) {
        final.push('-s', setting.data.alignmentFolder || setting.data.alignmentFiles!.join(','));
        final.push('--scf', setting.assessment.scf?.quartet.toString())
    }

    let geneTree : string[] = [];

    if (setting.assessment.gcf?.enabled) {
        switch (setting.assessment.gcf.geneTree) {
            case undefined:
                let args = [
                    ...dataSetting(setting, PartitionType.SeparateGeneTrees),
                    ...modelSetting(setting),
                    ...othersSetting(
                        setting,
                        outputPath ? join(outputPath, 'loci') : undefined,
                        commonThreadCount
                    )
                ];
                geneTree.push(...args);
                if (outputPath) {
                    final.push('--gcf', join(outputPath, 'loci') + '.treefile');
                }
                break;
            default:
                final.push('--gcf', setting.assessment.gcf.geneTree);
                break;
        }
    }

    final = final
        .concat(...othersSetting(
            setting,
            outputPath ? join(outputPath, basename) : undefined,
            concordanceFactorEnabled ? commonThreadCount : undefined
        ))
        .concat(...(resume ? [] : ['--redo']))
        .concat(split(setting.others?.appendCommandLine ?? '', false));

    if (geneTree.length && !resume) geneTree.push('--redo');
    if (speciesTree.length && !resume) speciesTree.push('--redo');

    return [speciesTree, geneTree, final].filter(a => a.length);
}