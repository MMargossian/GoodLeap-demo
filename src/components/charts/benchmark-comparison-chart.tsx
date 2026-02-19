"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const benchmarkData = [
  { metric: "Conversion Rate", contractor: 22, peer: 18, unit: "%", max: 50, lowerIsBetter: false },
  { metric: "Pull-Through Rate", contractor: 40.2, peer: 35, unit: "%", max: 60, lowerIsBetter: false },
  { metric: "Referral Conv.", contractor: 38.9, peer: 25.0, unit: "%", max: 50, lowerIsBetter: false },
  { metric: "Repeat Customers", contractor: 42, peer: 30, unit: "%", max: 60, lowerIsBetter: false },
  { metric: "Upsell Rate", contractor: 28, peer: 20, unit: "%", max: 40, lowerIsBetter: false },
  { metric: "Avg Sales Cycle", contractor: 34, peer: 42, unit: "days", max: 60, lowerIsBetter: true },
  { metric: "Target Attainment", contractor: 95.2, peer: 88, unit: "%", max: 100, lowerIsBetter: false },
];

function isOutperforming(item: (typeof benchmarkData)[number]): boolean {
  if (item.lowerIsBetter) {
    return item.contractor < item.peer;
  }
  return item.contractor > item.peer;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const item = benchmarkData.find((d) => d.metric === label);
  const unit = item?.unit ?? "";
  const outperforming = item ? isOutperforming(item) : true;

  return (
    <div
      className="rounded-xl border border-purple-100 bg-white/95 p-3 shadow-lg backdrop-blur-sm"
      style={{ animation: "tooltipFadeIn 0.2s ease-out" }}
    >
      <div className="mb-1 flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <span className="text-xs">
          {item?.lowerIsBetter ? "(lower is better)" : "(higher is better)"}
        </span>
      </div>
      {payload.map((entry) => {
        const isContractor = entry.name === "EverGreen Climate";
        const color = isContractor
          ? outperforming
            ? "#16a34a"
            : "#d97706"
          : "#9ca3af";
        return (
          <p key={entry.name} className="text-sm font-medium" style={{ color }}>
            {entry.name}:{" "}
            {unit === "$K"
              ? `$${(entry.value * 1000).toLocaleString()}`
              : `${entry.value}${unit === "days" ? ` ${unit}` : unit}`}
          </p>
        );
      })}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MetricTick(props: any) {
  const { x, y, payload } = props;
  const item = benchmarkData.find((d) => d.metric === payload.value);
  const outperforming = item ? isOutperforming(item) : true;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-8}
        y={0}
        dy={4}
        textAnchor="end"
        fill="#374151"
        fontSize={12}
      >
        {payload.value}
      </text>
      <text
        x={-4}
        y={0}
        dy={4}
        textAnchor="start"
        fill={outperforming ? "#16a34a" : "#d97706"}
        fontSize={11}
      >
        {outperforming ? "\u25B2" : "\u25BC"}
      </text>
    </g>
  );
}

interface BenchmarkComparisonChartProps {
  data?: { metric: string; contractor: number; peer: number; unit: string; max: number; lowerIsBetter: boolean }[];
}

export function BenchmarkComparisonChart({ data }: BenchmarkComparisonChartProps) {
  const chartData = data ?? benchmarkData;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
        <defs>
          <linearGradient id="benchGreenGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#16a34a" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="benchAmberGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d97706" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="benchPeerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d1d5db" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#9ca3af" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" horizontal={false} />
        <YAxis
          type="category"
          dataKey="metric"
          width={150}
          tick={<MetricTick />}
        />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(124, 58, 237, 0.05)" }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: 12 }}
          formatter={(value: string) => (
            <span className="text-sm font-medium text-gray-600">{value}</span>
          )}
        />
        <Bar
          dataKey="contractor"
          name="EverGreen Climate"
          radius={[0, 6, 6, 0]}
          barSize={14}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
        >
          {chartData.map((item, index) => (
            <Cell
              key={index}
              fill={isOutperforming(item) ? "url(#benchGreenGrad)" : "url(#benchAmberGrad)"}
            />
          ))}
        </Bar>
        <Bar
          dataKey="peer"
          name="Peer Average"
          fill="url(#benchPeerGrad)"
          radius={[0, 6, 6, 0]}
          barSize={14}
          isAnimationActive={true}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
