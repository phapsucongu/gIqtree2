import { useNavigate } from "react-router-dom";

function Settings() {
    let navigate = useNavigate();
    return (
        <div>
            <div className="flex flex-row items-center justify-between border-b border-b-black/10 py-2">
                <b className="font-arvo py-4 pl-6">
                    Settings
                </b>
                <div className="flex flex-row gap-8 pr-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="py-1 px-16 border-2 border-black rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="py-1 px-16 border-2 text-white bg-pink-600 border-pink-600 rounded-lg">
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings;