// components/ui/DashboardCard.tsx
import Image from "next/image"

interface Props {
  heading: string
  icon: string
  value: number
  bgColor: string
}

// handles dashboard card functionality
const DashboardCard = ({ heading, icon, value, bgColor }: Props) => {
  return (
    <div className={`${bgColor} shadow-gray-300 shadow-sm p-5 rounded-2xl h-35 flex flex-col justify-between`}>
      <div className="flex items-center justify-between w-full">
        <p className="text-md text-gray-900 uppercase font-medium">{heading}</p>
        <Image alt="icon" src={icon} width={30} height={30} />
      </div>

      <span className="text-5xl font-extrabold">{value}</span>
    </div>
  )
}

export default DashboardCard
