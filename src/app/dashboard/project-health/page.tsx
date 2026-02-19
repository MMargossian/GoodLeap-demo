"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionItemCard } from "@/components/cards/action-item-card";
import { PipelineFunnel } from "@/components/charts/pipeline-funnel";
import { StageTimeChart } from "@/components/charts/stage-time-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  BarChart3,
  Timer,
  Lightbulb,
  ListChecks,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { useProjectHealthData } from "@/hooks/useConvexData";
import { AIInsightsSection } from "@/components/ai-insights-section";
import { useAIInsights } from "@/hooks/useAIInsights";

const defaultActions = [
  { stage: "Docs Sent", action_text: "Follow up on Signature", project_count: 12, risk_level: "medium" },
  { stage: "Contract Signed", action_text: "Submit NTP Request", project_count: 8, risk_level: "high" },
  { stage: "Install Complete", action_text: "Request PTO", project_count: 15, risk_level: "low" },
  { stage: "Approved", action_text: "Send Loan Docs", project_count: 5, risk_level: "low" },
];

export default function ProjectHealthPage() {
  const { pipelineStages, expiringLoans, actionItems } = useProjectHealthData();

  const expiringPct = expiringLoans?.expiring_pct ?? 39.0;
  const expiredValue = expiringLoans?.expired_value ?? 135380;
  const totalActionCount = actionItems.length > 0
    ? actionItems.reduce((sum, a) => sum + a.project_count, 0)
    : 40;

  // Compute avg days to sign and sign-to-fund from pipeline stages
  const contractSignedStage = pipelineStages.find((s) => s.stage === "Contract Signed");
  const fundedStage = pipelineStages.find((s) => s.stage === "Funded");
  const avgDaysToSign = contractSignedStage?.avg_days ?? 4.2;
  const avgDaysSignToFund = fundedStage?.avg_days
    ? (pipelineStages
        .filter((s) => ["NTP", "Install Complete", "Funded"].includes(s.stage))
        .reduce((sum, s) => sum + s.avg_days, 0)).toFixed(1)
    : "12.6";

  // Transform pipeline stages for funnel chart
  const funnelData = pipelineStages.length > 0
    ? pipelineStages.map((s, i) => ({
        stage: s.stage.toUpperCase(),
        count: s.count,
        dropPct: i === 0 ? null : Math.round(((pipelineStages[i - 1].count - s.count) / pipelineStages[i - 1].count) * 100),
      }))
    : undefined;

  // Transform pipeline stages for stage time chart
  const stageTimeData = pipelineStages.length > 0
    ? pipelineStages.map((s) => ({
        stage: s.stage.toUpperCase(),
        contractor: s.avg_days,
        similar: s.similar_contractor_avg_days,
      }))
    : undefined;

  const projectMetrics = {
    avgDaysToSign,
    avgDaysSignToFund,
    expiringPct: `${expiringPct}%`,
    expiredValue: `$${expiredValue.toLocaleString()}`,
    totalActionItems: totalActionCount,
    pipelineStages: pipelineStages.length > 0
      ? Object.fromEntries(pipelineStages.map((s) => [s.stage, { count: s.count, avgDays: s.avg_days, peerAvgDays: s.similar_contractor_avg_days }]))
      : undefined,
  };

  const { insights, getInsightByType, isLoading, isRefreshing, refresh } = useAIInsights("projects", projectMetrics);

  const effTakeaway1 = getInsightByType("efficiency_takeaway_1");
  const effTakeaway2 = getInsightByType("efficiency_takeaway_2");
  const effTakeaway3 = getInsightByType("efficiency_takeaway_3");
  const bottleneckCard = getInsightByType("bottleneck_card");
  const signatureLagCard = getInsightByType("signature_lag_card");
  const approvalStrengthCard = getInsightByType("approval_strength_card");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Health</h1>
          <p className="text-sm text-muted-foreground">
            Analyze friction points and operational efficiency across your project lifecycle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground">
            VIEWING PERIOD:
          </span>
          <Select defaultValue="30d">
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section 1: Pipeline Performance - ONE large card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left half: Pipeline Performance funnel */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-gray-700">
                  PIPELINE PERFORMANCE
                </span>
              </div>
              <PipelineFunnel data={funnelData} />
            </div>

            {/* Right half: Avg Time Per Stage */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Timer className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-gray-700">
                  AVG. TIME PER STAGE (DAYS)
                </span>
              </div>
              <StageTimeChart data={stageTimeData} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Expiring Loans */}
        <Card className="lg:row-span-2">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold tracking-wider text-gray-700">
                EXPIRING LOANS
              </span>
            </div>

            {/* Expiring Soon stat */}
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 space-y-2">
                <Badge className="bg-red-100 text-red-700 border-transparent text-[10px] font-semibold tracking-wider">
                  EXPIRING SOON
                </Badge>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className="text-3xl font-bold text-red-600">{expiringPct}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Active Inventory (30 Days)</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground">
                  APPROVALS EXPIRED
                </p>
                <p className="text-2xl font-bold text-gray-900">${expiredValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  Total value of expired approvals
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Addressing expiring loans leads to faster close rates and reduces
              risk of losing funds.
            </p>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              RESOLVE EXPIRING LOANS
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Middle + Right: Two stat cards */}
        <div className="space-y-4">
          <div className="rounded-lg border p-5">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground mb-1">
              AVG. DAYS TO SIGN
            </p>
            <p className="text-4xl font-bold text-gray-900">{avgDaysToSign}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Time from docs sent to signature received
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground mb-1">
              AVG. DAYS SIGN TO FUND
            </p>
            <p className="text-4xl font-bold text-gray-900">{avgDaysSignToFund}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Time from signature to project funding
            </p>
          </div>
        </div>

        {/* Stage Efficiency Takeaways - AI Powered */}
        <div className="rounded-lg border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold tracking-wider text-gray-700">
              STAGE EFFICIENCY TAKEAWAYS
            </span>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-3/4 rounded" />
            </div>
          ) : (
            <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  {effTakeaway1
                    ? effTakeaway1.content
                    : <>Longest stage is currently <span className="font-semibold">Notice to Proceed</span> at 12 days.</>}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  {effTakeaway2
                    ? effTakeaway2.content
                    : <>Overall cycle time is{" "}<span className="font-semibold">3.2 days faster</span> than last quarter.</>}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  {effTakeaway3
                    ? effTakeaway3.content
                    : <>Funding efficiency has improved by{" "}<span className="font-semibold">12%</span> following new audit protocols.</>}
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Section 3: Two-column layout - Next Actions + Key Takeaways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Next Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Purple banner */}
            <div className="flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                <span className="text-xs font-semibold tracking-wider">
                  TOTAL ACTION ITEMS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{totalActionCount}</span>
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            {/* 2x2 grid of action cards */}
            <div className="grid grid-cols-2 gap-3">
              {(actionItems.length > 0 ? actionItems.slice(0, 4) : defaultActions).map((item, i) => (
                <ActionItemCard
                  key={i}
                  stage={item.stage.toUpperCase()}
                  actionText={item.action_text}
                  projectCount={item.project_count}
                  riskLevel={item.risk_level as "high" | "medium" | "low"}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Key Takeaways - AI Powered */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bottleneck Detected */}
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {bottleneckCard ? bottleneckCard.title.toUpperCase() : "BOTTLENECK DETECTED"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {bottleneckCard
                      ? bottleneckCard.content
                      : "The NTP stage is averaging 12 days, significantly above the 8-day benchmark. Consider streamlining the approval workflow to reduce delays."}
                  </p>
                </div>
              </div>
            )}

            {/* Signature Lag */}
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {signatureLagCard ? signatureLagCard.title.toUpperCase() : "SIGNATURE LAG"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {signatureLagCard
                      ? signatureLagCard.content
                      : "The signature cycle has increased by 1.2 days compared to last quarter. Automated reminders may help accelerate document completion."}
                  </p>
                </div>
              </div>
            )}

            {/* Approval Strength */}
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : (
              <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {approvalStrengthCard ? approvalStrengthCard.title.toUpperCase() : "APPROVAL STRENGTH"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {approvalStrengthCard
                      ? approvalStrengthCard.content
                      : "Approval-to-funding pull-through rate remains strong at 52.6%, exceeding the industry average by 8 percentage points."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <AIInsightsSection
        insights={insights}
        isRefreshing={isRefreshing}
        refresh={refresh}
        insightTypes={["bottleneck", "lag", "strength"]}
      />
    </div>
  );
}
