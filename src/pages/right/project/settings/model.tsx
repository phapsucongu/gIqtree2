import { getAutoMergePartitionCommand, getSubstitutionModelCommand } from "../../../../command/modelSetting";
import BinaryOptions from "../../../../component/binaryoptions";
import { SequenceType } from "../../../../interfaces/dataSettings";
import { AutoMergePartitions, AutoMergePartitionsAlgorithms, DefaultRateCategories, getAvailableFrequencies, ModelSettings, RHASModel, RHASModels, StateFrequency, SubstitutionModel, SubstitutionModels } from "../../../../interfaces/modelSettings";
import { DisableWrap } from "../components/opaqueWrapping";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

function Model({ settings, onChange, sequenceType, isMultipleGene }: SettingCategoryCommonProp<ModelSettings> & {
    sequenceType: SequenceType | undefined,
    isMultipleGene: boolean
}) {
    let { proportionOfInvariableSites, ascertainmentBiasCorrection, rhasModel, substitutionModel } = settings ?? {};
    let availableModels: (SubstitutionModel | undefined)[] = SubstitutionModels
        .filter(e => e.sequenceType === sequenceType || sequenceType === undefined)
        .map(e => e.models)
        .flat();
    availableModels.unshift(undefined);

    let availableFrequencies = getAvailableFrequencies(sequenceType);

    return (
        <div className="flex flex-col gap-6">
            <DisableWrap disabled={!isMultipleGene} disableText="Available for multiple genes">
                <div>
                    <b className="pb-2">
                        Auto merge partitions
                    </b>
                    {isMultipleGene && settings?.autoMergePartitions && (
                        <span className="opacity-50 ml-2">
                            (output :&nbsp;
                            <span className="font-mono">
                                {getAutoMergePartitionCommand(settings.autoMergePartitions).join(' ')}
                            </span>)
                        </span>
                    )}
                    <br />
                    <select
                        className="px-1 py-2 w-full input-bordered bg-transparent"
                        onChange={e => onChange?.({
                            ...settings,
                            autoMergePartitions: (e.target.value || undefined) as AutoMergePartitions | undefined
                        })}
                        value={settings?.autoMergePartitions}>
                        {
                            [{ name: 'None', type: '' }, ...AutoMergePartitionsAlgorithms]
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
                    Subtitution model
                </b>
                {substitutionModel && (
                    <span className="opacity-50 ml-2">
                        (output :&nbsp;
                        <span className="font-mono">
                            {getSubstitutionModelCommand(sequenceType, settings).join(' ')}
                        </span>)
                    </span>
                )}
                <br />
                <select
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    onChange={e => {
                        let value = (e.target.value || undefined) as SubstitutionModel | undefined;
                        if (value?.toString() === 'Automatic') {
                            value = undefined;
                        }
                        onChange?.({
                            ...settings,
                            substitutionModel: value
                        })
                    }}
                    value={substitutionModel}>
                    {
                        availableModels
                            .map(option => {
                                return (
                                    <option value={option}>
                                        {option ?? 'Automatic'}
                                    </option>
                                )
                            })
                    }
                </select>
            </div>
            <div>
                <b className="pb-2">
                    Allow proportion of invariable sites
                </b>
                {settings?.proportionOfInvariableSites && (
                    <span className="opacity-50 ml-2">
                        (output :&nbsp;
                        <span className="font-mono">
                            {getSubstitutionModelCommand(sequenceType, settings).join(' ')}
                        </span>)
                    </span>
                )}
                <br />
                <BinaryOptions
                    value={proportionOfInvariableSites ?? false}
                    truthyText="On"
                    falsyText="Off"
                    onChange={v => onChange?.({ ...settings, proportionOfInvariableSites: v })} />
            </div>
            <div>
                <b className="pb-2">
                    Rate heterogenity across sites
                </b>
                <br />
                <select
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        rhasModel: (e.target.value || undefined) as RHASModel | undefined
                    })}
                    value={settings?.rhasModel}>
                    {
                        [{ name: 'None', type: undefined }, ...RHASModels]
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
            <DisableWrap disabled={!substitutionModel || !rhasModel}
                         disableText="Available if substitution model is set (not auto) and RHAS is enabled">
                <div>
                    <b className="pb-2">
                        Rate categories number
                    </b>
                    <input
                        min={1}
                        step={1}
                        className="px-1 py-2 w-full input-bordered bg-transparent"
                        type="number"
                        placeholder={DefaultRateCategories.toString()}
                        onChange={e => onChange?.({
                            ...settings,
                            rateCategories: (e.target.valueAsNumber || undefined)
                        })}
                        value={settings?.rateCategories ?? DefaultRateCategories} />
                </div>
            </DisableWrap>
            <div>
                <b className="pb-2">
                    State frequency
                </b>
                {(substitutionModel && settings?.stateFrequency) && (
                    <span className="opacity-50 ml-2">
                        (output :&nbsp;
                        <span className="font-mono">
                            {getSubstitutionModelCommand(sequenceType, settings).join(' ')}
                        </span>)
                    </span>
                )}
                <br />
                <select
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        stateFrequency: (e.target.value || undefined) as StateFrequency | undefined
                    })}
                    value={settings?.stateFrequency}>
                    {
                        [{ name: 'None', type: '' }, ...availableFrequencies]
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
            <DisableWrap disableText="Only available if sequence type is DNA/Morphology"
                         disabled={!sequenceType || ![SequenceType.DNA, SequenceType.Morphology].includes(sequenceType)}>
                <div>
                    <b className="pb-2">
                        Ascertainment bias correction
                    </b>
                    {settings?.ascertainmentBiasCorrection && (
                        <span className="opacity-50 ml-2">
                            (output :&nbsp;
                            <span className="font-mono">
                                {getSubstitutionModelCommand(sequenceType, settings).join(' ')}
                            </span>)
                        </span>
                    )}
                    <br />
                    <BinaryOptions
                        value={ascertainmentBiasCorrection ?? false}
                        truthyText="On"
                        falsyText="Off"
                        onChange={v => onChange?.({ ...settings, ascertainmentBiasCorrection: v })} />
                </div>
            </DisableWrap>
        </div>
    )
}

export default Model;