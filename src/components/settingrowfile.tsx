import { dialog } from "@electron/remote";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWindow } from "../hooks/useWindow";

export default ({ name, file, onChange }: { name: string, file: string | null, onChange?: (file: string | null) => void }) => {
    let window = useWindow();

    const changeFileCallback = () => {
        if (!window) return;

        let file = dialog.showOpenDialogSync(window, {
            title: 'Choose a partition file', properties: ['openFile']
        });

        if (file)
            onChange?.(file[0]);
    }

    return (
        <div className="setting-row">
            <b>{name}</b>
            <div className="flex flex-row justify-end items-center">
                <div className="font-bold pr-2">
                    {file}
                </div>
                {!file && (
                    <button className="action-button" onClick={changeFileCallback}>
                        <FontAwesomeIcon icon={faPenToSquare} className="pr-2" />
                        Add
                    </button>
                )}
                {file && (
                    <>
                        <button className="multiple-option-button border-l rounded-l-full" onClick={changeFileCallback}>
                            <FontAwesomeIcon icon={faPenToSquare} className="pr-2" />
                            Change
                        </button>
                        <button
                            className="multiple-option-button rounded-r-full"
                            onClick={() => onChange?.(null)}>
                            <FontAwesomeIcon icon={faTrashCan} className="pr-2" />
                            Remove
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}