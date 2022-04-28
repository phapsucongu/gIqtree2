import split from 'argv-split';
import { OthersSettings } from "../../../interfaces/othersSettings";

function Others({ settings = {}, onChange }: { settings?: OthersSettings, onChange?: (newSetting: OthersSettings) => void }) {
    return (
        <div>
            <div className="setting-row">
                <b>Thread count :</b>
                <input
                    className="border-2 p-2 rounded-lg basis-1/2"
                    type="number"
                    min={0}
                    step={1}
                    placeholder={"0 means auto"}
                    value={settings?.thread || undefined}
                    onChange={e => onChange?.({ ...settings, thread: e.target.valueAsNumber })} />
            </div>
            <div className="setting-row">
                <b>Output prefix :</b>
                <input
                    className="border-2 p-2 rounded-lg basis-1/2"
                    type="text"
                    placeholder={"Output prefix"}
                    value={settings?.prefix}
                    onChange={e => onChange?.({ ...settings, prefix: e.target.value })} />
            </div>
            <div className="setting-row">
                <b>Append command line :</b>
                <input
                    className="border-2 p-2 rounded-lg basis-1/2"
                    type="text"
                    placeholder={"Command line to append"}
                    value={settings?.appendCommandLine || undefined}
                    onChange={e => onChange?.({ ...settings, appendCommandLine: e.target.value })} />
            </div>
            {settings?.appendCommandLine && (
                <div className="setting-row">
                    <div>The command line will be parsed into the following arguments :</div>
                    <div className='flex flex-row gap-2'>
                        {split(settings.appendCommandLine, false)
                            .map(piece => <code className='p-1 border border-red-500 whitespace-pre-wrap'>{piece}</code>)
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default Others;