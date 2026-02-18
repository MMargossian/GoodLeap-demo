"use client";

import { useAIInsights } from "@/hooks/useAIInsights";
import { AIInsightCard } from "@/components/cards/ai-insight-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface AIInsightsSectionProps {
  section: string;
}

export function AIInsightsSection({ section }: AIInsightsSectionProps) {
  const { insights, isRefreshing, refresh } = useAIInsights(section);
  const { toast } = useToast();

  const handleRefresh = async () => {
    const result = await refresh();
    if (result?.message) {
      toast(result.message, 4000);
    }
    if (result?.source === "ai") {
      toast("Insights refreshed with AI", 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            AI-Powered Insights
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 text-violet-600 border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        >
          {isRefreshing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          <Sparkles className="h-3 w-3" />
          {isRefreshing ? "Generating..." : "Refresh with AI"}
        </Button>
      </div>

      {/* Insights Grid */}
      {isRefreshing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: insights.length || 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border p-5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 gap-4 ${
            insights.length === 2
              ? "lg:grid-cols-2"
              : "lg:grid-cols-3"
          }`}
        >
          {insights.map((insight, index) => (
            <AIInsightCard
              key={`${insight.insight_type}-${index}`}
              insightType={insight.insight_type}
              title={insight.title}
              content={insight.content}
            />
          ))}
        </div>
      )}
    </div>
  );
}
