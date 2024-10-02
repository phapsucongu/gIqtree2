import { Settings } from "../interfaces";
import { isMultipleGene, PartitionType, SequenceType } from "../interfaces/dataSettings";
import fs from 'fs';
import path from 'path';

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

    //console.log(data.alignmentFiles);
    //console.log(data.partitionFile);
    //console.log(data.alignmentFolder);
    if (isMultipleGene(data) && data.alignmentFolder && data.alignmentFiles === undefined) {
        const folderPath = data.alignmentFolder;
        try {
            const files = fs.readdirSync(folderPath); 
            data.alignmentFiles = files.map(file => path.join(folderPath, file));
        } catch (error) {
            console.error(`Lỗi khi truy cập thư mục: ${error}`);
        }
    }
    
    data.alignmentFiles = data.alignmentFiles ?? [];

    if(isMultipleGene(data)&& (data.alignmentFiles.length>1) && data.partitionFile){
        let partitionContent = fs.readFileSync(data.partitionFile, 'utf-8');
        const charsetRegex = /(charset\s+[\w.]+\s*=\s*)[^;]+(;)/g;
        let i = 0;

        partitionContent = partitionContent.replace(charsetRegex, (match, prefix, suffix) => {
            if (data.alignmentFiles && i < data.alignmentFiles.length) {
                const newCharsetLine = `${prefix}${data.alignmentFiles[i]}: ${suffix}`;
                //console.log(newCharsetLine);
                i++;
                return newCharsetLine;
            }
            return match;
        });
        
        

        fs.writeFileSync(data.partitionFile, partitionContent, 'utf-8');
        //console.log(data.partitionFile);
        //console.log("Đã cập nhật partitionFile thành công.");
    }

    //console.log(data.alignmentFiles);
    let { alignmentFiles } = data;
    let multipleGene = isMultipleGene(data);
    let alreadyAddedSingleAlignmentFile = false;

    if (multipleGene) {
        let partition: string;
        if (data.partitionFile) {
            partition = data.partitionFile;
            output.push('-s', data.alignmentFolder || data.alignmentFiles!.join(','));
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