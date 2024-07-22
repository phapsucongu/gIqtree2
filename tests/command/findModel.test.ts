import { beforeEach, expect, test } from '@jest/globals';
import { getTemplateSettings, TemplateType } from '../../src/templates';
import { prepareCommand } from '../../src/command';
import { parseCommand } from './common';
import { PartitionType } from '../../src/interfaces/dataSettings';

const outputPrefix = 'output';
let cfg = getTemplateSettings(TemplateType.FindModel);

function parseSingleCommand(resume: boolean) {
    let command = prepareCommand(cfg, '', outputPrefix, resume);
    expect(command.length).toBe(1);

    return parseCommand(command[0]);
}

beforeEach(() => {
    cfg = getTemplateSettings(TemplateType.FindModel);
})

test('infer tree : demo 1.1', () => {
    let resume = false;

    cfg.data.alignmentFiles = ['input/example.phy'];
    cfg.data.alignmentFolder = undefined;

    let removed = parseSingleCommand(resume);

    let output = {
        s: 'input/example.phy',
        m: 'MFP',
        n: 0,
        T: 'AUTO',
        prefix: outputPrefix,
        redo: !resume
    }

    expect(removed).toEqual(output);
})

test('infer tree : demo 1.2.1', () => {
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
        redo: !resume
    }

    expect(removed).toEqual(output);
})

test('infer tree : demo 1.2.2', () => {
    let resume = false;

    cfg.data.alignmentFiles = [];
    cfg.data.alignmentFolder = 'input/test_folder';

    let removed = parseSingleCommand(resume);

    let output = {
        S: 'input/test_folder',
        m: 'MFP',
        n: 0,
        T: 'AUTO',
        prefix: outputPrefix,
        redo: !resume
    }

    expect(removed).toEqual(output);
})

test('infer tree : demo 1.2.3', () => {
    let resume = false;

    cfg.data.alignmentFiles = [];
    cfg.data.alignmentFolder = 'input/test_folder';
    cfg.data.partitionFile = 'input/example.nex';

    let removed = parseSingleCommand(resume);

    let output = {
        s: 'input/test_folder',
        S: 'input/example.nex',
        m: 'MFP',
        n: 0,
        T: 'AUTO',
        prefix: outputPrefix,
        redo: !resume
    }

    expect(removed).toEqual(output);
})


test.each<[PartitionType, string]>([
    [PartitionType.EdgeEqual, 'q'],
    [PartitionType.EdgeProportional, 'p'],
    [PartitionType.SeparateGeneTrees, 'S'],
    [PartitionType.EdgeUnlinked, 'Q'],
])('infer tree : demo 1.2.3 and partition type %s', (partitionType: PartitionType, arg: string) => {
    let resume = false;

    cfg.data.alignmentFiles = [];
    cfg.data.alignmentFolder = 'input/test_folder';
    cfg.data.partitionFile = 'input/example.nex';
    cfg.data.partitionType = partitionType;

    let removed = parseSingleCommand(resume);

    let output = {
        s: 'input/test_folder',
        [arg]: 'input/example.nex',
        m: 'MFP',
        n: 0,
        T: 'AUTO',
        prefix: outputPrefix,
        redo: !resume
    }

    expect(removed).toEqual(output);
})