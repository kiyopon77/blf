const UserHeader = ({ onCreate }: any) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-gray-500">Manage system users and their roles</p>
      </div>
      <button
        className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md"
        onClick={onCreate}
      >
        + Create User
      </button>
    </div>
  )
}

export default UserHeader
