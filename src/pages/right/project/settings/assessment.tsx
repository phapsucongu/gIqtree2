import BinaryOptions from "../../../../component/binaryoptions";
import SettingRowFile from "../../../../component/settingrowfile";
import { AssessmentSettings, BootstrapMethod, BootstrapMethods, DefaultBootstrapMethodReplicate } from "../../../../interfaces/assessmentSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

function Assessment({ settings, onChange } : SettingCategoryCommonProp<AssessmentSettings> & {
    isMultipleGene: boolean
}) {
    let { gcf, scf } = settings ?? {};
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
                <input
                    className="py-1 px-2 w-full input-bordered bg-transparent"
                    type="number"
                    onChange={e => onChange?.({
                        ...settings,
                        bootstrapMethodReplicate: (e.target.valueAsNumber || undefined)
                    })}
                    value={settings?.bootstrapMethodReplicate ?? DefaultBootstrapMethodReplicate} />
            </div>
            <div>
                <b className="pb-2">
                    Enable gCF
                </b>
                <br />
                <BinaryOptions
                    value={gcf?.enabled ?? false}
                    truthyText="On"
                    falsyText="Off"
                    onChange={v => onChange?.({ ...settings, gcf: { ...gcf, enabled: v } })} />
            </div>
            <div>
                <b className="pb-2">
                    sCF quartet number (0 to disable sCF)
                </b>
                <input
                    min={0}
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="number"
                    onChange={e => onChange?.({
                        ...settings,
                        scf: { ...scf, quartet: e.target.valueAsNumber || undefined }
                    })}
                    value={scf?.quartet ?? 0} />
            </div>
            <div>
                <b className="pb-2">
                    Gene tree (leave empty to generate)
                </b>
                <SettingRowFile
                    isFile
                    name="Gene tree (leave empty to generate)"
                    file={gcf?.geneTree}
                    onChange={file => onChange?.({ ...settings, gcf: { ...gcf, geneTree: file || undefined } })} />
            </div>
        </div>
    )
}

export default Assessment;