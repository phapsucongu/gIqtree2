import { beforeEach, expect, test } from '@jest/globals';
import { getTemplateSettings, TemplateType } from '../../src/templates';
import { prepareCommand } from '../../src/command';
import { parseCommand } from './common';

const outputPrefix = 'output';
let cfg = getTemplateSettings(TemplateType.MergePartitions);

function parseSingleCommand(resume: boolean) {
    let command = prepareCommand(cfg, '', outputPrefix, resume);
    expect(command.length).toBe(1);

    return parseCommand(command[0]);
}

beforeEach(() => {
    cfg = getTemplateSettings(TemplateType.FindModel);
})

test('merge partitions : demo 2.1', () => {
    let resume = false;

    cfg.data.alignmentFiles = ['input/example.phy'];
    cfg.data.alignmentFolder = undefined;
    cfg.data.partitionFile = 'input/example.nex';

    let removed = parseSingleCommand(resume);

    let output = {
        s: 'input/example.phy',
        S: 'input/example.nex',
        m: 'MFP',
        n: 0,
        T: 'AUTO',
        prefix: outputPrefix,
        redo: !resume,
        merge: true
    }

    expect(removed).toEqual(output);
})