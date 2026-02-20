import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { FALLBACK_INSIGHTS, type FallbackInsight } from "./fallback-insights";

export interface ReportData {
  generatedAt: Date;
  sales: {
    metrics: {
      revenue: number;
      projects: number;
      avgSale: number;
      conversionRate: number;
      referralConversion: number;
      repeatRate: number;
      upsellRate: number;
      avgSalesCycle: number;
      cancellations: number;
      targetAttainment: string;
    };
    insights: FallbackInsight[];
  };
  funding: {
    metrics: {
      approvalRate: number;
      pullThrough: number;
      delinquencyRate: number;
      paymentStatus: string;
      avgLoan: number;
      utilizationRate: number;
      totalFunded: number;
    };
    ficoDistribution: { ficoRange: string; approvalProbability: number }[];
    insights: FallbackInsight[];
  };
  benchmarks: {
    metrics: {
      metricName: string;
      contractorValue: number;
      peerValue: number;
    }[];
    insights: FallbackInsight[];
  };
  projects: {
    metrics: {
      pipelineStages: {
        stage: string;
        count: number;
        avgDays: number;
        peerAvgDays: number;
      }[];
      expiringPct: number;
      expiredValue: number;
      actionItems: {
        stage: string;
        actionText: string;
        projectCount: number;
        riskLevel: string;
      }[];
    };
    insights: FallbackInsight[];
  };
  satisfaction: {
    metrics: {
      wouldRecommendPct: number;
      neutralPct: number;
      wouldNotRecommendPct: number;
      openIssues: number;
      defectiveProjects: number;
      defectiveRate: number;
      escalations: number;
    };
    touchpoints: {
      touchpoint: string;
      recommendPct: number;
      neutralPct: number;
      notRecommendPct: number;
    }[];
    insights: FallbackInsight[];
  };
  executiveSummary: string;
}

async function fetchAIInsights(
  section: string,
  metrics: Record<string, unknown>,
  baseUrl: string
): Promise<FallbackInsight[]> {
  try {
    const response = await fetch(`${baseUrl}/api/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, metrics }),
    });
    const data = await response.json();
    return data.insights || FALLBACK_INSIGHTS[section] || [];
  } catch {
    return FALLBACK_INSIGHTS[section] || [];
  }
}

async function fetchExecutiveSummary(
  metrics: Record<string, unknown>,
  baseUrl: string
): Promise<string> {
  try {
    const response = await fetch(`${baseUrl}/api/ai/summary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metrics }),
    });
    const data = await response.json();
    return data.summary || "";
  } catch {
    return "";
  }
}

export async function collectReportData(
  convexUrl?: string
): Promise<ReportData> {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // Try fetching from Convex directly via HTTP client
  let salesData: Record<string, unknown> | null = null;
  let fundingHealth: Record<string, unknown> | null = null;
  let ficoDistribution: Record<string, unknown>[] = [];
  let loanAmounts: Record<string, unknown> | null = null;
  let benchmarks: Record<string, unknown>[] = [];
  let pipelineStages: Record<string, unknown>[] = [];
  let expiringLoans: Record<string, unknown> | null = null;
  let actionItems: Record<string, unknown>[] = [];
  let customerFeedback: Record<string, unknown> | null = null;
  let touchpoints: Record<string, unknown>[] = [];

  if (convexUrl) {
    try {
      const client = new ConvexHttpClient(convexUrl);
      const results = await Promise.allSettled([
        client.query(api.salesPerformance.getSalesData, {}),
        client.query(api.fundingHealth.getFundingHealth, {}),
        client.query(api.fundingHealth.getFicoDistribution, {}),
        client.query(api.fundingHealth.getLoanAmounts, {}),
        client.query(api.benchmarks.getBenchmarks, {}),
        client.query(api.projectHealth.getPipelineStages, {}),
        client.query(api.projectHealth.getExpiringLoans, {}),
        client.query(api.projectHealth.getActionItems, {}),
        client.query(api.customerSatisfaction.getCustomerFeedback, {}),
        client.query(api.customerSatisfaction.getFeedbackByTouchpoint, {}),
      ]);

      if (results[0].status === "fulfilled") salesData = results[0].value;
      if (results[1].status === "fulfilled") fundingHealth = results[1].value;
      if (results[2].status === "fulfilled")
        ficoDistribution = results[2].value || [];
      if (results[3].status === "fulfilled") loanAmounts = results[3].value;
      if (results[4].status === "fulfilled") benchmarks = results[4].value || [];
      if (results[5].status === "fulfilled")
        pipelineStages = results[5].value || [];
      if (results[6].status === "fulfilled") expiringLoans = results[6].value;
      if (results[7].status === "fulfilled")
        actionItems = results[7].value || [];
      if (results[8].status === "fulfilled")
        customerFeedback = results[8].value;
      if (results[9].status === "fulfilled")
        touchpoints = results[9].value || [];
    } catch (e) {
      console.warn("Failed to fetch Convex data for report, using fallbacks:", e);
    }
  }

  // Build metrics with fallbacks
  const sd = salesData as Record<string, number> | null;
  const sales = {
    revenue: sd?.revenue ?? 2475700,
    projects: sd?.projects ?? 140,
    avgSale: sd?.avg_sale ?? 17683,
    conversionRate: sd?.conversion_rate ?? 22,
    referralConversion: sd?.referral_conversion ?? 38.9,
    repeatRate: sd?.repeat_customer_rate ?? 42,
    upsellRate: sd?.upsell_rate ?? 28,
    avgSalesCycle: sd?.avg_sales_cycle ?? 34,
    cancellations: sd?.cancellations ?? 12,
    targetAttainment: sd
      ? ((sd.revenue / sd.target) * 100).toFixed(1)
      : "95.2",
  };

  const fh = fundingHealth as Record<string, unknown> | null;
  const la = loanAmounts as Record<string, unknown> | null;
  const funding = {
    approvalRate: (fh?.approval_rate as number) ?? 59.5,
    pullThrough: (fh?.sales_pull_through as number) ?? 40.2,
    delinquencyRate: (fh?.delinquency_rate as number) ?? 3.2,
    paymentStatus: (fh?.payment_status as string) ?? "Current",
    avgLoan: (la?.avg_loan as number) ?? 10812,
    utilizationRate: (la?.utilization_rate as number) ?? 36,
    totalFunded: (la?.total_funded as number) ?? 1513680,
  };

  const ficoData = ficoDistribution.map((f) => ({
    ficoRange: (f.fico_range as string) ?? "",
    approvalProbability: (f.approval_probability as number) ?? 0,
  }));
  // Provide fallback FICO data if empty
  const ficoFallback =
    ficoData.length > 0
      ? ficoData
      : [
          { ficoRange: "800+", approvalProbability: 95 },
          { ficoRange: "740-799", approvalProbability: 85 },
          { ficoRange: "700-739", approvalProbability: 72 },
          { ficoRange: "660-699", approvalProbability: 55 },
          { ficoRange: "620-659", approvalProbability: 38 },
          { ficoRange: "580-619", approvalProbability: 22 },
        ];

  const benchmarkData = benchmarks.map((b) => ({
    metricName: (b.metric_name as string) ?? "",
    contractorValue: (b.contractor_value as number) ?? 0,
    peerValue: (b.peer_value as number) ?? 0,
  }));
  const benchmarkFallback =
    benchmarkData.length > 0
      ? benchmarkData
      : [
          { metricName: "Conversion Rate", contractorValue: 22, peerValue: 18 },
          {
            metricName: "Avg Sale",
            contractorValue: 17683,
            peerValue: 15200,
          },
          {
            metricName: "Referral Conv.",
            contractorValue: 38.9,
            peerValue: 25,
          },
          {
            metricName: "Repeat Customers",
            contractorValue: 42,
            peerValue: 35,
          },
          { metricName: "Upsell Rate", contractorValue: 28, peerValue: 20 },
          {
            metricName: "Avg Sales Cycle",
            contractorValue: 34,
            peerValue: 42,
          },
          {
            metricName: "Target Attainment",
            contractorValue: 95.2,
            peerValue: 88,
          },
        ];

  const el = expiringLoans as Record<string, unknown> | null;
  const pipelineData = pipelineStages.map((p) => ({
    stage: (p.stage as string) ?? "",
    count: (p.count as number) ?? 0,
    avgDays: (p.avg_days as number) ?? 0,
    peerAvgDays: (p.similar_contractor_avg_days as number) ?? 0,
  }));
  const pipelineFallback =
    pipelineData.length > 0
      ? pipelineData
      : [
          { stage: "Submitted", count: 218, avgDays: 1.2, peerAvgDays: 1.5 },
          { stage: "Approved", count: 150, avgDays: 2.8, peerAvgDays: 3.2 },
          { stage: "Signed", count: 128, avgDays: 4.2, peerAvgDays: 3.8 },
          { stage: "NTP", count: 110, avgDays: 12.0, peerAvgDays: 8.0 },
          {
            stage: "Install Complete",
            count: 95,
            avgDays: 18.5,
            peerAvgDays: 15.0,
          },
          { stage: "Funded", count: 88, avgDays: 3.5, peerAvgDays: 4.0 },
        ];

  const actionItemData = actionItems.map((a) => ({
    stage: (a.stage as string) ?? "",
    actionText: (a.action_text as string) ?? "",
    projectCount: (a.project_count as number) ?? 0,
    riskLevel: (a.risk_level as string) ?? "medium",
  }));

  const cf = customerFeedback as Record<string, unknown> | null;
  const satisfactionMetrics = {
    wouldRecommendPct: (cf?.would_recommend_pct as number) ?? 58,
    neutralPct: (cf?.neutral_pct as number) ?? 31,
    wouldNotRecommendPct: (cf?.would_not_recommend_pct as number) ?? 11,
    openIssues: (cf?.open_issues as number) ?? 8,
    defectiveProjects: (cf?.defective_projects as number) ?? 5,
    defectiveRate: (cf?.defective_rate as number) ?? 3.6,
    escalations: (cf?.escalations as number) ?? 2,
  };

  const touchpointData = touchpoints.map((t) => ({
    touchpoint: (t.touchpoint as string) ?? "",
    recommendPct: (t.recommend_pct as number) ?? 0,
    neutralPct: (t.neutral_pct as number) ?? 0,
    notRecommendPct: (t.not_recommend_pct as number) ?? 0,
  }));
  const touchpointFallback =
    touchpointData.length > 0
      ? touchpointData
      : [
          {
            touchpoint: "Sales Process",
            recommendPct: 65,
            neutralPct: 25,
            notRecommendPct: 10,
          },
          {
            touchpoint: "Funding",
            recommendPct: 55,
            neutralPct: 38,
            notRecommendPct: 7,
          },
          {
            touchpoint: "Installation",
            recommendPct: 48,
            neutralPct: 35,
            notRecommendPct: 17,
          },
          {
            touchpoint: "Post-Funding",
            recommendPct: 55,
            neutralPct: 32,
            notRecommendPct: 13,
          },
        ];

  // Build all metrics for AI calls
  const allMetrics = {
    sales,
    funding,
    benchmarks: benchmarkFallback,
    projects: {
      pipeline: pipelineFallback,
      expiringPct: (el?.expiring_pct as number) ?? 39,
      expiredValue: (el?.expired_value as number) ?? 245000,
    },
    satisfaction: {
      ...satisfactionMetrics,
      touchpoints: touchpointFallback,
    },
  };

  // Fetch AI insights in parallel
  const [
    salesInsights,
    fundingInsights,
    benchmarkInsights,
    projectInsights,
    satisfactionInsights,
    executiveSummary,
  ] = await Promise.all([
    fetchAIInsights("sales", allMetrics.sales, baseUrl),
    fetchAIInsights("funding", allMetrics.funding, baseUrl),
    fetchAIInsights("benchmarks", { metrics: allMetrics.benchmarks }, baseUrl),
    fetchAIInsights("projects", allMetrics.projects, baseUrl),
    fetchAIInsights("satisfaction", allMetrics.satisfaction, baseUrl),
    fetchExecutiveSummary(allMetrics, baseUrl),
  ]);

  return {
    generatedAt: new Date(),
    sales: { metrics: sales, insights: salesInsights },
    funding: {
      metrics: funding,
      ficoDistribution: ficoFallback,
      insights: fundingInsights,
    },
    benchmarks: { metrics: benchmarkFallback, insights: benchmarkInsights },
    projects: {
      metrics: {
        pipelineStages: pipelineFallback,
        expiringPct: (el?.expiring_pct as number) ?? 39,
        expiredValue: (el?.expired_value as number) ?? 245000,
        actionItems: actionItemData,
      },
      insights: projectInsights,
    },
    satisfaction: {
      metrics: satisfactionMetrics,
      touchpoints: touchpointFallback,
      insights: satisfactionInsights,
    },
    executiveSummary,
  };
}
