
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const activityData = [
  { date: "Jan", reports: 18, vulnerabilities: 24 },
  { date: "Feb", reports: 23, vulnerabilities: 31 },
  { date: "Mar", reports: 27, vulnerabilities: 36 },
  { date: "Apr", reports: 15, vulnerabilities: 21 },
  { date: "May", reports: 32, vulnerabilities: 47 },
  { date: "Jun", reports: 29, vulnerabilities: 38 },
  { date: "Jul", reports: 36, vulnerabilities: 51 },
  { date: "Aug", reports: 42, vulnerabilities: 63 },
  { date: "Sep", reports: 38, vulnerabilities: 55 },
  { date: "Oct", reports: 45, vulnerabilities: 61 },
  { date: "Nov", reports: 40, vulnerabilities: 54 },
  { date: "Dec", reports: 36, vulnerabilities: 48 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-blue-600">
          Reports: <span className="font-medium">{payload[0].value}</span>
        </p>
        <p className="text-sm text-red-500">
          Vulnerabilities: <span className="font-medium">{payload[1].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

const ReportActivityChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={activityData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="reports"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="vulnerabilities"
            stackId="2"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportActivityChart;
