// app/dashboard/layout.tsx
import Navbar from "@/components/Navbar"
import { ProtectedRoute } from "@/components/ProtectedRoute"

// handles dashboard page functionality
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
