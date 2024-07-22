import { Settings } from "../interfaces";
import { isMultipleGene, PartitionType, SequenceType } from "../interfaces/dataSettings";

function prepare({ data }: Settings, overwritePartitionType?: PartitionType) {
    let output: string[] = [];
    switch (data.sequenceType) {
        case SequenceType.Codon:
            output.push('--seqtype', 'CODON' + (data.codonType?.toString() ?? ''));
            break;
        case undefined:
            break;
        default:
            output.push('--seqtype', data.sequenceType);
            break;
    }

    let { alignmentFiles } = data;
    if (alignmentFiles?.length) alignmentFiles = alignmentFiles.filter(file => file);

    let multipleGene = isMultipleGene(data);
    let alreadyAddedSingleAlignmentFile = false;

    if (multipleGene) {
        let partition: string;
        if (data.partitionFile) {
            partition = data.partitionFile;
            output.push('-s', data.alignmentFolder || alignmentFiles!.join(','));
            // alignment folder might be added - however if alignment folder is used, there would be no alignment file
            alreadyAddedSingleAlignmentFile = alignmentFiles?.length === 1;
        }
        else {
            partition = data.alignmentFolder || alignmentFiles!.join(',');
        }

        let { partitionType } = data;
        if (overwritePartitionType !== undefined) partitionType = overwritePartitionType;

        switch (partitionType) {
            case PartitionType.EdgeProportional:
                output.push('-p', partition);
                break;
            case PartitionType.EdgeEqual:
                output.push('-q', partition);
                break;
            case PartitionType.SeparateGeneTrees:
                output.push('-S', partition);
                break;
            case PartitionType.EdgeUnlinked:
                output.push('-Q', partition);
                break;
        }
    }

    if (alignmentFiles?.length === 1 && !alreadyAddedSingleAlignmentFile) {
        output.push('-s', alignmentFiles[0]);
    }

    return output;
}

export default prepare;