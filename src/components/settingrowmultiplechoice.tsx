import { Primitive } from "type-fest";

function SettingRowMultipleChoice<T extends Primitive>(
    { options: choices, value: currentChoice, onChosen, label } :
    { options: { name: string, value: T }[], value: T[], onChosen?: (value: T) => void, label?: string }
) {
    return (
        <div className="setting-row">
            <b>{label}</b>
            <div>
                {choices
                    .map((current, index) => {
                        let rounded = '';
                        if (index === 0) rounded = 'border-l rounded-l-full';
                        if (index === choices.length - 1) rounded = 'rounded-r-full';

                        let chosen = currentChoice.includes(current.value)
                            ? 'bg-gray-700 border-gray-700 text-white font-bold'
                            : 'border-black';
                        return (
                            <button
                                onClick={() => onChosen?.(current.value)}
                                className={"py-2 px-4 border-r border-y hover:bg-gray-200 hover:text-black " + rounded + ' ' + chosen}>
                                {current.name}
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SettingRowMultipleChoice;