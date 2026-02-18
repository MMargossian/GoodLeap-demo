"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightCard } from "@/components/cards/insight-card";
import { RecommendationBreakdown } from "@/components/charts/recommendation-breakdown";
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

const defaultInsights = [
  { category: "Site Cleanup", description: "Multiple reports of debris left after installation. Implement mandatory cleanup checklist." },
  { category: "Install Quality", description: "Panel alignment issues reported in 12% of installations. Schedule additional QC inspections." },
  { category: "Follow-ups", description: "Post-installation follow-up calls delayed by average 5 days. Automate scheduling within 48 hours." },
];

export default function CustomerSatisfactionPage() {
  const { feedback, touchpoints, insights } = useCustomerSatisfactionData();

  const wouldRecommend = feedback?.would_recommend_pct ?? 58;
  const neutral = feedback?.neutral_pct ?? 31;
  const wouldNotRecommend = feedback?.would_not_recommend_pct ?? 11;
  const openIssues = feedback?.open_issues ?? 23;
  const defectiveProjects = feedback?.defective_projects ?? 8;
  const defectiveRate = feedback?.defective_rate ?? 5.7;
  const escalations = feedback?.escalations ?? 4;
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

        {/* Section 3: Key Takeaways */}
        <div>
          <FadeIn delay={0.05}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Key Takeaways
            </h2>
          </FadeIn>
          <StaggerContainer staggerDelay={0.12} className="grid gap-4 md:grid-cols-3">
            <StaggerItem>
              <InsightCard
                type="warning"
                title="Installation Improvement Needed"
                content="Installation touchpoint has lowest recommendation rate (48%). Focus on cleanup procedures and panel alignment quality to boost satisfaction."
              />
            </StaggerItem>
            <StaggerItem>
              <InsightCard
                type="success"
                title="Positive Post-Funding Experience"
                content="55% recommendation in post-funding with only 7% negative shows strong ongoing customer relationships after project completion."
              />
            </StaggerItem>
            <StaggerItem>
              <InsightCard
                type="info"
                title="Above Average Sentiment"
                content="58% recommendation rate with only 11% detractors puts you in a solid position. Target the 31% neutral segment with proactive outreach to convert them to promoters."
              />
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Section 4: Customer Insights */}
        <div>
          <FadeIn delay={0.05}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Customer Insights
            </h2>
          </FadeIn>
          <StaggerContainer staggerDelay={0.1} className="grid gap-4 md:grid-cols-3">
            {(insights.length > 0 ? insights : defaultInsights).map((item, i) => {
              const icons = [Wrench, Layers, Phone];
              const Icon = icons[i % icons.length];
              return (
                <StaggerItem key={item.category}>
                  <AnimatedCard className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Icon className="h-4 w-4 text-primary" />
                        {item.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </AnimatedCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </PageTransition>
  );
}
