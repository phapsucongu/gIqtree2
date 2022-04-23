import { Settings } from "../interfaces";
import { DefaultPertubationStrength, DefaultUnsuccessfulIterationStop } from "../interfaces/treeSearchSettings";

function prepare({ treeSearch } : Settings) {
    let { enabled, unsuccessfulIterationsStop, pertubationStrength, constrainedTreeFile, referenceTreeFile, outgroupTaxa } = treeSearch;
    let output : string[] = [];
    if (enabled) output.push('-n', '0');
    if (unsuccessfulIterationsStop !== DefaultUnsuccessfulIterationStop && unsuccessfulIterationsStop !== null) {
        output.push('--nstop', unsuccessfulIterationsStop.toString())
    }

    if (pertubationStrength !== DefaultPertubationStrength && pertubationStrength !== null) {
        output.push('--perturb', pertubationStrength.toString());
    }

    if (constrainedTreeFile !== null) {
        output.push('-g', constrainedTreeFile)
    }

    if (referenceTreeFile !== null) {
        output.push('-te', referenceTreeFile);
    }

    if (outgroupTaxa !== null) {
        output.push('-o', outgroupTaxa)
    }

    return output;
}

export default prepare;