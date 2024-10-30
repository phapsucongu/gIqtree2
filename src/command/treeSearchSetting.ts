import { Settings } from "../interfaces";
import { BootstrapMethod } from "../interfaces/settings/assessmentSettings";
import { DefaultPertubationStrength, DefaultUnsuccessfulIterationStop } from "../interfaces/settings/treeSearchSettings";

function prepare({ treeSearch, assessment } : Settings) {
    let { enabled, unsuccessfulIterationsStop, pertubationStrength, constrainedTreeFile, referenceTreeFile, outgroupTaxa } = treeSearch;
    let output : string[] = [];
    if (!enabled) {
        // conflict with UFBoot.
        if (assessment?.bootstrapMethod !== BootstrapMethod.UltraFastBootstrap) {
            output.push('-n', '0');
        }
    }
    if (unsuccessfulIterationsStop !== DefaultUnsuccessfulIterationStop && unsuccessfulIterationsStop) {
        output.push('--nstop', unsuccessfulIterationsStop.toString())
    }

    if (pertubationStrength !== DefaultPertubationStrength && pertubationStrength) {
        output.push('--perturb', pertubationStrength.toString());
    }

    if (constrainedTreeFile !== undefined) {
        output.push('-g', constrainedTreeFile)
    }

    if (referenceTreeFile !== undefined) {
        output.push('-te', referenceTreeFile);
    }

    if (outgroupTaxa) {
        output.push('-o', outgroupTaxa)
    }

    return output;
}

export default prepare;