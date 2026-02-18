"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function ProjectHealthPage() {
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
              <PipelineFunnel />
            </div>

            {/* Right half: Avg Time Per Stage */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Timer className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-gray-700">
                  AVG. TIME PER STAGE (DAYS)
                </span>
              </div>
              <StageTimeChart />
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
                  <span className="text-3xl font-bold text-red-600">39.0%</span>
                </div>
                <p className="text-xs text-muted-foreground">Active Inventory (30 Days)</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground">
                  APPROVALS EXPIRED
                </p>
                <p className="text-2xl font-bold text-gray-900">$135,380</p>
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
            <p className="text-4xl font-bold text-gray-900">4.2</p>
            <p className="text-xs text-muted-foreground mt-1">
              Time from docs sent to signature received
            </p>
          </div>
          <div className="rounded-lg border p-5">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground mb-1">
              AVG. DAYS SIGN TO FUND
            </p>
            <p className="text-4xl font-bold text-gray-900">12.6</p>
            <p className="text-xs text-muted-foreground mt-1">
              Time from signature to project funding
            </p>
          </div>
        </div>

        {/* Stage Efficiency Takeaways */}
        <div className="rounded-lg border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold tracking-wider text-gray-700">
              STAGE EFFICIENCY TAKEAWAYS
            </span>
          </div>
          <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>
                Longest stage is currently <span className="font-semibold">Notice to Proceed</span> at 12 days.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>
                Overall cycle time is{" "}
                <span className="font-semibold">3.2 days faster</span> than last quarter.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>
                Funding efficiency has improved by{" "}
                <span className="font-semibold">12%</span> following new audit protocols.
              </span>
            </li>
          </ul>
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
                <span className="text-2xl font-bold">40</span>
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            {/* 2x2 grid of action cards */}
            <div className="grid grid-cols-2 gap-3">
              <ActionItemCard
                stage="DOCS SENT"
                actionText="Follow up on Signature"
                projectCount={12}
                riskLevel="medium"
              />
              <ActionItemCard
                stage="CONTRACT SIGNED"
                actionText="Submit NTP Request"
                projectCount={8}
                riskLevel="high"
              />
              <ActionItemCard
                stage="INSTALL COMPLETE"
                actionText="Request PTO"
                projectCount={15}
                riskLevel="low"
              />
              <ActionItemCard
                stage="APPROVED"
                actionText="Send Loan Docs"
                projectCount={5}
                riskLevel="low"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right: Key Takeaways */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bottleneck Detected */}
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">BOTTLENECK DETECTED</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  The NTP stage is averaging 12 days, significantly above the 8-day
                  benchmark. Consider streamlining the approval workflow to reduce delays.
                </p>
              </div>
            </div>

            {/* Signature Lag */}
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">SIGNATURE LAG</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  The signature cycle has increased by 1.2 days compared to last quarter.
                  Automated reminders may help accelerate document completion.
                </p>
              </div>
            </div>

            {/* Approval Strength */}
            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">APPROVAL STRENGTH</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Approval-to-funding pull-through rate remains strong at 52.6%, exceeding
                  the industry average by 8 percentage points.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
