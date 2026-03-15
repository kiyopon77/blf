import Navbar from "@/components/Navbar"

export default function EditPlotPage({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
