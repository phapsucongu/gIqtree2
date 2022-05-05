import { useState } from "react";
import { DataSettings, SequenceTypes, Codons, SequenceType, PartitionTypes, isMultipleGene } from "../../../interfaces/dataSettings";
import './data.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFolder, faFolderOpen, faFile, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { dialog } from "@electron/remote";
import { useWindow } from "../../../hooks/useWindow";
import SettingRowFile from "../../../components/settingrowfile";
import SettingRowMultipleChoice from "../../../components/settingrowmultiplechoice";

function Data({ settings, onChange }: { settings: DataSettings, onChange?: (newSetting: DataSettings) => void }) {
    let window = useWindow();
    let [codonSettingOpen, setCodonSettingOpen] = useState(false);
    let codon = Codons.find(codon => codon.type === settings.codonType);
    let { partitionFile, alignmentFiles, alignmentFolder, sequenceType, partitionType } = settings;
    let multipleGenes = isMultipleGene(settings);

    return (
        <div>
            <SettingRowMultipleChoice
                label="Sequence type :"
                options={
                    [{ name: 'Auto-detect', type: undefined }, ...SequenceTypes]
                        .map(e => ({ name: e.name, value: e.type }))
                }
                value={[sequenceType]}
                onChosen={(value) => {
                    onChange?.({
                        ...settings,
                        sequenceType: value
                    });
                    setCodonSettingOpen(value === SequenceType.Codon && codonSettingOpen)
                }}
                />

            {sequenceType === SequenceType.Codon && (
                <>
                    <div className="setting-row">
                        <b>Codon type :</b>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="font-bold">
                                {codon && <><span className="text-red-700">{codon.type}</span> -</>} {codon?.name ?? ''}
                            </div>
                            <button
                                className="action-button"
                                onClick={() => setCodonSettingOpen(!codonSettingOpen)}>
                                <FontAwesomeIcon icon={codonSettingOpen ? faClose : faPenToSquare} className="pr-2" />
                                {codonSettingOpen ? 'Close' : (codon ? 'Change' : 'Choose one')}
                            </button>
                        </div>
                    </div>
                    {codonSettingOpen && (
                        <div className="grid grid-cols-12 gap-4">
                            {Codons.map((current, index) => (
                                <button
                                    onClick={() => {
                                        onChange?.({ ...settings, codonType: current.type });
                                        setCodonSettingOpen(false);
                                    }}
                                    className={
                                        "border border-black py-2 rounded "
                                        + "hover:bg-pink-600 hover:text-white hover:border-pink-900 "
                                        + "active:bg-pink-800 "
                                        + (index % 2 ? 'col-span-7' : 'col-span-5')}>
                                    {current.name}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
            <div className="setting-row">
                <b>Alignment file/folders :</b>
                <div className="flex flex-row justify-end">
                    <button
                        disabled={!!alignmentFolder}
                        className="multiple-option-button border-l rounded-l-full"
                        onClick={() => {
                            if (!window) return;

                            let file = dialog.showOpenDialogSync(window, {
                                title: 'Choose an alignment file', properties: ['openFile']
                            });

                            if (file)
                                onChange?.({ ...settings, alignmentFiles: [...new Set([...(alignmentFiles ?? []), ...file])] })
                        }}>
                        <FontAwesomeIcon icon={faFile} className="pr-2" />
                        Add file(s)
                    </button>
                    <button
                        disabled={!!(alignmentFiles?.length || alignmentFolder)}
                        className="multiple-option-button rounded-r-full"
                        onClick={() => {
                            if (!window) return;

                            let file = dialog.showOpenDialogSync(window, {
                                title: 'Choose an alignment folder', properties: ['openDirectory']
                            });

                            if (file)
                                onChange?.({ ...settings, alignmentFolder: file[0] })
                        }}>
                        <FontAwesomeIcon icon={faFolderOpen} className="pr-2" />
                        Add folder
                    </button>
                </div>
            </div>
            {!!(alignmentFolder || alignmentFiles?.length) && (
                <div className="setting-row">
                    <div>{'\u00a0'.repeat(48)}</div>
                    <div className="grow">
                        {(alignmentFiles ?? []).map((file, index) => (
                            <div className="alignment-input-row">
                                <div className="flex flex-row items-center">
                                    <FontAwesomeIcon icon={faFile} className="alignment-input-row-icon" />
                                    {file}
                                </div>
                                <button
                                    className="alignment-input-remove"
                                    onClick={() => {
                                        let files = [...(alignmentFiles ?? [])];
                                        files.splice(index, 1);
                                        onChange?.({ ...settings, alignmentFiles: [...new Set(files)] })
                                    }}>
                                    <FontAwesomeIcon icon={faTrashCan} className="pr-2" />
                                    Remove
                                </button>
                            </div>
                        ))}
                        {alignmentFolder && (
                            <div className="alignment-input-row">
                                <div className="flex flex-row items-center">
                                    <FontAwesomeIcon icon={faFolder} className="alignment-input-row-icon" />
                                    {alignmentFolder}
                                </div>
                                <button
                                    className="alignment-input-remove"
                                    onClick={() => {
                                        onChange?.({ ...settings, alignmentFolder: undefined })
                                    }}>
                                    <FontAwesomeIcon icon={faTrashCan} className="pr-2" />
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <SettingRowFile
                name="Partition file"
                file={partitionFile}
                onChange={file => onChange?.({ ...settings, partitionFile: file })}
                />

            {multipleGenes && (
                <SettingRowMultipleChoice
                    options={PartitionTypes.map(e => ({ name: e.name, value: e.type }))}
                    onChosen={value => onChange?.({
                        ...settings,
                        partitionType: value
                    })}
                    label="Partition type :"
                    value={[partitionType]}
                    />
            )}
        </div>
    )
}

export default Data;