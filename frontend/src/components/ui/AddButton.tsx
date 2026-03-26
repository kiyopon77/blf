import { ReactNode } from "react"

const AddButton = ({
  children,
  onClick,
  icon,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
}) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 hover:cursor-pointer sm:mt-0 flex items-center space-x-2 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-5 py-2.5 rounded text-sm font-medium transition-colors duration-200"
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default AddButton
