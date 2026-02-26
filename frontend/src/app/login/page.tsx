import React from "react"
import Image from "next/image"
import LoginBox from "./LoginBox"

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col gap-5 justify-center items-center text-center">
      <div>
        <Image src="/images/logo.svg" width={300} height={300} alt="BLF Logo" />
      </div>
      <div className="mt-4">
        <span className="text-4xl font-bold">
          BLF Inventory Management
        </span>
      </div>
    <div>
   <LoginBox /> 
    </div>
    </div>
  )
}

export default Login

