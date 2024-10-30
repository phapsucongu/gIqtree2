import { useState } from "react";
import DataSetting from './data';
import ModelSetting from './model';
import AssessmentSetting from './assessment';
import TreeSearchSetting from './treesearch';
import DatingSetting from './dating';
import OtherSetting from './other';
import { Settings } from "../../../../interfaces";
import { isMultipleGene } from "../../../../interfaces/settings/dataSettings";
import useSsh from "../../../../hooks/useSsh";
import { DateInfoType } from "../../../../interfaces/settings/datingSettings";

enum CurrentSetting {
    Data = 1,
    Model,
    TreeSearch,
    Assessment,
    Dating,
    Other
}

function SettingsSubPage(
    { setting, onChange, path }:
    { setting: Settings, path: string, onChange?: (newSetting: Settings) => void }
) {
    const [current, setCurrent] = useState(CurrentSetting.Data);
    let ssh = useSsh();

    const settingCategories = [
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

    const currentPage = settingCategories.find(f => f.setting === current);


    let wrongPath = (setting.lastPath || ssh) && setting.lastPath !== path;


    const handleChangePage = (newSetting: CurrentSetting) => {
        if (current === CurrentSetting.Dating) {
            const datingSettings = setting.dating;
            if (datingSettings.dateInfoType === DateInfoType.Ancestral && !datingSettings.dateFile) {
                alert("Date File is required");
                return;
            }
        }
        setCurrent(newSetting);
    };

    return (
        <div className="h-full">
            {wrongPath && (
                <div className="text-yellow-400 text-sm font-bold px-6 py-1">
                    This project's current path does not match its recorded path. Was it copied?
                    <br />
                    <span className="text-yellow-600">
                        Pressing save will remove this warning permanently, please double-check!
                    </span>
                </div>
            )}
            <div className="flex flex-row gap-4 h-full px-6">
                <div className="basis-1/5 h-full flex flex-col gap-2 pt-6 border-r border-r-black/10">
                    {settingCategories.map(r => {
                        return (
                            <button
                                onClick={() => handleChangePage(r.setting)}
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
