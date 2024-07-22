import BinaryOptions from "../../../../component/binaryoptions";
import SettingRowFile from "../../../../component/settingrowfile";
import { TreeSearchSettings } from "../../../../interfaces/treeSearchSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";

function TreeSearch({ settings, onChange } : SettingCategoryCommonProp<TreeSearchSettings>) {
    let { enabled } = settings || {};
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Enabled
                </b>
                <br />
                <BinaryOptions
                    value={enabled ?? false}
                    truthyText="On"
                    falsyText="Off"
                    onChange={v => onChange?.({ ...settings, enabled: v })} />
            </div>
            <div>
                <b className="pb-2">
                    Number of unsuccessful iterations to stop
                </b>
                <input
                    min={0}
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="number"
                    onChange={e => onChange?.({
                        ...settings,
                        unsuccessfulIterationsStop: (e.target.valueAsNumber || undefined)
                    })}
                    value={settings?.unsuccessfulIterationsStop ?? 100} />
            </div>
            <div>
                <b className="pb-2">
                    Pertubation strength
                </b>
                <input
                    step={0.1}
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="number"
                    onChange={e => onChange?.({
                        ...settings,
                        pertubationStrength: (e.target.valueAsNumber || undefined)
                    })}
                    value={settings?.pertubationStrength ?? 0.5} />
            </div>
            <div>
                <b className="pb-2">
                    Constrained tree file
                </b>
                <SettingRowFile
                    isFile
                    name="Alignment file/folder"
                    file={settings?.constrainedTreeFile}
                    onChange={file => {
                        onChange?.({ ...settings, constrainedTreeFile: file ? file : undefined })
                    }}
                    />
            </div>
            <div>
                <b className="pb-2">
                    Reference tree file
                </b>
                <SettingRowFile
                    isFile
                    name="Alignment file/folder"
                    file={settings?.referenceTreeFile}
                    onChange={file => {
                        onChange?.({ ...settings, referenceTreeFile: file ? file : undefined })
                    }}
                    />
            </div>
            <div>
                <b className="pb-2">
                    Outgroup taxa
                </b>
                <input
                    min={0}
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="text"
                    placeholder="strings separated by commas..."
                    onChange={e => onChange?.({
                        ...settings,
                        outgroupTaxa: (e.target.value || undefined)
                    })}
                    value={settings?.outgroupTaxa} />
            </div>
        </div>
    );
}

export default TreeSearch;