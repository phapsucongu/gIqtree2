import { AssessmentSettings } from "./assessmentSettings";
import { DataSettings } from "./dataSettings";
import { DatingSettings } from "./datingSettings";
import { ModelSettings } from "./modelSettings";
import { OthersSettings } from "./othersSettings";
import { TreeSearchSettings } from "./treeSearchSettings";

export interface Settings {
    name?: string;
    data: DataSettings;
    treeSearch: TreeSearchSettings;
    assessment: AssessmentSettings;
    others?: OthersSettings;
    model?: ModelSettings;
    dating: DatingSettings;

    lastPath?: string;
}