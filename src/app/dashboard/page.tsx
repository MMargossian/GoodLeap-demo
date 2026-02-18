"use client";

import { MetricCard } from "@/components/cards/metric-card";
import { InsightCard } from "@/components/cards/insight-card";
import { RecommendationCard } from "@/components/cards/recommendation-card";
import { AIInsightsSection } from "@/components/ai-insights-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueTrendsChart } from "@/components/charts/revenue-trends-chart";
import { RevenueForecastChart } from "@/components/charts/revenue-forecast-chart";
import { DepartmentBarChart } from "@/components/charts/department-bar-chart";
import { ProductMixChart } from "@/components/charts/product-mix-chart";
import {
  DollarSign,
  TrendingUp,
  Calculator,
  Calendar,
  Flame,
} from "lucide-react";
import {
  AnimatedCard,
  AnimatedNumber,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/animated";

const kpiItems = [
  {
    label: "Projects",
    value: "140",
  },
  {
    label: "Avg Sale",
    value: "$17,683",
  },
  {
    label: "Total Revenue",
    value: "$2,475,700",
  },
];

const funnelItems = [
  { label: "Conversion Rate", value: "22%" },
  { label: "Pull-Through", value: "40.2%" },
  { label: "Referral Conversion", value: "38.9%" },
];

const customerItems = [
  { label: "Repeat Customers", value: "42%" },
  { label: "Upsell Rate", value: "28%" },
  { label: "Avg Install Length", value: "4.2 months" },
];

const operationsItems = [
  { label: "Avg Sales Cycle", value: "34 days" },
  { label: "Cancellations", value: "12" },
  { label: "Target Attainment", value: "95.2%" },
];

function StatColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
        {title}
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0"
          >
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SalesPerformancePage() {
  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Performance</h1>
          <p className="text-sm text-muted-foreground">Revenue metrics, trends, and growth analytics</p>
        </div>

        {/* Section 1: Revenue Overview */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StaggerItem>
            <MetricCard
              title="Total Revenue"
              value="$2,475,700"
              trend={3.9}
              subtitle="140 Projects"
              icon={DollarSign}
            />
          </StaggerItem>
          <StaggerItem>
            <MetricCard
              title="Revenue Trend"
              value="+3.9%"
              subtitle="vs last year"
              icon={TrendingUp}
            />
          </StaggerItem>
          <StaggerItem>
            <MetricCard
              title="Avg Monthly"
              value="$206,308"
              subtitle="12-month average"
              icon={Calculator}
            />
          </StaggerItem>
          <StaggerItem>
            <MetricCard
              title="Peak Month"
              value="October"
              subtitle="$245,000"
              icon={Calendar}
            />
          </StaggerItem>
          <StaggerItem>
            <MetricCard
              title="Growth Streak"
              value="3 months"
              subtitle="Consecutive growth"
              icon={Flame}
            />
          </StaggerItem>
        </StaggerContainer>

        {/* Section 2: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <FadeIn direction="left" delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="monthly">
                  <TabsList>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                  <TabsContent value="weekly" className="mt-4">
                    <RevenueTrendsChart period="weekly" />
                  </TabsContent>
                  <TabsContent value="monthly" className="mt-4">
                    <RevenueTrendsChart period="monthly" />
                  </TabsContent>
                  <TabsContent value="quarterly" className="mt-4">
                    <RevenueTrendsChart period="quarterly" />
                  </TabsContent>
                  <TabsContent value="yearly" className="mt-4">
                    <RevenueTrendsChart period="yearly" />
                  </TabsContent>
                </Tabs>
                <div className="mt-4 rounded-md bg-secondary px-4 py-3">
                  <p className="text-sm text-chart-1 font-medium">
                    October peak of $245K suggests strong seasonal demand.
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Revenue Forecast */}
          <FadeIn direction="right" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Actual vs projected revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueForecastChart />
                <div className="mt-4 flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Last 3-mo Avg</p>
                    <p className="text-lg font-bold">
                      <AnimatedNumber value={210333} format="dollar" />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Year-end Forecast
                    </p>
                    <p className="text-lg font-bold">$2.52M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Section 3: Key Sales Performance */}
        <FadeIn delay={0.15}>
          <AnimatedCard delay={0.2}>
            <CardHeader>
              <CardTitle className="text-lg">Key Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatColumn title="Summary" items={kpiItems} />
                <StatColumn title="Conversion Funnel" items={funnelItems} />
                <StatColumn title="Customer Value" items={customerItems} />
                <StatColumn title="Operations" items={operationsItems} />
              </div>
            </CardContent>
          </AnimatedCard>
        </FadeIn>

        {/* Section 4: Sales Performance Insight */}
        <FadeIn delay={0.2}>
          <InsightCard
            type="info"
            title="Strong Growth Trajectory"
            content="Your 3.9% revenue growth and $206K monthly average demonstrate consistent market penetration. Focus on maintaining the Q4 momentum by targeting the home improvement segment which shows highest conversion rates."
          />
        </FadeIn>

        {/* Section 5: Department & Product Mix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn direction="left" delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Revenue by region</CardDescription>
              </CardHeader>
              <CardContent>
                <DepartmentBarChart />
              </CardContent>
            </Card>
          </FadeIn>
          <FadeIn direction="right" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Product Mix</CardTitle>
                <CardDescription>Projects by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductMixChart />
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Section 6: AI-Powered Insights */}
        <FadeIn delay={0.15}>
          <AIInsightsSection section="sales" />
        </FadeIn>

        {/* Section 7: Recommendations */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaggerItem>
            <RecommendationCard
              variant="recommendation"
              title="Top Recommendation"
              heading="Expand Referral Program"
              content="With 38.9% referral conversion—well above the 25% industry average—invest in formalizing your referral incentive program to drive even more high-quality leads."
            />
          </StaggerItem>
          <StaggerItem>
            <RecommendationCard
              variant="opportunity"
              title="Market Opportunity"
              heading="Home Remodel Expansion"
              content="Home remodel projects show the highest average ticket size. Consider targeted marketing campaigns to grow this segment from 37 to 50+ projects next quarter."
            />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
