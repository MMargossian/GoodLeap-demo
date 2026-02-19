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
import { Skeleton } from "@/components/ui/skeleton";
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
import { useSalesData } from "@/hooks/useConvexData";
import { useAIInsights } from "@/hooks/useAIInsights";

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
  const { salesData, departmentPerf, productMix, revenueMonthly } = useSalesData();

  const revenue = salesData?.revenue ?? 2475700;
  const projects = salesData?.projects ?? 140;
  const avgSale = salesData?.avg_sale ?? 17683;
  const conversionRate = salesData?.conversion_rate ?? 22;
  const referralConversion = salesData?.referral_conversion ?? 38.9;
  const repeatRate = salesData?.repeat_customer_rate ?? 42;
  const upsellRate = salesData?.upsell_rate ?? 28;
  const avgSalesCycle = salesData?.avg_sales_cycle ?? 34;
  const cancellations = salesData?.cancellations ?? 12;
  const avgInstallLength = salesData?.avg_install_length ?? 4.2;
  const avgMonthly = Math.round(revenue / 12);
  const targetAttainment = salesData ? ((revenue / salesData.target) * 100).toFixed(1) : "95.2";

  const salesMetrics = {
    totalRevenue: `$${revenue.toLocaleString()}`,
    projects,
    avgSale: `$${avgSale.toLocaleString()}`,
    conversionRate: `${conversionRate}%`,
    referralConversion: `${referralConversion}%`,
    repeatCustomerRate: `${repeatRate}%`,
    upsellRate: `${upsellRate}%`,
    avgSalesCycle: `${avgSalesCycle} days`,
    cancellations,
    targetAttainment: `${targetAttainment}%`,
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyChartData = revenueMonthly.length > 0
    ? revenueMonthly.map((r) => ({ label: monthNames[r.month - 1] ?? `M${r.month}`, revenue: r.actual_revenue }))
    : undefined;
  const forecastChartData = revenueMonthly.length > 0
    ? revenueMonthly.map((r) => ({ month: monthNames[r.month - 1] ?? `M${r.month}`, actual: r.actual_revenue, forecast: r.forecast_revenue ?? null }))
    : undefined;

  const { insights, getInsightByType, isLoading, isRefreshing, refresh } = useAIInsights("sales", salesMetrics);

  const salesInsight = getInsightByType("sales_insight");
  const topRec = getInsightByType("top_recommendation");
  const marketOpp = getInsightByType("market_opportunity");

  const kpiItems = [
    { label: "Projects", value: String(projects) },
    { label: "Avg Sale", value: `$${avgSale.toLocaleString()}` },
    { label: "Total Revenue", value: `$${revenue.toLocaleString()}` },
  ];
  const funnelItems = [
    { label: "Conversion Rate", value: `${conversionRate}%` },
    { label: "Pull-Through", value: "40.2%" },
    { label: "Referral Conversion", value: `${referralConversion}%` },
  ];
  const customerItems = [
    { label: "Repeat Customers", value: `${repeatRate}%` },
    { label: "Upsell Rate", value: `${upsellRate}%` },
    { label: "Avg Install Length", value: `${avgInstallLength} months` },
  ];
  const operationsItems = [
    { label: "Avg Sales Cycle", value: `${avgSalesCycle} days` },
    { label: "Cancellations", value: String(cancellations) },
    { label: "Target Attainment", value: `${targetAttainment}%` },
  ];

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
              value={`$${revenue.toLocaleString()}`}
              trend={3.9}
              subtitle={`${projects} Projects`}
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
              value={`$${avgMonthly.toLocaleString()}`}
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
                    <RevenueTrendsChart period="monthly" data={monthlyChartData} />
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
                <RevenueForecastChart data={forecastChartData} />
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
          {isLoading ? (
            <Skeleton className="h-24 w-full rounded-xl" />
          ) : salesInsight ? (
            <InsightCard
              type="info"
              title={salesInsight.title}
              content={salesInsight.content}
            />
          ) : (
            <InsightCard
              type="info"
              title="Strong Growth Trajectory"
              content="Your 3.9% revenue growth and $206K monthly average demonstrate consistent market penetration. Focus on maintaining the Q4 momentum by targeting the home improvement segment which shows highest conversion rates."
            />
          )}
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
                <DepartmentBarChart
                  data={departmentPerf.length > 0 ? departmentPerf.map((d) => ({ department: d.department, revenue: d.revenue })) : undefined}
                />
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
                <ProductMixChart
                  data={productMix.length > 0 ? productMix.map((p) => ({ category: p.category, count: p.count })) : undefined}
                />
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Section 6: AI-Powered Insights */}
        <FadeIn delay={0.15}>
          <AIInsightsSection
            insights={insights}
            isRefreshing={isRefreshing}
            refresh={refresh}
            insightTypes={["performance", "recommendation", "opportunity"]}
          />
        </FadeIn>

        {/* Section 7: Recommendations */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StaggerItem>
            {isLoading ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : topRec ? (
              <RecommendationCard
                variant="recommendation"
                title="Top Recommendation"
                heading={topRec.title}
                content={topRec.content}
              />
            ) : (
              <RecommendationCard
                variant="recommendation"
                title="Top Recommendation"
                heading="Expand Referral Program"
                content="With 38.9% referral conversion—well above the 25% industry average—invest in formalizing your referral incentive program to drive even more high-quality leads."
              />
            )}
          </StaggerItem>
          <StaggerItem>
            {isLoading ? (
              <Skeleton className="h-48 w-full rounded-xl" />
            ) : marketOpp ? (
              <RecommendationCard
                variant="opportunity"
                title="Market Opportunity"
                heading={marketOpp.title}
                content={marketOpp.content}
              />
            ) : (
              <RecommendationCard
                variant="opportunity"
                title="Market Opportunity"
                heading="Home Remodel Expansion"
                content="Home remodel projects show the highest average ticket size. Consider targeted marketing campaigns to grow this segment from 37 to 50+ projects next quarter."
              />
            )}
          </StaggerItem>
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
