// app/login/LoginBox.tsx
"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { ThreeDot } from "react-loading-indicators"

// handles login box functionality
const LoginBox = () => {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const resolvedRole = await login(email, password)  // use returned role
      if (resolvedRole == "admin") {
        router.push("/society")
      } else {
        router.push("/rmdashboard")
      }
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white p-9 items-start w-xl gap-3 shadow-xl border-2 border-gray-200 rounded-2xl"
    >
      <span className="font-bold text-3xl">Log In</span>

      <div className="w-full flex flex-col items-start">
        <span className="mb-1 text-left">Email</span>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border-2 border-gray-300 w-full rounded-sm"
          required
        />
      </div>

      <div className="w-full flex flex-col items-start">
        <span className="mb-1 text-left">Password</span>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border-2 border-gray-300 w-full rounded-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full p-4 backgroundAmber text-white font-extrabold flex items-center justify-center min-h-[56px]"
      >
        {loading ? (
          <div style={{ transform: "scale(0.5)", margin: "-10px 0" }}>
            <ThreeDot color="currentColor" size="small" text="" textColor="" />
          </div>
        ) : (
          "Login"
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </form>
  )
}

export default LoginBox
