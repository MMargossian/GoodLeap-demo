"use client";

import { useState, useCallback, useRef } from "react";

export interface AIInsight {
  insight_type: string;
  title: string;
  content: string;
}

const defaultInsights: Record<string, AIInsight[]> = {
  sales: [
    {
      insight_type: "performance",
      title: "Strong Growth Trajectory",
      content:
        "Your 3.9% revenue growth and $206K monthly average demonstrate consistent market penetration. Focus on maintaining Q4 momentum by targeting the home improvement segment.",
    },
    {
      insight_type: "recommendation",
      title: "Expand Referral Program",
      content:
        "With 38.9% referral conversion\u2014well above the 25% industry average\u2014invest in formalizing your referral incentive program to drive more high-quality leads.",
    },
    {
      insight_type: "opportunity",
      title: "Home Remodel Expansion",
      content:
        "Home remodel projects show the highest average ticket size. Target marketing campaigns to grow this segment from 37 to 50+ projects next quarter.",
    },
  ],
  funding: [
    {
      insight_type: "warning",
      title: "Pull-Through Gap",
      content:
        "59.5% approval rate is solid, but only 40.2% pull-through means you're losing nearly 20% of approved applicants. Streamline post-approval process.",
    },
    {
      insight_type: "success",
      title: "Healthy Portfolio",
      content:
        "3.2% delinquency rate is well within industry norms. Continue monitoring the 580-659 FICO segment.",
    },
  ],
  benchmarks: [
    {
      insight_type: "excellence",
      title: "Outperforming Peers",
      content:
        "Your 22% conversion rate exceeds the 18% peer average. Shorter sales cycle (34 vs 42 days) gives you a competitive edge.",
    },
    {
      insight_type: "loyalty",
      title: "Strong Retention",
      content:
        "42% repeat customer rate vs 35% peers and 38.9% referral rate show strong customer relationships reducing acquisition costs.",
    },
    {
      insight_type: "growth",
      title: "Upsell Opportunity",
      content:
        "28% upsell rate significantly exceeds the 20% peer average. Train the full sales team on top performers' strategies.",
    },
  ],
  projects: [
    {
      insight_type: "bottleneck",
      title: "Installation Bottleneck",
      content:
        "18.5 days at Install Complete stage vs 15 days for peers suggests scheduling or capacity constraints.",
    },
    {
      insight_type: "lag",
      title: "Contract Signing Delay",
      content:
        "4.5 days to sign contracts vs 3.8 peer avg indicates friction. Consider e-signature solutions.",
    },
    {
      insight_type: "strength",
      title: "Strong Top-of-Funnel",
      content:
        "68.8% submission-to-approval rate exceeds benchmarks. Pre-qualification process is effective.",
    },
  ],
  satisfaction: [
    {
      insight_type: "installation",
      title: "Installation Improvement Needed",
      content:
        "Installation touchpoint has lowest recommendation rate (48%). Focus on cleanup procedures and panel alignment.",
    },
    {
      insight_type: "trend",
      title: "Above Average Sentiment",
      content:
        "58% recommendation rate with only 11% detractors is solid. Target the 31% neutral segment with proactive outreach.",
    },
    {
      insight_type: "post-funding",
      title: "Positive Post-Funding",
      content:
        "55% recommendation in post-funding with only 7% negative shows strong ongoing customer relationships.",
    },
  ],
};

export function useAIInsights(section: string, metrics?: Record<string, unknown>) {
  const [insights, setInsights] = useState<AIInsight[]>(
    defaultInsights[section] || defaultInsights.sales
  );
  const [isLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const metricsRef = useRef(metrics);
  metricsRef.current = metrics;

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
      return {
        source: "fallback",
        message: "Failed to connect to AI service.",
      };
    } finally {
      setIsRefreshing(false);
    }
  }, [section]);

  return { insights, isLoading, isRefreshing, refresh };
}
