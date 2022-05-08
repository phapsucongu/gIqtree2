import { join } from "path";
import split from 'argv-split';
import { Settings } from "../interfaces";
import assessmentSetting from "./assessmentSetting";
import dataSetting from "./dataSetting";
import treeSearchSetting from "./treeSearchSetting";
import othersSetting from "./otherSetting";
import datingSetting from "./datingSetting";
import modelSetting from "./modelSetting";
import { PartitionType } from "../interfaces/dataSettings";

export function prepareCommand (setting: Settings, basename: string, outputPath?: string) : string[][] {
    let final = [
        ...dataSetting(setting),
        ...modelSetting(setting),
        ...treeSearchSetting(setting),
        ...assessmentSetting(setting),
        ...datingSetting(setting)
    ]

    let speciesTree : string[] = [];

    if (setting.assessment.scf?.enabled || setting.assessment.gcf?.enabled) {
        switch (setting.assessment.speciesTree) {
            case undefined:
                let args = [...final, ...othersSetting(setting, outputPath ? join(outputPath, 'concat') : undefined)];
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

    if (setting.assessment.scf?.enabled) {
        final.push('-s', setting.data.alignmentFolder || setting.data.alignmentFiles!.join(','));
        // TODO: change this
        final.push('--scf', setting.assessment.scf?.quartet?.toString() ?? '1')
    }

    let geneTree : string[] = [];

    if (setting.assessment.gcf?.enabled) {
        switch (setting.assessment.gcf.geneTree) {
            case undefined:
                let args = [
                    ...dataSetting(setting, PartitionType.SeparateGeneTrees),
                    ...modelSetting(setting),
                    ...othersSetting(setting, outputPath ? join(outputPath, 'loci') : undefined)
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
        .concat(...othersSetting(setting, outputPath ? join(outputPath, basename) : undefined))
        .concat('--redo')
        .concat(split(setting.others?.appendCommandLine ?? '', false));

    if (geneTree.length) geneTree.push('--redo');
    if (speciesTree.length) speciesTree.push('--redo');

    return [speciesTree, geneTree, final].filter(a => a.length);
}