"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const productData = [
  { category: "Home Improvement", count: 55, color: "#7C3AED" },
  { category: "Roofing", count: 48, color: "#2563EB" },
  { category: "Home Remodel", count: 37, color: "#0891B2" },
  { category: "Solar Panel", count: 28, color: "#16a34a" },
  { category: "HVAC", count: 19, color: "#D97706" },
  { category: "Battery Storage", count: 12, color: "#DC2626" },
];

const gradientConfigs = [
  { id: "productGrad0", start: "#8B5CF6", end: "#7C3AED" },
  { id: "productGrad1", start: "#3B82F6", end: "#2563EB" },
  { id: "productGrad2", start: "#06B6D4", end: "#0891B2" },
  { id: "productGrad3", start: "#22c55e", end: "#16a34a" },
  { id: "productGrad4", start: "#F59E0B", end: "#D97706" },
  { id: "productGrad5", start: "#EF4444", end: "#DC2626" },
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
      <p className="text-lg font-bold text-chart-1">{payload[0].value} projects</p>
    </div>
  );
}

export function ProductMixChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={productData} layout="vertical">
        <defs>
          {gradientConfigs.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={g.start} stopOpacity={0.85} />
              <stop offset="100%" stopColor={g.end} stopOpacity={1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="category"
          width={130}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(124, 58, 237, 0.05)" }}
        />
        <Bar
          dataKey="count"
          radius={[0, 6, 6, 0]}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {productData.map((_, index) => (
            <Cell key={index} fill={`url(#${gradientConfigs[index].id})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
