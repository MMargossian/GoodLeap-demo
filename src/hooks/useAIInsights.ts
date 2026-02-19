"use client";

import { useState, useCallback, useRef, useEffect } from "react";

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
    {
      insight_type: "sales_insight",
      title: "Strong Growth Trajectory",
      content:
        "Your 3.9% revenue growth and $206K monthly average demonstrate consistent market penetration. Focus on maintaining the Q4 momentum by targeting the home improvement segment which shows highest conversion rates.",
    },
    {
      insight_type: "top_recommendation",
      title: "Expand Referral Program",
      content:
        "With 38.9% referral conversion\u2014well above the 25% industry average\u2014invest in formalizing your referral incentive program to drive even more high-quality leads.",
    },
    {
      insight_type: "market_opportunity",
      title: "Home Remodel Expansion",
      content:
        "Home remodel projects show the highest average ticket size. Consider targeted marketing campaigns to grow this segment from 37 to 50+ projects next quarter.",
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
    {
      insight_type: "fico_takeaway",
      title: "FICO Distribution Impact",
      content:
        "Applications with FICO >700 have 85% approval vs. 45% below 700. Focusing on high-credit borrowers drastically improves pull-through.",
    },
    {
      insight_type: "loan_insight",
      title: "Loan Utilization Gap",
      content:
        "Customers are using only 36% of approved loan capacity. Average customer could borrow $400K but take $10,812, presenting a significant opportunity to upsell project add-ons.",
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
    {
      insight_type: "sales_excellence_card",
      title: "Sales Excellence",
      content:
        "Your conversion rate of 22% exceeds the peer average of 18%. Your shorter sales cycle (34 vs 42 days) gives you a competitive edge in closing deals faster.",
    },
    {
      insight_type: "customer_loyalty_card",
      title: "Customer Loyalty",
      content:
        "42% repeat customer rate (vs 35% peers) and 38.9% referral rate show strong customer relationships. This organic growth engine reduces your customer acquisition costs.",
    },
    {
      insight_type: "growth_potential_card",
      title: "Growth Potential",
      content:
        "28% upsell rate significantly exceeds the 20% peer average. Train the full sales team on the upsell strategies your top performers use.",
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
    {
      insight_type: "efficiency_takeaway_1",
      title: "Longest Stage",
      content:
        "Longest stage is currently Notice to Proceed at 12 days.",
    },
    {
      insight_type: "efficiency_takeaway_2",
      title: "Cycle Time Improving",
      content:
        "Overall cycle time is 3.2 days faster than last quarter.",
    },
    {
      insight_type: "efficiency_takeaway_3",
      title: "Funding Efficiency",
      content:
        "Funding efficiency has improved by 12% following new audit protocols.",
    },
    {
      insight_type: "bottleneck_card",
      title: "Bottleneck Detected",
      content:
        "The NTP stage is averaging 12 days, significantly above the 8-day benchmark. Consider streamlining the approval workflow to reduce delays.",
    },
    {
      insight_type: "signature_lag_card",
      title: "Signature Lag",
      content:
        "The signature cycle has increased by 1.2 days compared to last quarter. Automated reminders may help accelerate document completion.",
    },
    {
      insight_type: "approval_strength_card",
      title: "Approval Strength",
      content:
        "Approval-to-funding pull-through rate remains strong at 52.6%, exceeding the industry average by 8 percentage points.",
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
    {
      insight_type: "installation_card",
      title: "Installation Improvement Needed",
      content:
        "Installation touchpoint has lowest recommendation rate (48%). Focus on cleanup procedures and panel alignment quality to boost satisfaction.",
    },
    {
      insight_type: "post_funding_card",
      title: "Positive Post-Funding Experience",
      content:
        "55% recommendation in post-funding with only 7% negative shows strong ongoing customer relationships after project completion.",
    },
    {
      insight_type: "sentiment_card",
      title: "Above Average Sentiment",
      content:
        "58% recommendation rate with only 11% detractors puts you in a solid position. Target the 31% neutral segment with proactive outreach to convert them to promoters.",
    },
    {
      insight_type: "cleanup_insight",
      title: "Site Cleanup",
      content:
        "Multiple reports of debris left after installation. Implement mandatory cleanup checklist.",
    },
    {
      insight_type: "quality_insight",
      title: "Install Quality",
      content:
        "Panel alignment issues reported in 12% of installations. Schedule additional QC inspections.",
    },
    {
      insight_type: "followup_insight",
      title: "Follow-ups",
      content:
        "Post-installation follow-up calls delayed by average 5 days. Automate scheduling within 48 hours.",
    },
  ],
};

export function useAIInsights(section: string, metrics?: Record<string, unknown>) {
  const [insights, setInsights] = useState<AIInsight[]>(
    defaultInsights[section] || defaultInsights.sales
  );
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
