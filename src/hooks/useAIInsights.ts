"use client";

import { useState, useCallback } from "react";

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

const sectionMetrics: Record<string, Record<string, unknown>> = {
  sales: {
    totalRevenue: "$2,475,700",
    projects: 140,
    avgSale: "$17,683",
    revenueTrend: "+3.9%",
    avgMonthly: "$206,308",
    peakMonth: "October ($245,000)",
    conversionRate: "22%",
    pullThrough: "40.2%",
    referralConversion: "38.9%",
    repeatCustomers: "42%",
    upsellRate: "28%",
    avgSalesCycle: "34 days",
    cancellations: 12,
    targetAttainment: "95.2%",
  },
  funding: {
    approvalRate: "59.5%",
    pullThrough: "40.2%",
    delinquencyRate: "3.2%",
    avgLoanAmount: "$17,683",
    totalFunded: "$2,475,700",
    ficoDistribution: {
      "760+": "28%",
      "700-759": "35%",
      "660-699": "22%",
      "580-659": "15%",
    },
  },
  benchmarks: {
    conversionRate: { contractor: "22%", peers: "18%" },
    salesCycle: { contractor: "34 days", peers: "42 days" },
    repeatCustomerRate: { contractor: "42%", peers: "35%" },
    referralRate: { contractor: "38.9%", peers: "25%" },
    upsellRate: { contractor: "28%", peers: "20%" },
    avgTicketSize: { contractor: "$17,683", peers: "$15,200" },
  },
  projects: {
    pipelineStages: {
      submitted: 45,
      approved: 31,
      contractSigned: 28,
      installScheduled: 22,
      installComplete: 18,
      funded: 14,
    },
    avgDaysPerStage: {
      submissionToApproval: 2.1,
      approvalToContract: 4.5,
      contractToInstall: 12.3,
      installToComplete: 18.5,
      completeToFunded: 5.2,
    },
    submissionToApprovalRate: "68.8%",
  },
  satisfaction: {
    overallNPS: 58,
    recommendRate: "58%",
    detractorRate: "11%",
    neutralRate: "31%",
    touchpoints: {
      salesExperience: { recommend: "62%", neutral: "28%", negative: "10%" },
      installation: { recommend: "48%", neutral: "35%", negative: "17%" },
      postFunding: { recommend: "55%", neutral: "38%", negative: "7%" },
      communication: { recommend: "60%", neutral: "30%", negative: "10%" },
    },
  },
};

export function useAIInsights(section: string) {
  const [insights, setInsights] = useState<AIInsight[]>(
    defaultInsights[section] || defaultInsights.sales
  );
  const [isLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          metrics: sectionMetrics[section] || sectionMetrics.sales,
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
