"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightCard } from "@/components/cards/insight-card";
import { BenchmarkComparisonChart } from "@/components/charts/benchmark-comparison-chart";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Users,
  Target,
  Award,
  BarChart3,
  Zap,
  ShieldCheck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/animated";
import { useBenchmarkData } from "@/hooks/useConvexData";
import { AIInsightsSection } from "@/components/ai-insights-section";
import { useAIInsights } from "@/hooks/useAIInsights";

const defaultComparison = [
  { metric: "Conversion Rate", contractor: "22%", peer: "18%", diff: "+4pp", above: true },
  { metric: "Avg Sale", contractor: "$17.7K", peer: "$15.2K", diff: "+$2.5K", above: true },
  { metric: "Referral Rate", contractor: "38.9%", peer: "25.0%", diff: "+13.9pp", above: true },
  { metric: "Customer Retention", contractor: "42%", peer: "35%", diff: "+7pp", above: true },
  { metric: "Avg Sales Cycle", contractor: "34 days", peer: "42 days", diff: "-8 days", above: true },
  { metric: "Upsell Rate", contractor: "28%", peer: "20%", diff: "+8pp", above: true },
  { metric: "NPS Score", contractor: "58", peer: "52", diff: "+6", above: true },
];

function formatBenchmarkValue(metricName: string, value: number): string {
  if (metricName === "Avg Sale") return `$${(value / 1000).toFixed(1)}K`;
  if (metricName === "Avg Sales Cycle") return `${value} days`;
  if (metricName === "NPS Score") return String(value);
  return `${value}%`;
}

function formatDiff(metricName: string, contractor: number, peer: number): { diff: string; above: boolean } {
  const d = contractor - peer;
  if (metricName === "Avg Sale") {
    return { diff: `${d >= 0 ? "+" : ""}$${(d / 1000).toFixed(1)}K`, above: d > 0 };
  }
  if (metricName === "Avg Sales Cycle") {
    return { diff: `${d} days`, above: d < 0 }; // lower is better
  }
  if (metricName === "NPS Score") {
    return { diff: `${d >= 0 ? "+" : ""}${d}`, above: d > 0 };
  }
  return { diff: `${d >= 0 ? "+" : ""}${d.toFixed(1)}pp`, above: d > 0 };
}

export default function BenchmarksPage() {
  const { benchmarks } = useBenchmarkData();

  // Metric config for chart rendering (unit, max scale, direction)
  const metricConfig: Record<string, { unit: string; max: number; lowerIsBetter: boolean }> = {
    "Conversion Rate": { unit: "%", max: 50, lowerIsBetter: false },
    "Pull-Through Rate": { unit: "%", max: 60, lowerIsBetter: false },
    "Referral Conv.": { unit: "%", max: 50, lowerIsBetter: false },
    "Repeat Customers": { unit: "%", max: 60, lowerIsBetter: false },
    "Upsell Rate": { unit: "%", max: 40, lowerIsBetter: false },
    "Avg Sales Cycle": { unit: "days", max: 60, lowerIsBetter: true },
    "Target Attainment": { unit: "%", max: 100, lowerIsBetter: false },
  };

  const benchmarkChartData = benchmarks.length > 0
    ? benchmarks.map((b) => {
        const config = metricConfig[b.metric_name] ?? { unit: "%", max: 100, lowerIsBetter: false };
        return {
          metric: b.metric_name,
          contractor: b.contractor_value,
          peer: b.peer_value,
          ...config,
        };
      })
    : undefined;

  const benchmarkRows = benchmarks.length > 0
    ? benchmarks.map((b) => {
        const { diff, above } = formatDiff(b.metric_name, b.contractor_value, b.peer_value);
        return {
          metric: b.metric_name,
          contractor: formatBenchmarkValue(b.metric_name, b.contractor_value),
          peer: formatBenchmarkValue(b.metric_name, b.peer_value),
          diff,
          above,
        };
      })
    : defaultComparison;

  const metricsAbove = benchmarkRows.filter((r) => r.above).length;
  const totalMetrics = benchmarkRows.length;

  const benchmarkMetrics = Object.fromEntries(
    benchmarkRows.map((r) => [r.metric, { you: r.contractor, peer: r.peer, diff: r.diff }])
  );

  const { insights, getInsightByType, isLoading, isRefreshing, refresh } = useAIInsights("benchmarks", benchmarkMetrics);

  const salesExcellence = getInsightByType("sales_excellence_card");
  const customerLoyalty = getInsightByType("customer_loyalty_card");
  const growthPotential = getInsightByType("growth_potential_card");

  const summaryMetrics = [
    {
      label: "Overall Score",
      value: "112%",
      subtitle: "of Peer Average",
      icon: Award,
    },
    {
      label: "Metrics Above Peer",
      value: `${metricsAbove}/${totalMetrics}`,
      subtitle: "metrics leading",
      icon: BarChart3,
    },
    {
      label: "Top Strength",
      value: "Referral Conv.",
      subtitle: "+13.9pp vs peer",
      icon: Zap,
    },
    {
      label: "Biggest Gap",
      value: "Sales Cycle",
      subtitle: "34 vs 42 days (better)",
      icon: ShieldCheck,
    },
  ];
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Benchmarks</h1>
          <p className="text-sm text-muted-foreground">Compare your metrics against peer contractors</p>
        </div>

        {/* Performance Summary Cards */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryMetrics.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.label}>
                <Card className="card-hover relative overflow-hidden">
                  <CardContent className="p-5 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold tracking-tight">{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Chart + Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: Chart */}
          <FadeIn direction="left" delay={0.1} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Benchmarks &amp; Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <BenchmarkComparisonChart data={benchmarkChartData} />
                <p className="mt-4 text-xs text-muted-foreground">
                  Based on comparison with similar contractors in your region
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Right column: Insights */}
          <StaggerContainer staggerDelay={0.12} className="space-y-4">
            <StaggerItem>
              <h2 className="text-lg font-semibold">Performance Insights</h2>
            </StaggerItem>
            <StaggerItem>
              {isLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : salesExcellence ? (
                <InsightCard
                  type="success"
                  icon={TrendingUp}
                  title={salesExcellence.title}
                  content={salesExcellence.content}
                />
              ) : (
                <InsightCard
                  type="success"
                  icon={TrendingUp}
                  title="Sales Excellence"
                  content="Your conversion rate of 22% exceeds the peer average of 18%. Your shorter sales cycle (34 vs 42 days) gives you a competitive edge in closing deals faster."
                />
              )}
            </StaggerItem>
            <StaggerItem>
              {isLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : customerLoyalty ? (
                <InsightCard
                  type="info"
                  icon={Users}
                  title={customerLoyalty.title}
                  content={customerLoyalty.content}
                />
              ) : (
                <InsightCard
                  type="info"
                  icon={Users}
                  title="Customer Loyalty"
                  content="42% repeat customer rate (vs 35% peers) and 38.9% referral rate show strong customer relationships. This organic growth engine reduces your customer acquisition costs."
                />
              )}
            </StaggerItem>
            <StaggerItem>
              {isLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : growthPotential ? (
                <InsightCard
                  type="warning"
                  icon={Target}
                  title={growthPotential.title}
                  content={growthPotential.content}
                />
              ) : (
                <InsightCard
                  type="warning"
                  icon={Target}
                  title="Growth Potential"
                  content="28% upsell rate significantly exceeds the 20% peer average. Train the full sales team on the upsell strategies your top performers use."
                />
              )}
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Detailed Comparison Table */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 text-left font-medium text-muted-foreground">Metric</th>
                      <th className="pb-3 text-right font-medium text-muted-foreground">Your Value</th>
                      <th className="pb-3 text-right font-medium text-muted-foreground">Peer Avg</th>
                      <th className="pb-3 text-right font-medium text-muted-foreground">Difference</th>
                      <th className="pb-3 text-center font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarkRows.map((row) => (
                      <tr key={row.metric} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 font-medium">{row.metric}</td>
                        <td className="py-3 text-right font-semibold">{row.contractor}</td>
                        <td className="py-3 text-right text-muted-foreground">{row.peer}</td>
                        <td className="py-3 text-right">
                          <Badge
                            variant="outline"
                            className={
                              row.above
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }
                          >
                            {row.diff}
                          </Badge>
                        </td>
                        <td className="py-3 text-center">
                          {row.above ? (
                            <CheckCircle className="mx-auto h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="mx-auto h-4 w-4 text-red-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* AI-Powered Insights */}
        <AIInsightsSection
          insights={insights}
          isRefreshing={isRefreshing}
          refresh={refresh}
          insightTypes={["excellence", "loyalty", "growth"]}
        />
      </div>
    </PageTransition>
  );
}
