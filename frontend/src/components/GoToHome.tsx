// components/GoToHome.tsx
import Link from "next/link"
// handles go to home functionality
const GoToHome = () => {
  return (
    <div className="buttons">
        <Link href="/">
          <span className="borderAmber border-2 p-4 font-bold backgroundAmberHover hover:text-white transition">Go to Home</span>
        </Link>
      </div>
  )
}

export default GoToHome
