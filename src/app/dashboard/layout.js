import Navbar from "@/components/Navbar"

export default function DashboardPage({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
