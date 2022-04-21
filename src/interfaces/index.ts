import { AssessmentSettings } from "./assessmentSettings";
import { DataSettings, PartitionType } from "./dataSettings";
import { TreeSearchSettings } from "./treeSearchSettings";

export interface Settings {
    name?: string;
    data: DataSettings;
    treeSearch: TreeSearchSettings;
    assessment: AssessmentSettings;
}

export function defaultSettings(): Settings {
    return {
        data: {
            codonType: null,
            sequenceType: null,
            partitionType: PartitionType.EdgeProportional,
            alignmentFiles: [],
            alignmentFolder: null,
            partitionFile: null
        },
        treeSearch: {
            enabled: false,
            unsuccessfulIterationsStop: null,
            pertubationStrength: null,
            outgroupTaxa: null,
            constrainedTreeFile: null,
            referenceTreeFile: null,
        },
        assessment: {
            ufbootOption: true,
            bootstrapMethod: null,
            bootstrapMethodReplicate: null,
            multiPartitionSamplingStrategy: null,
            singleBranchTests: null,
            approximateLikelihoodReplicate: null,
            localBootstrapReplicate: null
        }
    }
}