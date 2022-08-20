import { SequenceType } from "../../../../interfaces/dataSettings";
import { ModelSettings } from "../../../../interfaces/modelSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

export default ({ settings, onChange, sequenceType, isMultipleGene } : SettingCategoryCommonProp<ModelSettings> & {
    sequenceType: SequenceType | undefined,
    isMultipleGene: boolean
}) => <>model</>