import BinaryOptions from "../../../../component/binaryoptions";
import SettingRowFile from "../../../../component/settingrowfile";
import { AssessmentSettings, BootstrapMethod, BootstrapMethods, DefaultALRTReplicate, DefaultBootstrapMethodReplicate, DefaultLocalBootstrapReplicate, DefaultMultiPartitionSamplingStrategy, MultiPartitionSamplingStrategies, MultiPartitionSamplingStrategy, SingleBranchTest, SingleBranchTests } from "../../../../interfaces/settings/assessmentSettings";
import { DisableWrap } from "../components/opaqueWrapping";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

function Assessment({ settings, isMultipleGene, onChange } : SettingCategoryCommonProp<AssessmentSettings> & {
    isMultipleGene: boolean
}) {
    let {
        gcf, scf, bootstrapMethod, ufbootOption,
        multiPartitionSamplingStrategy, singleBranchTests,
        approximateLikelihoodReplicate, localBootstrapReplicate
    } = settings ?? {};
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Bootstrap method
                </b>
                <br />
                <select
                    className="py-1 px-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        bootstrapMethod: (e.target.value || undefined) as BootstrapMethod | undefined
                    })}
                    value={bootstrapMethod}>
                    {
                        [{ name: 'None', type: '' }, ...BootstrapMethods]
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
            <DisableWrap disabled={!bootstrapMethod} disableText="Available if bootstrapping is used">
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
            </DisableWrap>
            <DisableWrap disabled={bootstrapMethod !== BootstrapMethod.UltraFastBootstrap}
                         disableText="Available only for UFBoot bootstrapping method">
                <div>
                    <b className="pb-2">
                        UFBoot option for reducing impact of severe model violation
                    </b>
                    <br />
                    <BinaryOptions
                        value={ufbootOption ?? false}
                        truthyText="On"
                        falsyText="Off"
                        onChange={v => onChange?.({ ...settings, ufbootOption: v })} />
                </div>
            </DisableWrap>
            <DisableWrap disabled={!isMultipleGene} disableText="Available for multiple genes">
                <div>
                    <b className="pb-2">
                        Multi-partition sampling strategy :
                    </b>
                    <br />
                    <select
                        className="py-1 px-2 w-full input-bordered bg-transparent"
                        onChange={e => onChange?.({
                            ...settings,
                            multiPartitionSamplingStrategy: (e.target.value || undefined) as MultiPartitionSamplingStrategy | undefined
                        })}
                        value={multiPartitionSamplingStrategy ?? DefaultMultiPartitionSamplingStrategy}>
                        {
                            MultiPartitionSamplingStrategies
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
            </DisableWrap>
            <div>
                <b className="pb-2">
                    Single branch tests
                </b>
                <div className="flex flex-col gap-4">
                    {/* render groups separately */}
                    {SingleBranchTests
                        .filter(group => group.length > 1)
                        .map((group, index) => {
                            let groupWithDisable = [{ name: 'Disabled', type: undefined }, ...group];
                            return (
                                <div className="grid grid-cols-3">
                                    {groupWithDisable.map(g => {
                                        let isDisableEntry = !g.type;
                                        let checked = g.type
                                            ? singleBranchTests?.includes(g.type)
                                            : group.every(entry => !singleBranchTests?.includes(entry.type));

                                        return (
                                            <div className="flex flex-row gap-4 items-center">
                                                <input
                                                    type="radio"
                                                    value={g.type}
                                                    name={"group_" + index}
                                                    checked={checked}
                                                    onChange={event => {
                                                        let type = event.target.value as SingleBranchTest;
                                                        let set = new Set(singleBranchTests);
                                                        for (let entry of group) {
                                                            set.delete(entry.type);
                                                        }
                                                        if (!isDisableEntry) set.add(type);
                                                        onChange?.({ ...settings, singleBranchTests: [...set] })
                                                    }}/>
                                                <label htmlFor={"single_branch_test_" + g.type}>
                                                    {g.name}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    <div className="grid grid-cols-3">
                        {SingleBranchTests
                            .filter(group => group.length === 1)
                            .map(g => {
                                let entry = g[0];
                                let checked = singleBranchTests?.includes(entry.type);
                                return (
                                    <div className="flex flex-row gap-4 items-center">
                                        <input
                                            type="checkbox"
                                            value={entry.type}
                                            checked={checked}
                                            onChange={() => {
                                                let set = new Set(singleBranchTests);
                                                set[checked ? 'delete' : 'add'](entry.type);
                                                onChange?.({ ...settings, singleBranchTests: [...set] })
                                            }}
                                            />
                                        <label htmlFor={"single_branch_test_" + entry.type}>
                                            {entry.name}
                                        </label>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
            <DisableWrap disabled={!singleBranchTests?.includes(SingleBranchTest.SH_aLRT)}
                         disableText="Available if SH-like aLRT test is used">
                <div>
                    <b className="pb-2">
                        Number of aLRT replicates
                    </b>
                    <input
                        min={1}
                        step={1}
                        className="px-1 py-2 w-full input-bordered bg-transparent"
                        type="number"
                        placeholder={DefaultALRTReplicate.toString()}
                        onChange={e => onChange?.({
                            ...settings,
                            approximateLikelihoodReplicate: e.target.valueAsNumber
                        })}
                        value={approximateLikelihoodReplicate ?? DefaultALRTReplicate} />
                </div>
            </DisableWrap>
            <DisableWrap disabled={!singleBranchTests?.includes(SingleBranchTest.LocalBootstrap)}
                         disableText="Available if local bootstrap test is enabled">
                <div>
                    <b className="pb-2">
                        Number of local-bootstrap-test replicates
                    </b>
                    <input
                        min={1}
                        step={1}
                        className="px-1 py-2 w-full input-bordered bg-transparent"
                        type="number"
                        placeholder={DefaultLocalBootstrapReplicate.toString()}
                        onChange={e => onChange?.({
                            ...settings,
                            localBootstrapReplicate: e.target.valueAsNumber
                        })}
                        value={localBootstrapReplicate ?? DefaultLocalBootstrapReplicate} />
                </div>
            </DisableWrap>
            <DisableWrap disabled={isMultipleGene} disableText="Not Available for multiple genes">
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
            </DisableWrap>
            <DisableWrap disabled={isMultipleGene} disableText="Not Available for multiple genes">
            <div>
                <b className="pb-2">
                    sCF quartet number (0 to disable sCF)
                </b>
                <input
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="number"
                    onChange={e => {
                        let quartet = e.target.valueAsNumber || undefined;
                        if (typeof quartet === 'number' && quartet < 0) {
                            quartet = undefined;
                        }
                        onChange?.({
                            ...settings,
                            scf: { ...scf, quartet }
                        })
                    }}
                    value={scf?.quartet ?? undefined} />
            </div>
            </DisableWrap>
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