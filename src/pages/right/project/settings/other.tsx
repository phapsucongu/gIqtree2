import { getThreadCommand } from "../../../../command/otherSetting";
import { OthersSettings } from "../../../../interfaces/settings/othersSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";
import split from 'argv-split';

function Other({ settings, onChange } : SettingCategoryCommonProp<OthersSettings>) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Thread count
                </b>
                {settings?.thread && (
                    <span className="opacity-50 ml-2">
                        (output :&nbsp;
                        <span className="font-mono">
                            {getThreadCommand(settings.thread).join(' ')}
                        </span>)
                    </span>
                )}
                <input
                    className="px-1 py-2 w-full input-bordered bg-transparent"
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
                    className="px-1 py-2 w-full input-bordered bg-transparent"
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
                    className="px-1 py-2 w-full input-bordered bg-transparent"
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
            <div>
                <b className="pb-2">
                    Submission command (for workload schedulers)
                </b>
                <input
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="text"
                    onChange={e => onChange?.({
                        ...settings,
                        submitCommand: (e.target.value || undefined)
                    })}
                    placeholder="Submission command (bsub for example)"
                    value={settings?.submitCommand} />
            </div>
            <div>
                <b className="pb-2">
                    Submission status command (for workload schedulers)
                </b>
                <input
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    type="text"
                    onChange={e => onChange?.({
                        ...settings,
                        checkCommand: (e.target.value || undefined)
                    })}
                    placeholder="Check command (bjobs for example)"
                    value={settings?.checkCommand} />
            </div>
            <div>
                <b className="pb-2">
                    Template job file (IQ-TREE commands will be appended to this)
                </b>
                <textarea
                    className="px-1 py-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        submitTemplate: (e.target.value || undefined)
                    })}
                    placeholder="Should start with #!/bin/bash"
                    value={settings?.submitTemplate} />
            </div>
        </div>
    )
}

export default Other;