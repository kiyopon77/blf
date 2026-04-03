// app/plot/[plotId]/layout.tsx
import Navbar from "@/components/Navbar"

// handles plot page functionality
export default function PlotPage({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}
