const NegativeButton = (props: React.ComponentProps<'button'>) => (
    <button className="py-1 px-8 lg:px-16 border-2 border-black disabled:border-gray-300 disabled:text-gray-300 rounded-lg" {...props} />
)

const PositiveButton = (props: React.ComponentProps<'button'>) => (
    <button className="py-1 px-8 lg:px-16 border-2 text-white bg-pink-600 border-pink-600 rounded-lg" {...props} />
)

export { PositiveButton, NegativeButton };