import { OthersSettings } from "../../../../interfaces/othersSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";
import split from 'argv-split';

function Other({ settings, onChange } : SettingCategoryCommonProp<OthersSettings>) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Thread count
                </b>
                <input
                    className="p-2 w-full input-bordered bg-transparent"
                    type="number"
                    onChange={e => onChange?.({
                        ...settings,
                        thread: (e.target.valueAsNumber || undefined)
                    })}
                    value={settings?.thread} />
            </div>
            <div>
                <b className="pb-2">
                    Output prefix
                </b>
                <input
                    className="p-2 w-full input-bordered bg-transparent"
                    type="text"
                    onChange={e => onChange?.({
                        ...settings,
                        prefix: (e.target.value || undefined)
                    })}
                    placeholder="Output prefix"
                    value={settings?.prefix} />
            </div>
            <div>
                <b className="pb-2">
                    Append command line
                </b>
                <input
                    className="p-2 w-full input-bordered bg-transparent"
                    type="text"
                    onChange={e => onChange?.({
                        ...settings,
                        appendCommandLine: (e.target.value || undefined)
                    })}
                    placeholder="Command line to append"
                    value={settings?.appendCommandLine} />
                {settings?.appendCommandLine && (
                    <>
                        <div>The command line will be parsed into the following arguments :</div>
                        <div className='flex flex-row gap-2'>
                            {split(settings.appendCommandLine, false)
                                .map(piece => <code className='p-1 border border-red-500 whitespace-pre-wrap'>{piece}</code>)
                            }
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Other;