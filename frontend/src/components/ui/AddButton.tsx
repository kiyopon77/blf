import { ReactNode } from "react"

const AddButton = ({
  children,
  onClick,
  icon,
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  disabled?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-4 hover:cursor-pointer sm:mt-0 flex items-center space-x-2 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-5 py-2.5 rounded text-sm font-medium transition-colors duration-200"
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default AddButton
