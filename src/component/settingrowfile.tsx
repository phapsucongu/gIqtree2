import { dialog } from "@electron/remote";
import { useWindow } from "../hooks/useWindow";

function SettingRowFile({ name, file, isFile, onChange }
    : { name: string, file?: string, isFile: boolean, onChange?: (file: string) => void }
) {
    let window = useWindow();
    return (
        <div className="w-full p-2 input-bordered flex flex-row items-center gap-2">
            <input
                className="flex-grow"
                value={file || undefined}
                onChange={e => onChange?.(e.target.value)}
                placeholder={name} />
            <button
                className="font-bold"
                onClick={() => {
                    if (!window) return;

                    let folder = dialog.showOpenDialogSync(window, {
                        title: "Choose a file",
                        properties: [isFile ? 'openFile' : 'openDirectory']
                    });

                    if (folder) {
                        onChange?.(folder[0]);
                    }
                }}>
                . . .
            </button>
        </div>
    )
}

export default SettingRowFile