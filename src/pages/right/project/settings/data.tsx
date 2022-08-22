import { Codon, Codons, DataSettings, isMultipleGene, PartitionType, PartitionTypes, SequenceType, SequenceTypes } from "../../../../interfaces/dataSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";
import SettingRowFile from "../../../../component/settingrowfile";

function DataSetting({ settings, onChange }: SettingCategoryCommonProp<DataSettings>) {
    let multipleGenes = isMultipleGene(settings || {});
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Sequence Type
                </b>
                <br />
                <select
                    className="p-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        sequenceType: (e.target.value || undefined) as SequenceType | undefined
                    })}
                    value={settings?.sequenceType}>
                    {
                        [{ name: 'Auto-detect', type: undefined }, ...SequenceTypes]
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
            {settings?.sequenceType === SequenceType.Codon && (
                <div>
                    <b className="pb-2">
                        Codon Type
                    </b>
                    <select
                        className="p-2 w-full input-bordered bg-transparent"
                        onChange={e => onChange?.({
                            ...settings,
                            codonType: (+e.target.value || undefined) as Codon | undefined
                        })}
                        value={settings?.codonType}>
                        {
                            Codons
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
            )}
            <div>
                <b className="pb-2">
                    Alignment file
                </b>
                <SettingRowFile
                    isFile
                    name="Alignment file/folder"
                    file={settings?.alignmentFiles?.[0]}
                    onChange={file => onChange?.({ ...settings, alignmentFiles: file ? [file] : undefined })}
                    />
            </div>
            <div>
                <b className="pb-2">
                    Partition file
                </b>
                <SettingRowFile
                    isFile
                    name="Partition file"
                    file={settings?.partitionFile}
                    onChange={file => onChange?.({ ...settings, partitionFile: file })}
                    />
            </div>
            {!multipleGenes && (
                <div>
                    <b className="pb-2">
                        Partition Type
                    </b>
                    <select
                        className="p-2 w-full input-bordered bg-transparent"
                        onChange={e => onChange?.({
                            ...settings,
                            partitionType: (e.target.value || undefined) as PartitionType | undefined
                        })}
                        value={settings?.partitionType}>
                        {
                            PartitionTypes
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
            )}
        </div>
    )
}

export default DataSetting;