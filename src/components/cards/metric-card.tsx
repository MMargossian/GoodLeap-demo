"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  icon?: LucideIcon;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  trend,
  subtitle,
  icon: Icon,
}: MetricCardProps) {
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  const isDollar = typeof value === "string" && value.startsWith("$");
  const isPercent = typeof value === "string" && value.endsWith("%");
  const canAnimate = !isNaN(numericValue);

  return (
    <Card className="card-hover relative overflow-hidden">
      <CardContent className="p-6 pt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">{title}</p>
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-3xl font-bold tracking-tight">
            {canAnimate ? (
              <AnimatedNumber
                value={numericValue}
                format={isDollar ? "dollar" : isPercent ? "percent" : "plain"}
              />
            ) : (
              value
            )}
          </p>
          {trend !== undefined && (
            <span
              className={`flex items-center text-sm font-semibold ${
                trend >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trend >= 0 ? (
                <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="mr-0.5 h-3.5 w-3.5" />
              )}
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1.5 text-xs tracking-wide text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
