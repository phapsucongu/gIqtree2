import { Settings } from "../interfaces";
import { AutoMergePartitions } from "../interfaces/modelSettings";

export default function mergePartitions() : Partial<Settings> {
    return {
        model: {
            autoMergePartitions: AutoMergePartitions.RClusterF
        }
    };
}