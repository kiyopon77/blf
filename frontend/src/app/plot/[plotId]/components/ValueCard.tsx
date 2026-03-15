const ValueCard = ({
  value,
  date
}: {
  value?: number
  date?: string
}) => {

  const formatted =
    value?.toLocaleString("en-IN")

  return (
    <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">

      <div className="flex flex-col gap-9">

        <span className="text-gray-700 font-extrabold">
          Plot & Value
        </span>

        <div className="flex justify-between">

          <div className="flex flex-col">

            <span className="text-gray-600">
              Plot Value
            </span>

            <span className="font-extrabold text-4xl">
              ₹ {formatted ?? "—"}
            </span>

          </div>

          <div className="flex flex-col items-end">

            <span className="text-gray-600 text-sm">
              Selling Date
            </span>

            <span className="text-lg">
              {date
                ? new Date(date).toLocaleDateString()
                : "—"}
            </span>

          </div>

        </div>

      </div>

    </div>
  )
}
export default ValueCard
