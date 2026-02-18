"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, type LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  heading: string;
  content: string;
  icon?: LucideIcon;
  variant?: "recommendation" | "opportunity";
  delay?: number;
}

export function RecommendationCard({
  title,
  heading,
  content,
  icon: Icon = Sparkles,
  variant = "recommendation",
}: RecommendationCardProps) {
  const isRecommendation = variant === "recommendation";

  return (
    <Card
      className={`border-0 shadow-sm overflow-hidden relative ${
        isRecommendation
          ? "bg-gradient-to-br from-primary via-chart-1 to-[#5B21B6]"
          : "bg-secondary"
      }`}
    >
      <CardContent className="p-6 relative">
        <Icon
          className={`h-6 w-6 ${
            isRecommendation ? "text-white/80" : "text-primary"
          }`}
        />
        <p
          className={`mt-3 text-xs font-medium uppercase tracking-wider ${
            isRecommendation ? "text-white/70" : "text-primary"
          }`}
        >
          {title}
        </p>
        <p
          className={`mt-1 text-lg font-bold tracking-tight ${
            isRecommendation ? "text-white" : "text-[#1a1a2e]"
          }`}
        >
          {heading}
        </p>
        <p
          className={`mt-2 text-sm leading-relaxed ${
            isRecommendation ? "text-white/80" : "text-muted-foreground"
          }`}
        >
          {content}
        </p>
      </CardContent>
    </Card>
  );
}
