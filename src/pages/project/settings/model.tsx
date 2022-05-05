import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import SettingRowMultipleChoice from "../../../components/settingrowmultiplechoice";
import { SequenceType } from "../../../interfaces/dataSettings";
import { AutoMergePartitionsAlgorithms, DefaultRateCategories, getAvailableFrequencies, ModelSettings, SubstitutionModel, SubstitutionModels } from "../../../interfaces/modelSettings";

function Model(
    { isMultipleGene, sequenceType, settings, onChange }:
        { isMultipleGene: boolean, sequenceType?: SequenceType, settings?: ModelSettings, onChange?: (newSettings: ModelSettings) => void }
) {
    let { autoMergePartitions, substitutionModel, rhasModel, proportionOfInvariableSites, stateFrequency, ascertainmentBiasCorrection } = settings ?? {};
    let [subtitutionModelSettingOpen, setSubtitutionModelSettingOpen] = useState(false);

    let availableModels: (SubstitutionModel | undefined)[] = SubstitutionModels
        .filter(e => e.sequenceType === sequenceType || sequenceType === undefined)
        .map(e => e.models)
        .flat();
    availableModels.unshift(undefined);

    let availableFrequencies = getAvailableFrequencies(sequenceType);

    return (
        <div>
            {isMultipleGene && (
                <SettingRowMultipleChoice
                    options={
                        [{ name: 'None', type: undefined }, ...AutoMergePartitionsAlgorithms]
                            .map(e => ({ name: e.name, value: e.type }))
                    }
                    value={[autoMergePartitions]}
                    label="Auto merge partitions :"
                    onChosen={value => onChange?.({ ...settings, autoMergePartitions: value })} />
            )}
            <div className="setting-row">
                <b>Subtitution model :</b>
                <div className="flex flex-row gap-2 items-center">
                    <div className="font-bold">
                        {substitutionModel ?? 'Automatic'}
                    </div>
                    <button
                        className="action-button"
                        onClick={() => setSubtitutionModelSettingOpen(!subtitutionModelSettingOpen)}>
                        <FontAwesomeIcon icon={subtitutionModelSettingOpen ? faClose : faPenToSquare} className="pr-2" />
                        {subtitutionModelSettingOpen ? 'Close' : (substitutionModel ? 'Change' : 'Choose one')}
                    </button>
                </div>
            </div>
            {subtitutionModelSettingOpen && (
                <div className="grid grid-cols-12 gap-4 pb-4">
                    {availableModels.map((current, index) => (
                        <button
                            onClick={() => {
                                onChange?.({ ...settings, substitutionModel: current });
                                setSubtitutionModelSettingOpen(false);
                            }}
                            className={
                                "border border-black py-2 rounded "
                                + "hover:bg-pink-600 hover:text-white hover:border-pink-900 "
                                + "active:bg-pink-800 "
                                + 'col-span-1'}>
                            {current ?? 'Automatic'}
                        </button>
                    ))}
                </div>
            )}


            <div className="setting-row">
                <b>Allow proportion of invariable sites</b>
                <button
                    className="action-button"
                    onClick={() => onChange?.({ ...settings, proportionOfInvariableSites: !proportionOfInvariableSites })}>
                    {proportionOfInvariableSites ? 'Enabled' : 'Disabled'}
                </button>
            </div>

            {rhasModel && (
                <div className="setting-row">
                    <b>Rate categories number :</b>
                    <input
                        className="border-2 p-2 rounded-lg basis-1/2"
                        type="number"
                        min={1}
                        step={1}
                        placeholder={DefaultRateCategories.toString()}
                        value={settings?.rateCategories || DefaultRateCategories}
                        onChange={e => onChange?.({ ...settings, rateCategories: e.target.valueAsNumber })} />
                </div>
            )}

            <SettingRowMultipleChoice
                label="State frequency"
                options={
                    [{ name: 'None', type: undefined }, ...availableFrequencies]
                        .map(e => ({ name: e.name, value: e.type }))
                }
                onChosen={value => onChange?.({ ...settings, stateFrequency: value })}
                value={[stateFrequency]}
            />

            <div className="setting-row">
                <b>Ascertainment bias correction</b>
                <button
                    className="action-button"
                    onClick={() => onChange?.({ ...settings, ascertainmentBiasCorrection: !ascertainmentBiasCorrection })}>
                    {ascertainmentBiasCorrection ? 'Enabled' : 'Disabled'}
                </button>
            </div>
        </div>
    )
}

export default Model;