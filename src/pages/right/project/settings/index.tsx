import { useState } from "react";
import DataSetting from './data';
import ModelSetting from './model';
import AssessmentSetting from './assessment';
import TreeSearchSetting from './treesearch';
import DatingSetting from './dating';
import OtherSetting from './other';
import { Settings } from "../../../../interfaces";
import { isMultipleGene } from "../../../../interfaces/dataSettings";

enum CurrentSetting {
    Data = 1,
    Model,
    TreeSearch,
    Assessment,
    Dating,
    Other
}

function SettingsSubPage(
    { setting, onChange }:
    { setting: Settings, onChange?: (newSetting: Settings) => void }
) {
    let [current, setCurrent] = useState(CurrentSetting.Data);

    let settingCategories = [
        {
            name: 'Data',
            setting: CurrentSetting.Data,
            element: (
                <DataSetting
                    settings={setting.data}
                    onChange={(newDataSettings) => onChange?.({ ...setting, data: newDataSettings })} />
            ),
        },
        {
            name: 'Model',
            setting: CurrentSetting.Model,
            element: (
                <ModelSetting
                    sequenceType={setting.data.sequenceType}
                    isMultipleGene={isMultipleGene(setting.data)}
                    settings={setting.model}
                    onChange={(newModelSettings) => onChange?.({ ...setting, model: newModelSettings })}
                    />
            ),
        },
        {
            name: 'Tree search',
            setting: CurrentSetting.TreeSearch,
            element: (
                <TreeSearchSetting
                    settings={setting.treeSearch}
                    onChange={(newTreeSearchSettings) => onChange?.({ ...setting, treeSearch: newTreeSearchSettings })} />
            ),
        },
        {
            name: 'Assessment',
            setting: CurrentSetting.Assessment,
            element: (
                <AssessmentSetting
                    isMultipleGene={isMultipleGene(setting.data)}
                    settings={setting.assessment}
                    onChange={(assessmentSettings) => onChange?.({ ...setting, assessment: assessmentSettings })} />
            ),
        },
        {
            name: 'Dating',
            setting: CurrentSetting.Dating,
            element: (
                <DatingSetting
                    settings={setting.dating}
                    onChange={datingSettings => onChange?.({ ...setting, dating: datingSettings })}/>
            ),
        },
        {
            name: 'Others',
            setting: CurrentSetting.Other,
            element: (
                <OtherSetting
                    settings={setting.others}
                    onChange={otherSettings => onChange?.({ ...setting, others: otherSettings })}/>
            ),
        }
    ]

    let currentPage = settingCategories.find(f => f.setting === current);
    return (
        <div className="h-full">
            <div className="flex flex-row gap-4 h-full px-6">
                <div className="basis-1/5 h-full flex flex-col gap-2 pt-6 border-r border-r-black/10">
                    {settingCategories.map(r => {
                        return (
                            <button
                                onClick={() => setCurrent(r.setting)}
                                key={r.setting}
                                className={
                                    "font-bold text-left w-full"
                                    + (r.setting === current ? ' text-pink-500' : '')
                                    }>
                                {r.name}
                            </button>
                        )
                    })}
                </div>
                <div className="basis-4/5 pt-6 overflow-y-scroll">
                    <div className="text-2xl font-bold pb-6">
                        {currentPage?.name}
                    </div>
                    <div className="pr-3 mb-6">
                        {currentPage?.element}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsSubPage;