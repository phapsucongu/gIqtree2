import { Settings } from "../interfaces";
import { SequenceType, isMultipleGene } from "../interfaces/dataSettings";
import { DefaultRateCategories, getAvailableFrequencies as getAvailableStateFrequencies, ModelSettings, RHASModel } from "../interfaces/modelSettings";

export function getSubstitutionModelCommand(sequenceType?: SequenceType, model?: ModelSettings) {
    let { substitutionModel, rhasModel, proportionOfInvariableSites, rateCategories, stateFrequency, ascertainmentBiasCorrection } = model ?? {};
    let m = substitutionModel as string;
    if (proportionOfInvariableSites)
        m += '+I';

    if (rhasModel)
        m += '+' + (rhasModel === RHASModel.Gamma ? 'G' : 'R') + (rateCategories ?? DefaultRateCategories);

    let validStateFrequency = getAvailableStateFrequencies(sequenceType)
        .find(e => e.type === stateFrequency)

    if (validStateFrequency) {
        m += '+' + validStateFrequency.type;
    }

    if (ascertainmentBiasCorrection)
        m += '+ASC';

    return ['-m', m];
}

export function getAutoMergePartitionCommand(v : NonNullable<Settings['model']>['autoMergePartitions']) {
    if (v) return ['--merge', v];
    return [];
}

function prepare({ model, data }: Settings) {
    let { autoMergePartitions, substitutionModel, rhasModel } = model ?? {};
    let output: string[] = [];
    if (isMultipleGene(data)) {
        if (autoMergePartitions)
            output.push(...getAutoMergePartitionCommand(autoMergePartitions));
    }

    if (substitutionModel) {
        output.push(...getSubstitutionModelCommand(data.sequenceType, model));
    }
    else {
        output.push(
            '-m',
            rhasModel === RHASModel.Gamma ? 'TEST' : 'MFP'
        );
    }

    return output;
}

export default prepare;