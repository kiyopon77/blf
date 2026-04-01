// app/plot/edit/[plotId]/layout.tsx
import Navbar from "@/components/Navbar"
import { App } from "antd"

// handles edit plot page functionality
export default function EditPlotPage({ children } : {children: React.ReactNode}) {
  return (
    <div>
      <Navbar />
    <App>
      {children}
    </App>
    </div>
  )
}
