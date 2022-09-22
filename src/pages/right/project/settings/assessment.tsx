import { AssessmentSettings, BootstrapMethod, BootstrapMethods } from "../../../../interfaces/assessmentSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

function Assessment({ settings, onChange } : SettingCategoryCommonProp<AssessmentSettings> & {
    isMultipleGene: boolean
}) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Bootstrap Method
                </b>
                <br />
                <select
                    className="py-1 px-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        bootstrapMethod: (e.target.value || undefined) as BootstrapMethod | undefined
                    })}
                    value={settings?.bootstrapMethod}>
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
            <div>
                <b className="pb-2">
                    Number of bootstrapping replicates
                </b>
                {/* <input
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="number"
                    onChange={e => onChange?.({
                        ...settings,
                        // re: (e.target.valueAsNumber || undefined)
                    })}
                    value={settings?.thread} /> */}
            </div>
        </div>
    )
}

export default Assessment;