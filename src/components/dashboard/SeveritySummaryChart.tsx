
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const severityData = [
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "High", value: 27, color: "#f97316" },
  { name: "Medium", value: 43, color: "#eab308" },
  { name: "Low", value: 38, color: "#22c55e" },
  { name: "Info", value: 20, color: "#3b82f6" },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-sm">
          Count: <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const SeveritySummaryChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={severityData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {severityData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {severityData.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeveritySummaryChart;
