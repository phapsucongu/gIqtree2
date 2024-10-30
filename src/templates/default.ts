
import { Settings } from "../interfaces";
import { PartitionType } from "../interfaces/settings/dataSettings";
// import { AutoMergePartitions } from "../interfaces/modelSettings";

function defaultSettings(): Settings {
    return {
        data: {
            partitionType: PartitionType.EdgeProportional
        },
        treeSearch: {},
        assessment: {},
        dating: {},
        model: {
            // autoMergePartitions: AutoMergePartitions.RClusterF
        }
    }
}

export default defaultSettings;