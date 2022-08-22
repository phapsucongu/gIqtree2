import { SequenceType } from "../../../../interfaces/dataSettings";
import { ModelSettings } from "../../../../interfaces/modelSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

function Model({ settings, onChange, sequenceType, isMultipleGene } : SettingCategoryCommonProp<ModelSettings> & {
    sequenceType: SequenceType | undefined,
    isMultipleGene: boolean
}) {
    return (<>model</>)
}

export default Model;