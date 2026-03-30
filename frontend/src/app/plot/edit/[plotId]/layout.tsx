import Navbar from "@/components/Navbar"
import { App } from "antd"

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
