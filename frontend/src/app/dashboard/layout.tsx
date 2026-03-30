import Navbar from "@/components/Navbar"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function DashboardPage({ children } : {children: React.ReactNode}) {
  return (
    <ProtectedRoute requireAdmin>
    <div>
      <Navbar />
      {children}
    </div>
    </ProtectedRoute>
  )
}
