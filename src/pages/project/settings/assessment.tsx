import SettingRowFile from "../../../components/settingrowfile";
import {
    AssessmentSettings,
    BootstrapMethod,
    BootstrapMethods,
    DefaultALRTReplicate,
    DefaultBootstrapMethodReplicate,
    DefaultLocalBootstrapReplicate,
    DefaultMultiPartitionSamplingStrategy,
    MultiPartitionSamplingStrategies,
    SingleBranchTest,
    SingleBranchTests
} from "../../../interfaces/assessmentSettings";

function Assessment(
    { settings, isMultipleGene, onChange }:
    { settings: AssessmentSettings, isMultipleGene: boolean, onChange?: (newSettings: AssessmentSettings) => void }
) {
    let {
        ufbootOption,
        bootstrapMethod, multiPartitionSamplingStrategy, singleBranchTests,
        bootstrapMethodReplicate, approximateLikelihoodReplicate, localBootstrapReplicate,
        gcf, scf, speciesTree
    } = settings;
    return (
        <div>
            <div className="setting-row">
                <b>Bootstrap method :</b>
                <div>
                    {[{ name: 'None', type: null }, ...BootstrapMethods]
                        .map((current, index) => {
                            let rounded = '';
                            if (index === 0) rounded = 'border-l rounded-l-full';
                            if (index === BootstrapMethods.length) rounded = 'rounded-r-full';

                            let chosen = bootstrapMethod === current.type
                                ? 'bg-gray-700 border-gray-700 text-white font-bold'
                                : 'border-black';
                            return (
                                <button
                                    onClick={() => {
                                        onChange?.({
                                            ...settings,
                                            bootstrapMethod: current.type
                                        });
                                    }}
                                    className={"py-2 px-4 border-r border-y hover:bg-gray-200 hover:text-black " + rounded + ' ' + chosen}>
                                    {current.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            {bootstrapMethod === BootstrapMethod.UltraFastBootstrap && (
                <div className="setting-row">
                    <b>UFBoot option for reducing impact of severe model violation :</b>
                    <button
                        className="action-button"
                        onClick={() => onChange?.({ ...settings, ufbootOption: !ufbootOption })}>
                        {ufbootOption ? 'Enabled' : 'Disabled'}
                    </button>
                </div>
            )}
            {(bootstrapMethod === BootstrapMethod.Standard || bootstrapMethod === BootstrapMethod.UltraFastBootstrap) && (
                <div className="setting-row gap-32">
                    <b>Number of bootstrapping replicates :</b>
                    <input
                        className="border-2 p-2 rounded-lg basis-1/2"
                        type="number"
                        min={1}
                        step={1}
                        placeholder={DefaultBootstrapMethodReplicate.toString()}
                        value={bootstrapMethodReplicate ?? DefaultBootstrapMethodReplicate}
                        onChange={e => onChange?.({ ...settings, bootstrapMethodReplicate: e.target.valueAsNumber })}
                    />
                </div>
            )}
            {isMultipleGene && (
                <div className="setting-row">
                    <b>Multi-partition sampling strategy :</b>
                    <div>
                        {MultiPartitionSamplingStrategies
                            .map((current, index) => {
                                let rounded = '';
                                if (index === 0) rounded = 'border-l rounded-l-full';
                                if (index === BootstrapMethods.length) rounded = 'rounded-r-full';

                                let chosen = (
                                    multiPartitionSamplingStrategy === current.type
                                    || (multiPartitionSamplingStrategy === null && current.type === DefaultMultiPartitionSamplingStrategy)
                                )
                                    ? 'bg-gray-700 border-gray-700 text-white font-bold'
                                    : 'border-black';
                                return (
                                    <button
                                        onClick={() => {
                                            onChange?.({
                                                ...settings,
                                                multiPartitionSamplingStrategy: current.type
                                            });
                                        }}
                                        className={"py-2 px-4 border-r border-y hover:bg-gray-200 hover:text-black " + rounded + ' ' + chosen}>
                                        {current.name}
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            )}
            <div className="setting-row">
                <b>Single branch tests :</b>
                <div className="flex flex-row gap-4">
                    {SingleBranchTests
                        .map(group => {
                            let buttons = group.map((current, index) => {
                                let rounded = '';
                                let singleBranchTests = settings.singleBranchTests || [];
                                if (index === 0) rounded = 'border-l rounded-l-full';
                                if (index === group.length - 1) rounded = 'rounded-r-full';
                                if (group.length === 1) rounded = 'border-l';

                                let chosen = singleBranchTests.includes(current.type);
                                let chosenClass = chosen
                                    ? 'bg-gray-700 border-gray-700 text-white font-bold'
                                    : 'border-black';

                                return (
                                    <button
                                        onClick={() => {
                                            let outSet = new Set(singleBranchTests);
                                            if (group.length === 1) {
                                                outSet[chosen ? 'delete' : 'add'](current.type);
                                            }
                                            else {
                                                for (let { type } of group)
                                                    outSet.delete(type);
                                                if (!chosen) {
                                                    outSet.add(current.type);
                                                }
                                            }

                                            onChange?.({
                                                ...settings,
                                                singleBranchTests: [...outSet]
                                            });
                                        }}
                                        className={"py-2 px-4 border-r border-y hover:bg-gray-200 hover:text-black " + rounded + ' ' + chosenClass}>
                                        {current.name}
                                    </button>
                                )
                            })

                            return (
                                <div className="flex flex-row">
                                    {buttons}
                                </div>
                            );
                        })

                    }
                </div>
            </div>
            {singleBranchTests?.includes(SingleBranchTest.SH_aLRT) &&
                <div className="setting-row">
                    <b>Number of aLRT replicates :</b>
                    <input
                        className="border-2 p-2 rounded-lg basis-1/2"
                        type="number"
                        min={1}
                        step={1}
                        placeholder={DefaultALRTReplicate.toString()}
                        value={approximateLikelihoodReplicate ?? DefaultALRTReplicate}
                        onChange={e => onChange?.({ ...settings, approximateLikelihoodReplicate: e.target.valueAsNumber })}
                    />
                </div>}
            {singleBranchTests?.includes(SingleBranchTest.LocalBootstrap) && (
                <div className="setting-row">
                    <b>Number of local-bootstrap-test replicates :</b>
                    <input
                        className="border-2 p-2 rounded-lg basis-1/2"
                        type="number"
                        min={1}
                        step={1}
                        placeholder={DefaultLocalBootstrapReplicate.toString()}
                        value={localBootstrapReplicate ?? DefaultLocalBootstrapReplicate}
                        onChange={e => onChange?.({ ...settings, localBootstrapReplicate: e.target.valueAsNumber })}
                    />
                </div>
            )}
            <div className="setting-row">
                <b>Enable gCF</b>
                <button
                    className="action-button"
                    onClick={() => onChange?.({ ...settings, gcf: { ...gcf, enabled: !gcf?.enabled } })}>
                    {gcf?.enabled ? 'Enabled' : 'Disabled'}
                </button>
            </div>
            <div className="setting-row">
                <b>sCF quartet number (0 to disable sCF) :</b>
                <input
                    className="border-2 p-2 rounded-lg basis-1/2"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0 to disable sCF"
                    value={scf?.quartet ?? undefined}
                    onChange={e => onChange?.({ ...settings, scf: { ...scf, quartet: e.target.valueAsNumber ?? 0 } })} />
            </div>
            {settings.gcf?.enabled &&
                <SettingRowFile
                    name="Gene tree (leave empty to generate) :"
                    file={gcf?.geneTree}
                    onChange={f => onChange?.({ ...settings, gcf: { enabled: true, geneTree: f } })} />}
            {!!settings.scf?.quartet &&
                <SettingRowFile
                    name="Species tree (leave empty to generate) :"
                    file={speciesTree}
                    onChange={f => onChange?.({ ...settings, speciesTree: f })} />}
        </div>
    )
}

export default Assessment;