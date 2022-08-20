import { AssessmentSettings, BootstrapMethod, BootstrapMethods } from "../../../../interfaces/assessmentSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

export default ({ settings, onChange } : SettingCategoryCommonProp<AssessmentSettings> & {
    isMultipleGene: boolean
}) => {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Bootstrap Method
                </b>
                <br />
                <select
                    className="p-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        bootstrapMethod: (e.target.value || undefined) as BootstrapMethod | undefined
                    })}>
                    {
                        [{ name: 'None', type: undefined }, ...BootstrapMethods]
                            .map(option => {
                                return (
                                    <option value={option.type}>
                                        {option.name}
                                    </option>
                                )
                            })
                    }
                </select>
            </div>
        </div>
    )
}