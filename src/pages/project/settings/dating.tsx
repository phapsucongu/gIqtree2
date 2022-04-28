import SettingRowFile from "../../../components/settingrowfile";
import { DateInfoType, DateInfoTypes, DatingSettings } from "../../../interfaces/datingSettings";

function Dating({ settings, onChange }: { settings: DatingSettings, onChange?: (datingSetting: DatingSettings) => void }) {
    let { dateInfoType, dateFile } = settings;
    return (
        <div>
            <div className="setting-row">
                <b>Date info type :</b>
                <div>
                    {[{ name: 'None', type: undefined }, ...DateInfoTypes]
                        .map((current, index) => {
                            let rounded = '';
                            if (index === 0) rounded = 'border-l rounded-l-full';
                            if (index === DateInfoTypes.length) rounded = 'rounded-r-full';

                            let chosen = dateInfoType === current.type
                                ? 'bg-gray-700 border-gray-700 text-white font-bold'
                                : 'border-black';
                            return (
                                <button
                                    onClick={() => {
                                        onChange?.({
                                            ...settings,
                                            dateInfoType: current.type
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
            {dateInfoType && (
                <SettingRowFile
                    name={"Date file" + (dateInfoType === DateInfoType.Ancestral ? " (required)" : "") + " :"}
                    file={dateFile ?? null}
                    onChange={file => onChange?.({ ...settings, dateFile: file ?? undefined })} />
            )}
        </div>
    )
}

export default Dating;