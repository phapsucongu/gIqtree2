import { useState } from "react";
import { DataSettings, SequenceTypes, Codons, SequenceType, PartitionTypes, isMultipleGene } from "../../../interfaces/dataSettings";
import './data.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faFolder, faFolderOpen, faFile, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { dialog } from "@electron/remote";
import { useWindow } from "../../../hooks/useWindow";

export default ({ settings, onChange }: { settings: DataSettings, onChange?: (newSetting: DataSettings) => void }) => {
    let window = useWindow();
    let [codonSettingOpen, setCodonSettingOpen] = useState(false);
    let codon = Codons.find(codon => codon.type === settings.codonType);
    let { partitionFile, alignmentFiles, alignmentFolder, sequenceType, partitionType } = settings;
    let multipleGenes = isMultipleGene(settings);

    const changePartitionFileCallback = () => {
        if (!window) return;

        let file = dialog.showOpenDialogSync(window, {
            title: 'Choose a partition file', properties: ['openFile']
        });

        if (file)
            onChange?.({ ...settings, partitionFile: file[0] });
    }

    return (
        <div>
            <div className="setting-row">
                <b>Sequence type :</b>
                <div className="flex flex-row">
                    {[{ name: 'Auto-detect', type: null }, ...SequenceTypes]
                        .map((current, index) => {
                            let rounded = '';
                            if (index === 0) rounded = 'border-l rounded-l-full';
                            if (index === SequenceTypes.length) rounded = 'rounded-r-full';

                            let chosen = sequenceType === current.type
                                ? 'bg-gray-700 border-gray-700 text-white font-bold'
                                : 'border-black';
                            return (
                                <button
                                    onClick={() => {
                                        onChange?.({
                                            ...settings,
                                            sequenceType: current.type
                                        });
                                        setCodonSettingOpen(current.type === SequenceType.Codon && codonSettingOpen)
                                    }}
                                    className={"py-2 px-4 border-r border-y hover:bg-gray-200 hover:text-black " + rounded + ' ' + chosen}>
                                    {current.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
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
                                onChange?.({ ...settings, alignmentFiles: [...new Set([...alignmentFiles, ...file])] })
                        }}>
                        <FontAwesomeIcon icon={faFile} className="pr-2" />
                        Add file(s)
                    </button>
                    <button
                        disabled={!!(alignmentFiles.length || alignmentFolder)}
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
            {!!(alignmentFolder || alignmentFiles.length) && (
                <div className="setting-row">
                    <div>{'\u00a0'.repeat(48)}</div>
                    <div className="grow">
                        {alignmentFiles.map((file, index) => (
                            <div className="alignment-input-row">
                                <div className="flex flex-row items-center">
                                    <FontAwesomeIcon icon={faFile} className="alignment-input-row-icon" />
                                    {file}
                                </div>
                                <button
                                    className="alignment-input-remove"
                                    onClick={() => {
                                        let files = [...alignmentFiles];
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
                                        onChange?.({ ...settings, alignmentFolder: null })
                                    }}>
                                    <FontAwesomeIcon icon={faTrashCan} className="pr-2" />
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="setting-row">
                <b>Partition file :</b>
                <div className="flex flex-row justify-end items-center">
                    <div className="font-bold pr-2">
                        {partitionFile}
                    </div>
                    {!partitionFile && (
                        <button className="action-button" onClick={changePartitionFileCallback}>
                            <FontAwesomeIcon icon={faPenToSquare} className="pr-2" />
                            Add
                        </button>
                    )}
                    {partitionFile && (
                        <>
                            <button className="multiple-option-button border-l rounded-l-full" onClick={changePartitionFileCallback}>
                                <FontAwesomeIcon icon={faPenToSquare} className="pr-2" />
                                Change
                            </button>
                            <button
                                className="multiple-option-button rounded-r-full"
                                onChange={() => onChange?.({ ...settings, partitionFile: null })}>
                                <FontAwesomeIcon icon={faTrashCan} className="pr-2" />
                                Remove
                            </button>
                        </>
                    )}
                </div>
            </div>
            {multipleGenes && (
                <div className="setting-row">
                    <b>Partition type :</b>
                    <div className="flex flex-row">
                        {PartitionTypes.map((current, index) => {
                            let rounded = '';
                            if (index === 0) rounded = 'border-l rounded-l-full';
                            if (index === PartitionTypes.length - 1) rounded = 'rounded-r-full';

                            let chosen = partitionType === current.type
                                ? 'bg-gray-700 border-gray-700 text-white font-bold'
                                : 'border-black';
                            return (
                                <button
                                    onClick={() => {
                                        onChange?.({
                                            ...settings,
                                            partitionType: current.type
                                        });
                                    }}
                                    className={"py-2 px-4 border-r border-y hover:bg-gray-200 hover:text-black " + rounded + ' ' + chosen}>
                                    {current.name}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}