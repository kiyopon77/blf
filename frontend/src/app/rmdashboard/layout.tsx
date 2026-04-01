// app/rmdashboard/layout.tsx
import Navbar from "@/components/Navbar"

// handles r m dashboard functionality
export default function RMDashboard({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
