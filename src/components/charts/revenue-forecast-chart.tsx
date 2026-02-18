"use client";

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const forecastData = [
  { month: "Jan", actual: 165000, forecast: null },
  { month: "Feb", actual: 178000, forecast: null },
  { month: "Mar", actual: 195000, forecast: null },
  { month: "Apr", actual: 210000, forecast: null },
  { month: "May", actual: 225000, forecast: null },
  { month: "Jun", actual: 238000, forecast: null },
  { month: "Jul", actual: 215000, forecast: null },
  { month: "Aug", actual: 198000, forecast: null },
  { month: "Sep", actual: 220000, forecast: 220000 },
  { month: "Oct", actual: 245000, forecast: 240000 },
  { month: "Nov", actual: 230000, forecast: 235000 },
  { month: "Dec", actual: 156700, forecast: 220000 },
];

const formatDollar = (value: number) =>
  `$${(value / 1000).toFixed(0)}K`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-purple-100 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur-sm"
      style={{ animation: "tooltipFadeIn 0.2s ease-out" }}
    >
      <p className="mb-1 font-semibold text-gray-700">{label}</p>
      {payload.map((entry: { name: string; value: number; color: string }) => (
        <p key={entry.name} className="font-medium" style={{ color: entry.color }}>
          {entry.name}: ${Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function RevenueForecastChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={forecastData}>
        <defs>
          <linearGradient id="actualAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="forecastAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C4B5D4" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#C4B5D4" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={formatDollar}
          tick={{ fontSize: 12 }}
          label={{
            value: "Revenue ($)",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 12, fill: "#64748b" },
            offset: 0,
          }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: "rgba(124, 58, 237, 0.15)", strokeWidth: 1 }}
        />
        <Legend verticalAlign="bottom" />
        <Area
          type="monotone"
          dataKey="actual"
          name="Actual"
          fill="url(#actualAreaGradient)"
          stroke="transparent"
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
          connectNulls={false}
        />
        <Area
          type="monotone"
          dataKey="forecast"
          name="Forecast Area"
          fill="url(#forecastAreaGradient)"
          stroke="transparent"
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
          connectNulls={false}
          legendType="none"
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke="#6B3FA0"
          strokeWidth={3}
          dot={{ r: 4, fill: "#6B3FA0", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6, fill: "#7C3AED", strokeWidth: 2, stroke: "#fff" }}
          connectNulls={false}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
          legendType="none"
        />
        <Line
          type="monotone"
          dataKey="forecast"
          name="Forecast"
          stroke="#C4B5D4"
          strokeWidth={3}
          strokeDasharray="8 4"
          dot={{ r: 4, fill: "#C4B5D4", strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6, fill: "#A78BCC", strokeWidth: 2, stroke: "#fff" }}
          connectNulls={false}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
