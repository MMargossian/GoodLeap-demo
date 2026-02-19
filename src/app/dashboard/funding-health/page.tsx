"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { FicoChart } from "@/components/charts/fico-chart";
import {
  AlertTriangle,
  Lightbulb,
  ArrowUp,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { useFundingData } from "@/hooks/useConvexData";
import { AIInsightsSection } from "@/components/ai-insights-section";
import { useAIInsights } from "@/hooks/useAIInsights";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function FundingHealthPage() {
  const [period, setPeriod] = useState("December 2024");
  const { fundingHealth, ficoDistribution, loanAmounts } = useFundingData();

  const approvalRate = fundingHealth?.approval_rate ?? 59.5;
  const pullThrough = fundingHealth?.sales_pull_through ?? 40.2;
  const delinquencyRate = fundingHealth?.delinquency_rate ?? 0.8;
  const paymentStatus = fundingHealth?.payment_status ?? "On Track";
  const avgLoan = loanAmounts?.avg_loan ?? 10812;
  const utilizationRate = loanAmounts?.utilization_rate ?? 35.8;

  const fundingMetrics = {
    approvalRate: `${approvalRate}%`,
    pullThrough: `${pullThrough}%`,
    delinquencyRate: `${delinquencyRate}%`,
    paymentStatus,
    avgLoan: `$${avgLoan.toLocaleString()}`,
    utilizationRate: `${utilizationRate}%`,
  };

  const { insights, getInsightByType, isLoading, isRefreshing, refresh } = useAIInsights("funding", fundingMetrics);

  const ficoTakeaway = getInsightByType("fico_takeaway");
  const loanInsight = getInsightByType("loan_insight");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Funding Health</h1>
          <p className="text-sm text-muted-foreground">
            Detailed performance metrics across your organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Viewing Period:
          </span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={`${m} 2024`}>
                  {m} 2024
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Approvals</CardTitle>
            <CardDescription>
              Approval rates and credit quality analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purple stat boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-primary p-5">
                <p className="text-xs font-semibold tracking-wider text-purple-200 uppercase">
                  Approval Rate
                </p>
                <p className="text-3xl font-bold text-white mt-1">{approvalRate}%</p>
              </div>
              <div className="rounded-lg bg-primary p-5">
                <p className="text-xs font-semibold tracking-wider text-purple-200 uppercase">
                  Sales Pull-Through
                </p>
                <p className="text-3xl font-bold text-white mt-1">{pullThrough}%</p>
                <p className="text-xs text-purple-300 mt-1">(Funded / Submitted)</p>
              </div>
            </div>

            {/* Warning alert */}
            <div className="flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-300 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-xs font-bold tracking-wider text-amber-800 uppercase">
                You&apos;re losing 34% of approved loans before funding
              </p>
            </div>

            {/* FICO Chart Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Approval Probability by FICO
                </p>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold">
                  Target Range: 650+
                </Badge>
              </div>
              <FicoChart
                data={ficoDistribution.length > 0 ? ficoDistribution.map((f) => ({ range: f.fico_range, probability: f.approval_probability })) : undefined}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Focus sales efforts on borrowers with FICO &gt; 650 for highest conversion
              </p>
            </div>

            {/* Key Takeaway - AI Powered */}
            {isLoading ? (
              <Skeleton className="h-24 w-full rounded-lg" />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  <p className="text-xs font-semibold tracking-wider text-gray-700 uppercase">
                    Key Takeaway
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {ficoTakeaway
                    ? ficoTakeaway.content
                    : "Applications with FICO >700 have 85% approval vs. 45% below 700. Focusing on high-credit borrowers drastically improves pull-through."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Delinquencies Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Delinquencies</CardTitle>
              <CardDescription>
                Detailed breakdown of delinquency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Table header */}
              <div className="grid grid-cols-3 gap-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase border-b border-gray-200 pb-3">
                <span>Type</span>
                <span className="text-center">Total Delinquent</span>
                <span className="text-right">Delinquency Rate</span>
              </div>
              {/* Table row */}
              <div className="grid grid-cols-3 gap-4 items-center border-b border-gray-200 pb-4">
                <span className="text-sm font-medium text-gray-700">Total Roll-Up</span>
                <div className="flex justify-center">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-semibold">
                    4
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-gray-900 text-right">{delinquencyRate}%</span>
              </div>
              {/* Payment performance */}
              <div className="flex items-center gap-2 pt-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Payment Performance: {paymentStatus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Maintain low delinquency rates to ensure your continued high standing within the GoodLeap Sustainable Home Improvement Program.
              </p>
            </CardContent>
          </Card>

          {/* Loan Amounts Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Loan Amounts</CardTitle>
              <CardDescription>
                Utilization and average loan size metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Three stat cards */}
              <div className="grid grid-cols-3 gap-3">
                {/* Average Funded - Purple */}
                <div className="rounded-lg bg-primary p-4">
                  <p className="text-xs font-semibold tracking-wider text-purple-200 uppercase">
                    Average Funded
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">${avgLoan.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUp className="h-3 w-3 text-purple-200" />
                    <p className="text-xs text-purple-200">$50K from last quarter</p>
                  </div>
                </div>
                {/* Max Approved - Light gray */}
                <div className="rounded-lg bg-gray-100 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <DollarSign className="h-3.5 w-3.5 text-gray-500" />
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Max Approved
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$400K</p>
                </div>
                {/* Loan Amount Utilization - Light gray */}
                <div className="rounded-lg bg-gray-100 p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CreditCard className="h-3.5 w-3.5 text-gray-500" />
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase leading-tight">
                      Loan Amount Utilization (%)
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{utilizationRate}%</p>
                  <Progress value={utilizationRate} className="h-1.5 mt-2" />
                </div>
              </div>

              {/* Key Insight - AI Powered */}
              {isLoading ? (
                <Skeleton className="h-24 w-full rounded-lg" />
              ) : (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <p className="text-xs font-semibold tracking-wider text-gray-700 uppercase">
                      Key Insight
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {loanInsight
                      ? loanInsight.content
                      : <>Customers are using only <span className="font-semibold">36% of approved loan capacity</span>. Average customer could borrow $400K but take $10,812, presenting a significant opportunity to <span className="font-semibold">upsell project add-ons</span>.</>}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI-Powered Insights */}
      <AIInsightsSection
        insights={insights}
        isRefreshing={isRefreshing}
        refresh={refresh}
        insightTypes={["warning", "success"]}
      />
    </div>
  );
}
