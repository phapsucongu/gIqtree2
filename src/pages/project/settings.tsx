import { createRef, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { Settings } from "../../interfaces";
import DataSetting from "./settings/data";
import ModelSetting from "./settings/model";
import TreeSearchSetting from "./settings/treesearch";
import AssessmentSetting from "./settings/assessment";
import DatingSetting from "./settings/dating";
import OtherSetting from "./settings/others";
import { isMultipleGene } from '../../interfaces/dataSettings';

enum CurrentSetting {
    Data = 1,
    Model,
    TreeSearch,
    Assessment,
    Dating,
    Other
}

function ProjectSettings({ setting, onChange }: { setting: Settings, onChange?: (newSetting: Settings) => void }) {
    let [currentSetting, setCurrentSetting] = useState(CurrentSetting.Data);

    let settingCategories = [
        {
            name: 'Data',
            setting: CurrentSetting.Data,
            element: (
                <DataSetting
                    settings={setting.data}
                    onChange={(newDataSettings) => onChange?.({ ...setting, data: newDataSettings })} />
            ),
            ref: createRef<HTMLDivElement>(),
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
            ref: createRef<HTMLDivElement>()
        },
        {
            name: 'Tree search',
            setting: CurrentSetting.TreeSearch,
            element: (
                <TreeSearchSetting
                    settings={setting.treeSearch}
                    onChange={(newTreeSearchSettings) => onChange?.({ ...setting, treeSearch: newTreeSearchSettings })} />
            ),
            ref: createRef<HTMLDivElement>()
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
            ref: createRef<HTMLDivElement>()
        },
        {
            name: 'Dating',
            setting: CurrentSetting.Dating,
            element: (
                <DatingSetting
                    settings={setting.dating}
                    onChange={datingSettings => onChange?.({ ...setting, dating: datingSettings })}/>
            ),
            ref: createRef<HTMLDivElement>()
        },
        {
            name: 'Others',
            setting: CurrentSetting.Other,
            element: (
                <OtherSetting
                    settings={setting.others}
                    onChange={otherSettings => onChange?.({ ...setting, others: otherSettings })}/>
            ),
            ref: createRef<HTMLDivElement>()
        }
    ]

    return (
        <div className="gap-4">
            <div className='flex flex-row gap-2 bg-white sticky top-[6.5rem] justify-evenly'>
                {settingCategories.map(category => (
                    <button
                        key={category.setting}
                        className={
                            'grow p-2 border-x border-b border-black rounded-b-md '
                            + (currentSetting === category.setting ? 'left-column-item-chosen' : '')
                        }
                        onClick={() => {
                            setCurrentSetting(category.setting)
                            let ref = settingCategories
                                .find(s => s.setting === category.setting)
                                ?.ref;
                            if (ref) {
                                ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                if (ref.current) {
                                    let current = ref.current;
                                    current.classList.add('bg-gray-300');
                                    setTimeout(() => current.classList.remove('bg-gray-300'), 700);
                                }
                            }
                        }}>
                        {category.name}
                    </button>
                ))}
            </div>
            <div className='p-2 mt-6'>
                {settingCategories.map(cat => (
                    <div ref={cat.ref} key={cat.name} className='p-2 rounded-xl transition-colors transition-700'>
                        <h3 className='border-l-8 pl-4 border-cyan-700 text-xl font-bold'>
                            {cat.name}
                        </h3>
                        <br />
                        {cat.element}
                        <br />
                        <br />
                        <Waypoint onEnter={() => setCurrentSetting(cat.setting)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectSettings;