import { Settings } from "../../interfaces";
import './settings.css'
import DataSetting from "./settings/data";

export default ({ setting, onChange } : { setting: Settings, onChange?: (newSetting: Settings) => void }) => (
    <div className="flex flex-row gap-4 pt-4">
        <div className="min-w-[12rem]">
            <div className="category-column-item category-column-item-chosen">Data</div>
            <div className="category-column-item">Model</div>
            <div className="category-column-item">Tree search</div>
            <div className="category-column-item">Assessment</div>
            <div className="category-column-item">Dating</div>
            <div className="category-column-item">Others</div>
        </div>
        <div className="grow p-4">
            <DataSetting
                settings={setting.data}
                onChange={(newDataSettings) => onChange?.({
                    ...setting,
                    data: newDataSettings
                })}/>
        </div>
    </div>
)