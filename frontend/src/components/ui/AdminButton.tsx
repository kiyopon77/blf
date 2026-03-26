import { ReactNode } from "react"

const AdminButton = ({
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
      className="mt-4 sm:mt-0 flex items-center space-x-2 border border-[#D4A22A] text-[#D4A22A] hover:bg-[#D4A22A] hover:text-white px-5 py-2.5 rounded text-sm font-medium transition-colors duration-200"
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export default AdminButton
