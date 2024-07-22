interface IProps {
    disabled?: boolean,
    disableText?: string
}

function DisableWrap({ children, disableText, disabled } : React.PropsWithChildren<IProps>) {
    if (!disabled) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            <div className="absolute w-full h-full text-center bg-gray-300 rounded-md opacity-95">
                <div className="h-full flex flex-col justify-between">
                    <div></div>
                    <div>{disableText}</div>
                    <div></div>
                </div>
            </div>
            <div className="p-1">
                {children}
            </div>
        </div>
    )
}

export { DisableWrap };