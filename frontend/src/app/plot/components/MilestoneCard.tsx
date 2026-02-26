import { Flex, Steps, ConfigProvider } from "antd"
import type { StepsProps } from "antd"

const items = [
  { title: "Token", content: "Completed" },
  { title: "ATS", content: "Completed" },
  { title: "Registry", content: "Pending" },
]

const sharedProps: StepsProps = {
  type: "dot",
  current: 1,
  items,
}

const MilestoneCard = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#D4A22A", 
        },
      }}
    >
      <div className="bg-white px-9 py-6 rounded-xl border border-gray-400">
        <div className="flex flex-col gap-9">
          <span className="text-gray-700 font-extrabold">
            Transaction Milestones
          </span>

          <Flex vertical gap="middle">
            <Steps {...sharedProps}/>
          </Flex>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default MilestoneCard

