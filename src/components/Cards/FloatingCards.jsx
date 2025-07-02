import React from 'react'

const FloatingCards = () => {
  const cards = [
    {
      title: "ISS Location",
      value: "Loading...",
      unit: "Live",
      position: "top-20 left-10",
      color: "bg-purple-100 border-purple-200"
    },
    {
      title: "Next Launch",
      value: "SpaceX",
      unit: "3 days",
      position: "top-32 right-20",
      color: "bg-blue-100 border-blue-200"
    },
    {
      title: "Mars Weather",
      value: "-80°C",
      unit: "Sol 1234",
      position: "bottom-40 left-20",
      color: "bg-orange-100 border-orange-200"
    },
    {
      title: "Satellites",
      value: "2,847",
      unit: "Active",
      position: "bottom-20 right-10",
      color: "bg-green-100 border-green-200"
    }
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`absolute ${card.position} ${card.color} p-4 rounded-xl border backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300 pointer-events-auto`}
          style={{
            animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
            animationDelay: `${index * 0.2}s`
          }}
        >
          <div className="text-xs font-medium text-gray-500">{card.title}</div>
          <div className="text-lg font-bold text-gray-900">{card.value}</div>
          <div className="text-xs text-gray-500">{card.unit}</div>
        </div>
      ))}
    </div>
  )
}

export default FloatingCards
