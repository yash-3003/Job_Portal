/* eslint-disable react/prop-types */
"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

// eslint-disable-next-line react/prop-types
export default function JobRecommendationsBarChart({ data, activeIndex, setActiveIndex }) {
  // Sort data by percentage in descending order
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage)

  // Format data for the bar chart
  const chartData = sortedData.map((item) => ({
    role: item.role,
    percentage: item.percentage,
    fill: item.color,
    // Shorten long role names for better display on the X-axis
    shortRole: item.role.length > 20 ? item.role.substring(0, 17) + "..." : item.role,
  }))

  return (
    <ChartContainer
      config={{
        percentage: {
          label: "Percentage",
        },
        ...Object.fromEntries(
          // eslint-disable-next-line react/prop-types
          data.map((item) => [
            item.role.toLowerCase().replace(/\s+/g, "_"),
            {
              label: item.role,
              color: item.color,
            },
          ]),
        ),
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={(data) => {
            // eslint-disable-next-line react/prop-types
            if (data && data.activeTooltipIndex !== undefined) {
              // eslint-disable-next-line react/prop-types
              setActiveIndex(data.activeIndex !== undefined ? data.activeIndex : data.activeTooltipIndex)
            }
          }}
        >
          <XAxis type="number" domain={[0, "dataMax"]} tickFormatter={(value) => `${value}%`} />
          <YAxis type="category" dataKey="shortRole" width={120} tick={{ fontSize: 12 }} />
          <ChartTooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} content={<ChartTooltipContent />} />
          <Bar
            dataKey="percentage"
            radius={[0, 4, 4, 0]}
            onMouseEnter={(_, index) => setActiveIndex(data.findIndex((item) => item.role === sortedData[index].role))}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                stroke={data.findIndex((item) => item.role === entry.role) === activeIndex ? "black" : entry.fill}
                strokeWidth={data.findIndex((item) => item.role === entry.role) === activeIndex ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
