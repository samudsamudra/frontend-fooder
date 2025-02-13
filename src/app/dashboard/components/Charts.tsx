import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  date: string;
  totalRevenue: number;
  totalOrders: number;
}

interface ChartProps {
  data: ChartData[];
}

export const RevenueChart = ({ data }: ChartProps) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      <Area
        type="monotone"
        dataKey="totalRevenue"
        stroke="#8884d8"
        fillOpacity={1}
        fill="url(#colorTotal)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const OutstandingChart = ({ data }: ChartProps) => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      <Line
        type="monotone"
        dataKey="totalOrders"
        stroke="#ff7300"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
);
