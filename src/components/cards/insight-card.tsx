"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, type LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  content: string;
  type?: "info" | "success" | "warning" | "danger";
  icon?: LucideIcon;
  delay?: number;
}

const typeStyles = {
  info: {
    border: "border-l-primary",
    bg: "bg-secondary",
    iconColor: "text-primary",
  },
  success: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  warning: {
    border: "border-l-amber-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  danger: {
    border: "border-l-red-500",
    bg: "bg-red-50",
    iconColor: "text-red-600",
  },
};

export function InsightCard({
  title,
  content,
  type = "info",
  icon: Icon = Lightbulb,
}: InsightCardProps) {
  const styles = typeStyles[type];

  return (
    <Card className={`border-l-4 ${styles.border} ${styles.bg} shadow-sm`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${styles.iconColor}`} />
          <p className="text-sm font-semibold">{title}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}
