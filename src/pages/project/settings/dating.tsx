import SettingRowFile from "../../../components/settingrowfile";
import SettingRowMultipleChoice from "../../../components/settingrowmultiplechoice";
import { DateInfoType, DateInfoTypes, DatingSettings } from "../../../interfaces/datingSettings";

function Dating({ settings, onChange }: { settings: DatingSettings, onChange?: (datingSetting: DatingSettings) => void }) {
    let { dateInfoType, dateFile } = settings;
    return (
        <div>
            <SettingRowMultipleChoice
                label="Date info type :"
                options={
                    [{ name: 'None', type: undefined }, ...DateInfoTypes]
                        .map(e => ({ name: e.name, value: e.type }))
                }
                onChosen={(value) => onChange?.({
                    ...settings,
                    dateInfoType: value
                })}
                value={[dateInfoType]}
                />
            {dateInfoType && (
                <SettingRowFile
                    name={"Date file" + (dateInfoType === DateInfoType.Ancestral ? " (required)" : "") + " :"}
                    file={dateFile ?? undefined}
                    onChange={file => onChange?.({ ...settings, dateFile: file ?? undefined })} />
            )}
        </div>
    )
}

export default Dating;