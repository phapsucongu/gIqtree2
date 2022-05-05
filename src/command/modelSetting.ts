import { Settings } from "../interfaces";
import { isMultipleGene } from "../interfaces/dataSettings";
import { DefaultRateCategories, getAvailableFrequencies as getAvailableStateFrequencies, RHASModel } from "../interfaces/modelSettings";

function prepare({ model, data }: Settings) {
    let { autoMergePartitions, substitutionModel, rhasModel, proportionOfInvariableSites, rateCategories, stateFrequency, ascertainmentBiasCorrection } = model ?? {};
    let output: string[] = [];
    if (isMultipleGene(data)) {
        if (autoMergePartitions)
            output.push('--merge', autoMergePartitions)
    }

    if (substitutionModel) {
        let model = substitutionModel as string;
        if (proportionOfInvariableSites)
            model += '+I';

        if (rhasModel)
            model += '+' + (rhasModel === RHASModel.Gamma ? 'G' : 'R') + (rateCategories ?? DefaultRateCategories);

        let validStateFrequency = getAvailableStateFrequencies(data.sequenceType)
            .find(e => e.type === stateFrequency)

        if (validStateFrequency) {
            model += '+' + validStateFrequency.type;
        }

        if (ascertainmentBiasCorrection)
            model += '+ASC';

        output.push('-m', model);
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