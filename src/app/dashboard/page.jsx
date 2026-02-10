import Card from "./Card"

const cards = [
  {
    heading: "total plots",
    value: 1234,
    icon: "icons/totalPlots.svg",
  },
  {
    heading: "available",
    value: 1234,
    icon: "icons/available.svg",
  },
  {
    heading: "sold",
    value: 1234,
    icon: "icons/sold.svg",
  },
  {
    heading: "on hold",
    value: 1234,
    icon: "icons/onHold.svg",
  },
  {
    heading: "cancelled",
    value: 1234,
    icon: "icons/cancelled.svg",
  },
];

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-5 p-10 gap-8">
        {cards.map((card, index) => (
          <Card
            key={index}
            heading={card.heading}
            value={card.value}
            icon={card.icon}
          />
    ))}
      </div>
    </div>
  )
}

export default Dashboard
