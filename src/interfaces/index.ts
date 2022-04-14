import { DataSettings, PartitionType } from "./dataSettings";

export interface Settings {
    name?: string;
    data: DataSettings;
}

export function defaultSettings() : Settings {
    return {
        data: {
            codonType: null,
            sequenceType: null,
            partitionType: PartitionType.EdgeProportional,
            alignmentFiles: [],
            alignmentFolder: null,
            partitionFile: null
        }
    }
}