"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightCard } from "@/components/cards/insight-card";
import { RecommendationBreakdown } from "@/components/charts/recommendation-breakdown";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ThumbsUp,
  Minus,
  ThumbsDown,
  AlertCircle,
  Wrench,
  Layers,
  Phone,
} from "lucide-react";
import {
  AnimatedCard,
  AnimatedNumber,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/animated";
import { useCustomerSatisfactionData } from "@/hooks/useConvexData";
import { AIInsightsSection } from "@/components/ai-insights-section";
import { useAIInsights } from "@/hooks/useAIInsights";

export default function CustomerSatisfactionPage() {
  const { feedback, touchpoints, insights } = useCustomerSatisfactionData();

  const wouldRecommend = feedback?.would_recommend_pct ?? 58;
  const neutral = feedback?.neutral_pct ?? 31;
  const wouldNotRecommend = feedback?.would_not_recommend_pct ?? 11;
  const openIssues = feedback?.open_issues ?? 23;
  const defectiveProjects = feedback?.defective_projects ?? 8;
  const defectiveRate = feedback?.defective_rate ?? 5.7;
  const escalations = feedback?.escalations ?? 4;

  const satisfactionMetrics = {
    wouldRecommend: `${wouldRecommend}%`,
    neutral: `${neutral}%`,
    wouldNotRecommend: `${wouldNotRecommend}%`,
    openIssues,
    defectiveProjects,
    defectiveRate: `${defectiveRate}%`,
    escalations,
  };

  const { insights: aiInsights, getInsightByType, isLoading, isRefreshing, refresh } = useAIInsights("satisfaction", satisfactionMetrics);

  const installationCard = getInsightByType("installation_card");
  const postFundingCard = getInsightByType("post_funding_card");
  const sentimentCard = getInsightByType("sentiment_card");
  const cleanupInsight = getInsightByType("cleanup_insight");
  const qualityInsight = getInsightByType("quality_insight");
  const followupInsight = getInsightByType("followup_insight");

  const customerInsightItems = [
    { insight: cleanupInsight, fallbackCategory: "Site Cleanup", fallbackDescription: "Multiple reports of debris left after installation. Implement mandatory cleanup checklist.", icon: Wrench },
    { insight: qualityInsight, fallbackCategory: "Install Quality", fallbackDescription: "Panel alignment issues reported in 12% of installations. Schedule additional QC inspections.", icon: Layers },
    { insight: followupInsight, fallbackCategory: "Follow-ups", fallbackDescription: "Post-installation follow-up calls delayed by average 5 days. Automate scheduling within 48 hours.", icon: Phone },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Satisfaction</h1>
          <p className="text-sm text-muted-foreground">Customer sentiment and recommendation analytics</p>
        </div>

        {/* Section 1: Customer Sentiment */}
        <div>
          <FadeIn delay={0.05}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Customer Sentiment Overview
            </h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
            {/* Three large stat cards */}
            <div className="space-y-4 md:col-span-2 lg:col-span-3">
              <StaggerContainer staggerDelay={0.1} className="grid gap-4 sm:grid-cols-3">
                <StaggerItem>
                  <AnimatedCard>
                    <CardContent className="p-6 text-center">
                      <ThumbsUp className="mx-auto h-8 w-8 text-emerald-500" />
                      <p className="mt-2 text-4xl font-bold text-emerald-600">
                        <AnimatedNumber value={wouldRecommend} format="percent" />
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Would Recommend
                      </p>
                    </CardContent>
                  </AnimatedCard>
                </StaggerItem>
                <StaggerItem>
                  <AnimatedCard>
                    <CardContent className="p-6 text-center">
                      <Minus className="mx-auto h-8 w-8 text-amber-500" />
                      <p className="mt-2 text-4xl font-bold text-amber-600">
                        <AnimatedNumber value={neutral} format="percent" />
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">Neutral</p>
                    </CardContent>
                  </AnimatedCard>
                </StaggerItem>
                <StaggerItem>
                  <AnimatedCard>
                    <CardContent className="p-6 text-center">
                      <ThumbsDown className="mx-auto h-8 w-8 text-red-500" />
                      <p className="mt-2 text-4xl font-bold text-red-600">
                        <AnimatedNumber value={wouldNotRecommend} format="percent" />
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Would Not Recommend
                      </p>
                    </CardContent>
                  </AnimatedCard>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Side stats */}
            <FadeIn direction="right" delay={0.3}>
              <AnimatedCard>
                <CardHeader>
                  <CardTitle className="text-sm">Issue Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Customer Issues</p>
                      <p className="text-xl font-bold">
                        <AnimatedNumber value={openIssues} />
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Defective Projects</span>
                    <span className="font-medium">{defectiveProjects}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Defective Rate</span>
                    <span className="font-medium">{defectiveRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Escalations</span>
                    <span className="font-medium">{escalations}</span>
                  </div>
                </CardContent>
              </AnimatedCard>
            </FadeIn>
          </div>
        </div>

        {/* Section 2: Recommendation Breakdown */}
        <FadeIn delay={0.15}>
          <AnimatedCard>
            <CardHeader>
              <CardTitle>Recommendation Breakdown by Touchpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <RecommendationBreakdown />
            </CardContent>
          </AnimatedCard>
        </FadeIn>

        {/* Section 3: Key Takeaways - AI Powered */}
        <div>
          <FadeIn delay={0.05}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Key Takeaways
            </h2>
          </FadeIn>
          <StaggerContainer staggerDelay={0.12} className="grid gap-4 md:grid-cols-3">
            <StaggerItem>
              {isLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : installationCard ? (
                <InsightCard
                  type="warning"
                  title={installationCard.title}
                  content={installationCard.content}
                />
              ) : (
                <InsightCard
                  type="warning"
                  title="Installation Improvement Needed"
                  content="Installation touchpoint has lowest recommendation rate (48%). Focus on cleanup procedures and panel alignment quality to boost satisfaction."
                />
              )}
            </StaggerItem>
            <StaggerItem>
              {isLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : postFundingCard ? (
                <InsightCard
                  type="success"
                  title={postFundingCard.title}
                  content={postFundingCard.content}
                />
              ) : (
                <InsightCard
                  type="success"
                  title="Positive Post-Funding Experience"
                  content="55% recommendation in post-funding with only 7% negative shows strong ongoing customer relationships after project completion."
                />
              )}
            </StaggerItem>
            <StaggerItem>
              {isLoading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : sentimentCard ? (
                <InsightCard
                  type="info"
                  title={sentimentCard.title}
                  content={sentimentCard.content}
                />
              ) : (
                <InsightCard
                  type="info"
                  title="Above Average Sentiment"
                  content="58% recommendation rate with only 11% detractors puts you in a solid position. Target the 31% neutral segment with proactive outreach to convert them to promoters."
                />
              )}
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Section 4: Customer Insights - AI Powered */}
        <div>
          <FadeIn delay={0.05}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Customer Insights
            </h2>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="grid gap-4 md:grid-cols-3">
            {customerInsightItems.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.fallbackCategory}>
                  {isLoading ? (
                    <Skeleton className="h-32 w-full rounded-xl" />
                  ) : (
                    <AnimatedCard className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Icon className="h-4 w-4 text-primary" />
                          {item.insight ? item.insight.title : item.fallbackCategory}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {item.insight ? item.insight.content : item.fallbackDescription}
                        </p>
                      </CardContent>
                    </AnimatedCard>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* AI-Powered Insights */}
        <AIInsightsSection
          insights={aiInsights}
          isRefreshing={isRefreshing}
          refresh={refresh}
          insightTypes={["installation", "trend", "post-funding"]}
        />
      </div>
    </PageTransition>
  );
}
