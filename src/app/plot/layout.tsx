import Navbar from "@/components/Navbar"

export default function PlotPage({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
