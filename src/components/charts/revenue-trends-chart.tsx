"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Period = "weekly" | "monthly" | "quarterly" | "yearly";

const weeklyData = [
  { label: "W1", revenue: 38000 },
  { label: "W2", revenue: 42000 },
  { label: "W3", revenue: 35000 },
  { label: "W4", revenue: 47000 },
  { label: "W5", revenue: 51000 },
  { label: "W6", revenue: 44000 },
  { label: "W7", revenue: 39000 },
  { label: "W8", revenue: 55000 },
  { label: "W9", revenue: 48000 },
  { label: "W10", revenue: 60000 },
  { label: "W11", revenue: 53000 },
  { label: "W12", revenue: 57000 },
];

const monthlyData = [
  { label: "Jan", revenue: 165000 },
  { label: "Feb", revenue: 178000 },
  { label: "Mar", revenue: 195000 },
  { label: "Apr", revenue: 210000 },
  { label: "May", revenue: 225000 },
  { label: "Jun", revenue: 238000 },
  { label: "Jul", revenue: 215000 },
  { label: "Aug", revenue: 198000 },
  { label: "Sep", revenue: 220000 },
  { label: "Oct", revenue: 245000 },
  { label: "Nov", revenue: 230000 },
  { label: "Dec", revenue: 156700 },
];

const quarterlyData = [
  { label: "Q1", revenue: 538000 },
  { label: "Q2", revenue: 673000 },
  { label: "Q3", revenue: 633000 },
  { label: "Q4", revenue: 631700 },
];

const yearlyData = [
  { label: "2023", revenue: 2120000 },
  { label: "2024", revenue: 2310000 },
  { label: "2025", revenue: 2475700 },
];

const dataByPeriod: Record<Period, typeof monthlyData> = {
  weekly: weeklyData,
  monthly: monthlyData,
  quarterly: quarterlyData,
  yearly: yearlyData,
};

const formatDollar = (value: number) =>
  `$${(value / 1000).toFixed(0)}K`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-purple-100 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur-sm"
      style={{
        animation: "tooltipFadeIn 0.2s ease-out",
      }}
    >
      <p className="mb-1 font-semibold text-gray-700">{label}</p>
      <p className="text-lg font-bold text-chart-1">
        ${Number(payload[0].value).toLocaleString()}
      </p>
      <div
        className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-purple-100 bg-white/95"
      />
    </div>
  );
}

interface RevenueTrendsChartProps {
  period?: Period;
  data?: { label: string; revenue: number }[];
}

export function RevenueTrendsChart({ period = "monthly", data: dataProp }: RevenueTrendsChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = dataProp ?? dataByPeriod[period];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="revenueTrendsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
            <stop offset="100%" stopColor="#6B3FA0" stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="revenueTrendsHoverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
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
          cursor={{ fill: "rgba(124, 58, 237, 0.05)" }}
        />
        <Bar
          dataKey="revenue"
          fill="url(#revenueTrendsGradient)"
          radius={[6, 6, 0, 0]}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          shape={(props: any) => {
            const { x, y, width, height, index } = props;
            const isActive = index === activeIndex;
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={6}
                ry={6}
                fill={isActive ? "url(#revenueTrendsHoverGradient)" : "url(#revenueTrendsGradient)"}
                style={{
                  filter: isActive ? "drop-shadow(0 4px 8px rgba(124, 58, 237, 0.3))" : "none",
                  transition: "filter 0.2s ease",
                }}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
