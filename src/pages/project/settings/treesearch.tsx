import SettingRowFile from "../../../components/settingrowfile";
import { DefaultPertubationStrength, DefaultUnsuccessfulIterationStop, TreeSearchSettings } from "../../../interfaces/treeSearchSettings";

function TreeSearch(
    { settings, onChange }:
    { settings: TreeSearchSettings, onChange?: (newSetting: TreeSearchSettings) => void }
) {
    let { enabled, unsuccessfulIterationsStop, pertubationStrength, referenceTreeFile, constrainedTreeFile, outgroupTaxa } = settings;
    let validOutgroup = true;

    if (outgroupTaxa) {
        let chunks = outgroupTaxa.split(',');
        validOutgroup = chunks.every(
            chunk => chunk.search(/^[a-zA-Z0-9_]+$/) !== -1
        );
    }

    return (
        <div>
            {!validOutgroup && (
                <b className="text-red-500 text-sm">
                    <code className="underline">Outgroup taxa</code> isn't valid.
                    <br />
                    Ensure that there is no whitespaces and the string consists of parts separated by commas.
                    <br />
                    Each part must consists of alphanumeric characters and/or underscores only.
                </b>
            )}
            <div className="setting-row">
                <b>Tree search</b>
                <button
                    className="action-button"
                    onClick={() => onChange?.({ ...settings, enabled: !settings.enabled })}>
                    {enabled ? 'Enabled' : 'Disabled'}
                </button>
            </div>
            <div className="setting-row gap-32">
                <b>Number of unsuccessful iterations to stop :</b>
                <input
                    className="border-2 p-2 rounded-lg basis-1/2"
                    type="number"
                    min={1}
                    step={1}
                    placeholder={DefaultUnsuccessfulIterationStop.toString()}
                    value={unsuccessfulIterationsStop ?? DefaultUnsuccessfulIterationStop}
                    onChange={e => onChange?.({ ...settings, unsuccessfulIterationsStop: e.target.valueAsNumber })}
                />
            </div>
            <div className="setting-row gap-32">
                <b>
                    Pertubation strength :
                </b>
                <input
                    className="border-2 p-2 rounded-lg basis-1/2"
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    placeholder={DefaultPertubationStrength.toString()}
                    value={pertubationStrength ?? DefaultPertubationStrength}
                    onChange={e => onChange?.({ ...settings, pertubationStrength: e.target.valueAsNumber })}
                />
            </div>
            <SettingRowFile
                name="Constrained tree file"
                file={constrainedTreeFile}
                onChange={file => onChange?.({ ...settings, constrainedTreeFile: file })} />
            <SettingRowFile
                name="Reference tree file"
                file={referenceTreeFile}
                onChange={file => onChange?.({ ...settings, referenceTreeFile: file })} />
            <div className="setting-row gap-32">
                <b>
                    Outgroup taxa :
                </b>
                <input
                    className={
                        "border-2 p-2 rounded-lg basis-1/2 "
                        + (validOutgroup ? 'border-gray-400' : 'border-red-600')
                    }
                    type="string"
                    placeholder={"strings separated by commas..."}
                    value={outgroupTaxa ?? undefined}
                    onChange={e => onChange?.({ ...settings, outgroupTaxa: e.target.value })}
                />
            </div>
        </div>
    );
}

export default TreeSearch;