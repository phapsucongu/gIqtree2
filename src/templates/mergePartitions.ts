import { Settings } from "../interfaces";
import { AutoMergePartitions } from "../interfaces/settings/modelSettings";

export default function mergePartitions() : Partial<Settings> {
    return {
        model: {
            autoMergePartitions: AutoMergePartitions.RClusterF
        }
    };
}