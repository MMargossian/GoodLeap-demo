"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { FALLBACK_INSIGHTS } from "@/lib/fallback-insights";

export interface AIInsight {
  insight_type: string;
  title: string;
  content: string;
}

export function useAIInsights(section: string, metrics?: Record<string, unknown>) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;
  const hasFetchedRef = useRef(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          metrics: metricsRef.current || {},
        }),
      });

      const data = await response.json();

      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      }

      return {
        source: data.source as string,
        message: data.message as string | undefined,
      };
    } catch (error) {
      console.error("Failed to refresh AI insights:", error);
      setInsights(FALLBACK_INSIGHTS[section] || FALLBACK_INSIGHTS.sales);
      return {
        source: "fallback",
        message: "Failed to connect to AI service.",
      };
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [section]);

  // Auto-fetch on mount
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      refresh();
    }
  }, [refresh]);

  const getInsightByType = useCallback(
    (type: string) => {
      return insights.find((i) => i.insight_type === type) || null;
    },
    [insights]
  );

  return { insights, isLoading, isRefreshing, refresh, getInsightByType };
}
