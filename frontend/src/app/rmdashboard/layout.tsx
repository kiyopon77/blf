import Navbar from "@/components/Navbar"

export default function RMDashboard({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
