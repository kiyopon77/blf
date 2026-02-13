import Link from "next/link"

const NotFound = () => {
  return (
    <div className="w-screen h-screen gap-8 flex flex-col justify-center items-center">
      <div className="heading text-7xl font-bold">
        404 | Page Not Found
      </div>

      <div className="text-xl text-gray-500">
        The page you are trying to access does not exist, has been moved,
        or requires additional permissions.
      </div>

      <div className="buttons">
        <Link href="/">
          <span className="borderAmber border-2 p-4 font-bold backgroundAmberHover hover:text-white transition">Go to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
