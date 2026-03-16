import { Flex, Steps, ConfigProvider } from "antd"
import type { StepsProps } from "antd"

type Payment = {
  milestone: string
  status: string
}

const milestoneTimeline = [
  "TOKEN",
  "ATS",
  "SUPERSTRUCTURE",
  "PROPERTY_ID",
  "REGISTRY",
  "POSSESSION",
]

const formatMilestone = (m: string) =>
  m
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bAts\b/g, "ATS")
    .replace(/\bId\b/g, "ID")

const MilestoneCard = ({ payments = [] }: { payments?: Payment[] }) => {

  const items: StepsProps["items"] = milestoneTimeline.map(m => {

    const payment = payments.find(p => p.milestone === m)

    return {
      title: formatMilestone(m),
      content: (
        <span
          className={
            payment?.status === "DONE"
              ? "text-green-600 font-bold"
              : payment?.status === "PENDING"
                ? "text-red-500 font-semibold"
                : "text-gray-400"
          }
        >
          {payment ? payment.status : "PENDING"}
        </span>
      )
    }
  })

  const current = milestoneTimeline.findIndex(m => {
    const payment = payments.find(p => p.milestone === m)
    return !payment || payment.status !== "DONE"
  })

  const safeCurrent = current === -1 ? milestoneTimeline.length - 1 : current
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#D4A22A" }
      }}
    >
      <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">

        <div className="flex flex-col gap-9">

          <span className="text-gray-700 font-extrabold">
            Transaction Milestones
          </span>

          <Flex vertical gap="middle">
            <Steps
              type="dot"
              items={items}
              current={safeCurrent}
            />
          </Flex>

        </div>

      </div>
    </ConfigProvider>
  )
}

export default MilestoneCard
