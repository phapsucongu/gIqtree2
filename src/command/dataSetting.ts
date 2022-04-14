import { Settings } from "../interfaces";
import { isMultipleGene, PartitionType, SequenceType } from "../interfaces/dataSettings";

export default function ({ data }: Settings) {
    let output: string[] = [];
    switch (data.sequenceType) {
        case SequenceType.Codon:
            output.push('--seqtype', 'CODON' + data.codonType?.toString());
            break;
        case null:
            break;
        default:
            output.push('--seqtype', data.sequenceType);
            break;
    }

    let multipleGene = isMultipleGene(data);

    if (multipleGene) {
        let partition: string;
        if (data.partitionFile) {
            partition = data.partitionFile;
            output.push('-s', data.alignmentFolder || data.alignmentFiles.join(','));
        }
        else {
            partition = data.alignmentFolder || data.alignmentFiles.join(',');
        }

        switch (data.partitionType) {
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

    if (data.alignmentFiles.length) {
        // multiple gene :
        // if partition file is there, alignment files/folder must be already added.
        // if it's not there, files/folder being passed as partitions.
        // here must be single gene
        output.push('-s', data.alignmentFiles[0]);
    }

    return output;
}