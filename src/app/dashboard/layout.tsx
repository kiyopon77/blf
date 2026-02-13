import Navbar from "@/components/Navbar"

export default function DashboardPage({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
