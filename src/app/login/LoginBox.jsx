const LoginBox = () => {
  return (
    <div className="flex flex-col bg-white p-9 items-start w-xl gap-3 shadow-gray-200 shadow-xl border-2 border-gray-200 rounded-2xl">
      <span className="font-bold text-3xl">Log In</span>

      <div className="w-full flex flex-col items-start">
        <span className="mb-1 text-left ">Email</span>
        <input
          placeholder="Email"
          type="email"
          className="p-3 border-2 border-gray-300 w-full rounded-sm"
        />
      </div>

      <div className="w-full flex flex-col items-start">
        <span className="mb-1 text-left">Password</span>
        <input
          type="password"
          placeholder="Password"
          className="p-3 border-2 border-gray-300 w-full rounded-sm"
        />
      </div>

      <button className="w-full p-4 backgroundAmber text-white font-extrabold">
        Login
      </button>
    </div>
  )
}

export default LoginBox

