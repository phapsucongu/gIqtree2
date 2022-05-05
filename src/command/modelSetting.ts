import { Settings } from "../interfaces";
import { isMultipleGene } from "../interfaces/dataSettings";

function prepare({ model, data }: Settings) {
    let { autoMergePartitions } = model ?? {};
    let output: string[] = [];
    if (isMultipleGene(data)) {
        if (autoMergePartitions)
            output.push('--merge', autoMergePartitions)
    }

    return output;
}

export default prepare;