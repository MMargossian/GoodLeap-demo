"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ActionItemCardProps {
  stage: string;
  actionText: string;
  projectCount: number;
  riskLevel: "high" | "medium" | "low";
}

const riskStyles = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const riskLabels = {
  high: "HIGH RISK",
  medium: "MEDIUM RISK",
  low: "LOW RISK",
};

export function ActionItemCard({
  stage,
  actionText,
  projectCount,
  riskLevel,
}: ActionItemCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {stage}
      </p>
      <div className="flex items-center gap-2">
        <Badge className="bg-primary/10 text-primary border-transparent text-xs">
          {projectCount} Projects
        </Badge>
        <Badge
          className={`border-transparent text-xs ${riskStyles[riskLevel]}`}
        >
          {riskLabels[riskLevel]}
        </Badge>
      </div>
      <p className="text-sm font-medium text-gray-800">{actionText}</p>
      <button className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
        View Projects
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
