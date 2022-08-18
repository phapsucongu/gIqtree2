import { Settings } from "../interfaces";
import { BootstrapMethod, DefaultALRTReplicate, DefaultBootstrapMethodReplicate, DefaultLocalBootstrapReplicate, DefaultMultiPartitionSamplingStrategy, SingleBranchTest } from "../interfaces/assessmentSettings";
import { isMultipleGene } from "../interfaces/dataSettings";

function prepare(settings: Settings) {
    let output: string[] = [];
    let { assessment } = settings;
    switch (assessment.bootstrapMethod) {
        case BootstrapMethod.Standard:
            output.push('-b', (assessment.bootstrapMethodReplicate ?? DefaultBootstrapMethodReplicate).toString());
            break;
        case BootstrapMethod.UltraFastBootstrap:
            output.push('-B', (assessment.bootstrapMethodReplicate ?? DefaultBootstrapMethodReplicate).toString());
            if (assessment.ufbootOption) {
                output.push('--bnni');
            }
            break;
    }

    if (isMultipleGene(settings.data) && assessment.bootstrapMethod !== null) {
        switch (assessment.multiPartitionSamplingStrategy) {
            case undefined:
            case DefaultMultiPartitionSamplingStrategy:
                break;
            default:
                output.push('--sampling', assessment.multiPartitionSamplingStrategy);
                break;
        }
    }

    for (let test of assessment.singleBranchTests ?? []) {
        switch (test) {
            case SingleBranchTest.Parametric_aLRT:
                output.push('--alrt', '0');
                break;
            case SingleBranchTest.SH_aLRT:
                output.push('--alrt', (assessment.approximateLikelihoodReplicate ?? DefaultALRTReplicate).toString());
                break;
            case SingleBranchTest.LocalBootstrap:
                output.push('--lbp', (assessment.localBootstrapReplicate ?? DefaultLocalBootstrapReplicate).toString());
                break;
            case SingleBranchTest.ABayes:
                output.push('--abayes');
                break;
        }
    }

    return output;
}

export default prepare;