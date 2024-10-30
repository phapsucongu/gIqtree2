import { Settings } from "../interfaces";
import { PartitionType } from "../interfaces/settings/dataSettings";

export default function findModel() : Partial<Settings> {
    return {
        data: {
            partitionType: PartitionType.SeparateGeneTrees
        },
        model: {
            substitutionModel: undefined,
            autoMergePartitions: undefined
        },
    }
}