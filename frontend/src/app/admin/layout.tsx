import AdminSidebar from "@/components/AdminSidebar"
import Navbar from "@/components/Navbar"
export default function AdminPage({ children } : {children: React.ReactNode}) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}
