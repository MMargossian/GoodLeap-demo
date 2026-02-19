"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const touchpointData = [
  { touchpoint: "Application & Sales", recommend: 72, neutral: 20, not_recommend: 8 },
  { touchpoint: "Installation", recommend: 48, neutral: 35, not_recommend: 17 },
  { touchpoint: "Post-Funding", recommend: 55, neutral: 38, not_recommend: 7 },
];

const gradientColors = {
  recommend: { from: "#10B981", to: "#059669" },
  neutral: { from: "#FBBF24", to: "#F59E0B" },
  not_recommend: { from: "#F87171", to: "#EF4444" },
};

function ProgressBar({
  label,
  value,
  gradientId,
  delay,
}: {
  label: string;
  value: number;
  gradientId: string;
  delay: number;
}) {
  return (
    <div className="group space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-3 rounded-full transition-all duration-300 group-hover:brightness-110"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, var(--grad-from), var(--grad-to))`,
            ["--grad-from" as string]: gradientColors[gradientId as keyof typeof gradientColors].from,
            ["--grad-to" as string]: gradientColors[gradientId as keyof typeof gradientColors].to,
            boxShadow: `0 1px 4px ${gradientColors[gradientId as keyof typeof gradientColors].from}40`,
            animation: `progressGrow 1s ease-out ${delay}ms both`,
          }}
        />
      </div>
    </div>
  );
}

interface RecommendationBreakdownProps {
  data?: { touchpoint: string; recommend: number; neutral: number; not_recommend: number }[];
}

export function RecommendationBreakdown({ data }: RecommendationBreakdownProps) {
  const chartData = data ?? touchpointData;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {chartData.map((item, cardIndex) => (
        <Card
          key={item.touchpoint}
          className="shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              {item.touchpoint}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProgressBar
              label="Recommend"
              value={item.recommend}
              gradientId="recommend"
              delay={cardIndex * 150}
            />
            <ProgressBar
              label="Neutral"
              value={item.neutral}
              gradientId="neutral"
              delay={cardIndex * 150 + 100}
            />
            <ProgressBar
              label="Not Recommend"
              value={item.not_recommend}
              gradientId="not_recommend"
              delay={cardIndex * 150 + 200}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
