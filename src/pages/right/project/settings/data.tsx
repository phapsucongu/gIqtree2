import { Codon, Codons, DataSettings, isMultipleGene, PartitionType, PartitionTypes, SequenceType, SequenceTypes } from "../../../../interfaces/dataSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";
import SettingRowFile from "../../../../component/settingrowfile";
import { MinusLogo, PlusLogo } from "../../../../icons";
import { DisableWrap } from "../components/opaqueWrapping";
import { useState } from "react";

function DataSetting({ settings, onChange }: SettingCategoryCommonProp<DataSettings>) {
    let multipleGenes = isMultipleGene(settings || {});
    let { alignmentFiles, alignmentFolder } = settings || {};
    if (alignmentFiles) {
        if (!alignmentFiles.filter(Boolean).length) {
            alignmentFiles = undefined;
        }
    }

    let [isFolder, setIsFolder] = useState(!!alignmentFolder);
    // useEffect(() => {
    //     setIsFolder(!!alignmentFolder);
    // }, [settings])

    let isFile = !isFolder;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Sequence type
                </b>
                <br />
                <select
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    onChange={e => {
                        onChange?.({
                            ...settings,
                            sequenceType: (e.target.value || undefined) as SequenceType | undefined
                        })
                    }}
                    value={settings?.sequenceType}>
                    {
                        [{ name: 'Auto-detect', type: '' }, ...SequenceTypes]
                            .map(option => {
                                return (
                                    <option value={option.type} key={option.name}>
                                        {option.name}
                                    </option>
                                )
                            })
                    }
                </select>
            </div>
            <DisableWrap disabled={settings?.sequenceType !== SequenceType.Codon}
                         disableText="Available if sequence type is Codon">
                <div>
                    <b className="pb-2">
                        Codon type
                    </b>
                    <select
                        className="px-1 py-2 w-full input-bordered bg-transparent"
                        onChange={e => onChange?.({
                            ...settings,
                            codonType: (+e.target.value || undefined) as Codon | undefined
                        })}
                        value={settings?.codonType}>
                        {
                            Codons
                                .map(option => {
                                    return (
                                        <option value={option.type} key={option.name}>
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
                    Alignment&nbsp;&nbsp;
                    <select className="font-bold"
                        value={isFolder ? 'folder' : 'file'}
                        onChange={e => {
                            switch (e.target.value) {
                                case 'file':
                                    if (settings?.alignmentFolder) {
                                        if (window.confirm('Remove configured alignment folder? (This will not delete anything.)')) {
                                            onChange?.({ ...settings, alignmentFolder: undefined });
                                        }
                                        else
                                        {
                                            e.target.value = 'folder';
                                            e.preventDefault();
                                            e.stopPropagation();
                                            return;
                                        }
                                    }
                                    setIsFolder(false);
                                    break;
                                case 'folder':
                                    if (settings?.alignmentFiles?.length) {
                                        if (window.confirm('Remove configured alignment file(s)? (This will not delete anything.)')) {
                                            onChange?.({ ...settings, alignmentFiles: undefined });
                                        }
                                        else
                                        {
                                            e.target.value = 'file';
                                            e.preventDefault();
                                            e.stopPropagation();
                                            return;
                                        }
                                    }

                                    setIsFolder(true);
                                    break;
                            }
                        }}>
                        <option value={'file'}>
                            file
                        </option>
                        <option value={'folder'}>
                            folder
                        </option>
                    </select>
                </b>
                <div className="flex flex-col gap-2">
                    {((isFile ? alignmentFiles : [alignmentFolder]) ?? [undefined])
                        .map((file, index) => {
                            return (
                                <div className="flex flex-row items-center gap-2" key={(file ?? '') + index}>
                                    <SettingRowFile
                                        isFile={isFile}
                                        name="Choose a location"
                                        file={file}
                                        onChange={file => {
                                            if (isFile) {
                                                let newFiles = [...(settings?.alignmentFiles ?? [])];
                                                newFiles[index] = file;
                                                onChange?.({ ...settings, alignmentFiles: newFiles?.length ? newFiles : undefined })
                                            } else {
                                                onChange?.({ ...settings, alignmentFolder: file ? file : undefined })
                                            }
                                        }}
                                        />
                                    {((settings?.alignmentFiles?.length ?? 0) > 1) && (isFile) && (
                                        <div className={index ? '' : 'invisible pointer-events-none'}>
                                            <button
                                                className="bg-pink-600 p-1 rounded-md"
                                                onClick={() => {
                                                    let newFiles = [...(settings?.alignmentFiles ?? [])];
                                                    newFiles.splice(index, 1);
                                                    onChange?.({ ...settings, alignmentFiles: newFiles })
                                                }}>
                                                <div className="h-6 w-6 mr-px">
                                                    <MinusLogo />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                    {isFile && (
                                        <div>
                                            <button
                                                className="bg-pink-600 p-1 rounded-md"
                                                onClick={() => {
                                                    let newFiles = [...(settings?.alignmentFiles ?? [])];
                                                    newFiles.splice(index + 1, 0, '');
                                                    onChange?.({ ...settings, alignmentFiles: newFiles })
                                                }}>
                                                <div className="h-6 w-6 mr-px">
                                                    <PlusLogo />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div>
                <b className="pb-2">
                    Partition file
                </b>
                <SettingRowFile
                    isFile
                    name="Choose a location"
                    file={settings?.partitionFile}
                    onChange={file => onChange?.({ ...settings, partitionFile: file })}
                    />
            </div>
            <DisableWrap disabled={!multipleGenes} disableText="Available for multiple genes">
                <div>
                    <b className="pb-2">
                        Partition type
                    </b>
                    <select
                        className="px-1 py-2 w-full input-bordered bg-transparent"
                        onChange={e => onChange?.({
                            ...settings,
                            partitionType: (e.target.value || undefined) as PartitionType | undefined
                        })}
                        value={settings?.partitionType}>
                        {
                            PartitionTypes
                                .map(option => {
                                    return (
                                        <option value={option.type} key={option.name}>
                                            {option.name}
                                        </option>
                                    )
                                })
                        }
                    </select>
                </div>
            </DisableWrap>
        </div>
    )
}

export default DataSetting;