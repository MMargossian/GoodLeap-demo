"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  CheckCircle,
  Send,
  PenTool,
  Hammer,
  Wrench,
  DollarSign,
} from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

const stageTimeData = [
  { stage: "SUBMITTED", contractor: 2.1, similar: 2.5, icon: FileText },
  { stage: "APPROVED", contractor: 3.4, similar: 4.2, icon: CheckCircle },
  { stage: "DOCS SENT", contractor: 1.8, similar: 2.0, icon: Send },
  { stage: "CONTRACT\nSIGNED", contractor: 4.5, similar: 3.8, icon: PenTool },
  { stage: "NOTICE TO\nPROCEED", contractor: 6.2, similar: 5.0, icon: Hammer },
  { stage: "INSTALL\nCOMPLETE", contractor: 18.5, similar: 15.0, icon: Wrench },
  { stage: "FUNDED", contractor: 3.2, similar: 3.5, icon: DollarSign },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-white px-4 py-3 shadow-lg">
      <p className="mb-1.5 text-sm font-semibold text-gray-800">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          <span className="font-medium">{entry.name}:</span> {entry.value} days
        </p>
      ))}
    </div>
  );
}

/* Custom tick that renders an icon below the stage label */
function CustomXAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string; index?: number };
}) {
  if (!payload || x === undefined || y === undefined) return null;
  const entry = stageTimeData.find((d) => d.stage === payload.value);
  const Icon = entry?.icon;
  const lines = payload.value.split("\n");

  /* Render the lucide icon as an inline SVG via renderToStaticMarkup */
  let iconMarkup = "";
  if (Icon) {
    iconMarkup = renderToStaticMarkup(
      <Icon size={14} color="#7C3AED" strokeWidth={2} />
    );
  }

  return (
    <g transform={`translate(${x},${y + 4})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={i * 12}
          textAnchor="middle"
          fill="#6b7280"
          fontSize={9}
          fontWeight={600}
        >
          {line}
        </text>
      ))}
      {Icon && (
        <foreignObject
          x={-7}
          y={lines.length * 12 + 2}
          width={14}
          height={14}
        >
          <div
            dangerouslySetInnerHTML={{ __html: iconMarkup }}
            style={{ display: "flex", justifyContent: "center" }}
          />
        </foreignObject>
      )}
    </g>
  );
}

interface StageTimeChartProps {
  data?: { stage: string; contractor: number; similar: number }[];
}

export function StageTimeChart({ data }: StageTimeChartProps) {
  const chartData = data
    ? data.map((d) => {
        const existing = stageTimeData.find((s) => s.stage === d.stage);
        return { ...d, icon: existing?.icon || FileText };
      })
    : stageTimeData;

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-primary" />
          <span className="text-xs font-medium text-gray-600">EVERGREEN CLIMATE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-primary/30" />
          <span className="text-xs font-medium text-gray-600">SIMILAR CONTRACTOR</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="stage"
            tick={CustomXAxisTick as never}
            height={60}
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(124, 58, 237, 0.05)" }}
          />
          <Bar
            dataKey="contractor"
            name="Evergreen Climate"
            fill="#7C3AED"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="similar"
            name="Similar Contractor"
            fill="#D8CCE8"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
