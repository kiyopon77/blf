// app/not-found.tsx
import GoToHome from "@/components/GoToHome"

// handles not found functionality
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

     <GoToHome /> 
    </div>
  )
}

export default NotFound
