import { ReactNode } from "react"

const DeleteButton = ({
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
      className="mt-4 sm:mt-0 hover:cursor-pointer flex items-center space-x-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded text-sm font-medium transition-colors duration-200"
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default DeleteButton
