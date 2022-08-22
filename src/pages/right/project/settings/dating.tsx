import { DateInfoType, DateInfoTypes, DatingSettings } from "../../../../interfaces/datingSettings";
import { SettingCategoryCommonProp } from "./settingCategoryCommonProps";
import SettingRowFile from "../../../../component/settingrowfile";

function Dating({ settings, onChange } : SettingCategoryCommonProp<DatingSettings>) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <b className="pb-2">
                    Date info type
                </b>
                <select
                    className="p-2 w-full input-bordered bg-transparent"
                    onChange={e => onChange?.({
                        ...settings,
                        dateInfoType: (e.target.value || undefined) as DateInfoType | undefined
                    })}
                    value={settings?.dateInfoType}>
                    {
                        [{ name: 'None', type: undefined }, ...DateInfoTypes]
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
            <div>
                <b className="pb-2">
                    Date file {settings?.dateInfoType === DateInfoType.Ancestral ? " (required)" : ""}
                </b>
                <SettingRowFile
                    isFile
                    name={"Date file" + (settings?.dateInfoType === DateInfoType.Ancestral ? " (required)" : "") + " :"}
                    file={settings?.dateFile ?? undefined}
                    onChange={file => onChange?.({ ...settings, dateFile: file ?? undefined })} />
            </div>
        </div>
    )
}

export default Dating;