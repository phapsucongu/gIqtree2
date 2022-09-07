import { MaximizeLogo, MinimizeLogo, CloseLogo } from "../icons";
import { useWindow } from "./useWindow";
import { useWindowMaximized } from "./useWindowMaximized";

function useWindowsButtons() {
    let window = useWindow();
    let maximized = useWindowMaximized();

    let buttonClass = "p-2 mx-1";

    return (
        <div className="flex flex-row">
            <button
                className={buttonClass + " hover:bg-gray-300"}
                onClick={() => window.minimize()}>
                <MinimizeLogo />
            </button>
            <button
                className={buttonClass + " hover:bg-gray-300"}
                onClick={() => maximized ? window.unmaximize() : window.maximize()}>
                <MaximizeLogo />
            </button>
            <button
                className={buttonClass + " hover:bg-red-300"}
                onClick={() => window.close()}>
                <CloseLogo />
            </button>
        </div>
    )
}

export default useWindowsButtons;