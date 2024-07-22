function BinaryOptions(
    { value, truthyText, falsyText, onChange }
    : { value: boolean, truthyText: string, falsyText: string, onChange?: (v: boolean) => void }
) {
    return (
        <div className="w-full input-bordered flex flex-row items-center gap-2">
            <select
                className="py-1 px-2 w-full bg-transparent no-select-arrow"
                value={+value}
                onChange={e => onChange?.(!!+e.target.value)}>
                <option value={1}>
                    {truthyText}
                </option>
                <option value={0}>
                    {falsyText}
                </option>
            </select>
            <div>

            </div>
        </div>
    )
}

export default BinaryOptions;