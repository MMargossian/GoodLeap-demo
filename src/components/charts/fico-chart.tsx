"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ficoData = [
  { range: "Below 650", probability: 45 },
  { range: "650 - 700", probability: 72 },
  { range: "Above 700", probability: 85 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-100 bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur-sm">
      <p className="mb-1 font-semibold text-gray-700">FICO {label}</p>
      <p className="text-lg font-bold text-primary">
        {payload[0].value}% Approval
      </p>
    </div>
  );
}

export function FicoChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={ficoData}
        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="ficoPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="range" tick={{ fontSize: 12 }} />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(124, 58, 237, 0.05)" }}
        />
        <Bar
          dataKey="probability"
          radius={[6, 6, 0, 0]}
          fill="url(#ficoPurple)"
          isAnimationActive={false}
          label={{
            position: "top",
            fontSize: 12,
            fontWeight: 600,
            formatter: (v) => `${v}%`,
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
