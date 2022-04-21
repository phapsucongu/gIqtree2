import { ReactElement, useState } from 'react';
import { Settings } from "../../interfaces";
import DataSetting from "./settings/data";
import ModelSetting from "./settings/model";
import TreeSearchSetting from "./settings/treesearch";
import AssessmentSetting from "./settings/assessment";
import DatingSetting from "./settings/dating";
import OtherSetting from "./settings/others";

enum CurrentSetting {
    Data = 1,
    Model,
    TreeSearch,
    Assessment,
    Dating,
    Other
}

export default ({ setting, onChange }: { setting: Settings, onChange?: (newSetting: Settings) => void }) => {
    let [currentSetting, setCurrentSetting] = useState(CurrentSetting.Data);
    let currentSettingElement: ReactElement | null = null;

    let settingCategories = [
        { name: 'Data', setting: CurrentSetting.Data },
        { name: 'Model', setting: CurrentSetting.Model },
        { name: 'Tree search', setting: CurrentSetting.TreeSearch },
        { name: 'Assessment', setting: CurrentSetting.Assessment },
        { name: 'Dating', setting: CurrentSetting.Dating },
        { name: 'Others', setting: CurrentSetting.Other },
    ]

    switch (currentSetting) {
        case CurrentSetting.Data: {
            currentSettingElement = (
                <DataSetting
                    settings={setting.data}
                    onChange={(newDataSettings) => onChange?.({ ...setting, data: newDataSettings })} />
            );
            break;
        }

        case CurrentSetting.Model: {
            currentSettingElement = <ModelSetting />;
            break;
        }

        case CurrentSetting.TreeSearch: {
            currentSettingElement = (
                <TreeSearchSetting
                    settings={setting.treeSearch}
                    onChange={(newTreeSearchSettings) => onChange?.({ ...setting, treeSearch: newTreeSearchSettings })} />
            );
            break;
        }

        case CurrentSetting.Assessment: {
            currentSettingElement = (
                <AssessmentSetting
                    settings={setting.assessment}
                    onChange={(assessmentSettings) => onChange?.({ ...setting, assessment: assessmentSettings })} />
            );
            break;
        }

        case CurrentSetting.Dating: {
            currentSettingElement = <DatingSetting />;
            break;
        }

        case CurrentSetting.Other: {
            currentSettingElement = <OtherSetting />;
            break;
        }
    }

    return (
        <div className="flex flex-row gap-4 pt-4">
            <div className="min-w-[12rem] flex flex-col">
                {settingCategories.map(category => (
                    <button
                        key={category.setting}
                        className={
                            'left-column-item text-left '
                            + (currentSetting === category.setting ? 'left-column-item-chosen' : '')
                        }
                        onClick={() => setCurrentSetting(category.setting)}>
                        {category.name}
                    </button>
                ))}
            </div>
            <div className="grow p-4">
                {currentSettingElement}
            </div>
        </div>
    )
}