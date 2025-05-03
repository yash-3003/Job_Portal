/* eslint-disable react/prop-types */
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts"
import { ChartContainer } from "./ui/chart"

// Custom active shape component for the pie chart
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

  return (
    <g>
      <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill={fill} className="text-lg font-medium">
        {payload.role}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {`${value.toFixed(1)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 15}
        outerRadius={outerRadius + 18}
        fill={fill}
      />
    </g>
  )
}

export default function JobRecommendationsPieChart({ data, activeIndex, setActiveIndex }) {
  // Format data for the pie chart
  const chartData = data.map((item) => ({
    role: item.role,
    value: item.percentage,
    fill: item.color,
  }))

  return (
    <ChartContainer
      config={{
        ...Object.fromEntries(
          data.map((item) => [
            item.role.toLowerCase().replace(/\s+/g, "_"),
            {
              label: item.role,
              color: item.color,
            },
          ])
        ),
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onClick={(_, index) => setActiveIndex(index)}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
