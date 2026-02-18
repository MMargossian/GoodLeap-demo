"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const departmentData = [
  { department: "West Coast", revenue: 520000 },
  { department: "Northeast", revenue: 420000 },
  { department: "Southeast", revenue: 380000 },
  { department: "Midwest", revenue: 310000 },
  { department: "Southwest", revenue: 285000 },
  { department: "Pacific NW", revenue: 195000 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border border-purple-100 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur-sm"
      style={{ animation: "tooltipFadeIn 0.2s ease-out" }}
    >
      <p className="mb-1 font-semibold text-gray-700">{label}</p>
      <p className="text-lg font-bold text-chart-1">
        ${Number(payload[0].value).toLocaleString()}
      </p>
    </div>
  );
}

export function DepartmentBarChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={departmentData} layout="vertical">
        <defs>
          <linearGradient id="deptGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6B3FA0" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="deptHoverGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}K`}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="department"
          width={100}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(124, 58, 237, 0.05)" }}
        />
        <Bar
          dataKey="revenue"
          fill="url(#deptGradient)"
          radius={[0, 6, 6, 0]}
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
                fill={isActive ? "url(#deptHoverGradient)" : "url(#deptGradient)"}
                style={{
                  filter: isActive ? "drop-shadow(0 2px 6px rgba(124, 58, 237, 0.3))" : "none",
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
