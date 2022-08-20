import { AssessmentSettings } from "../../../../interfaces/assessmentSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

export default ({ settings, onChange } : SettingCategoryCommonProp<AssessmentSettings> & {
    isMultipleGene: boolean
}) => <>assessment</>