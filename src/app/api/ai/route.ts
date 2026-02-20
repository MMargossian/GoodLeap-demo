import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FALLBACK_INSIGHTS, type FallbackInsight } from "@/lib/fallback-insights";

const SYSTEM_PROMPT =
  "You are an analytics advisor for solar and home improvement contractors using the GoodLeap platform. Provide actionable, data-driven insights. Be concise and specific.";

function buildPrompt(section: string, metrics: Record<string, unknown>): string {
  const metricsJson = JSON.stringify(metrics, null, 2);

  const templates: Record<string, string> = {
    sales: `Analyze these sales performance metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 6 insights as a JSON array. Each object must have: insight_type, title, content.
The 6 insights should cover:
1. insight_type: "performance" — A Sales Performance Insight about current revenue trends
2. insight_type: "recommendation" — A Top Recommendation for improving sales
3. insight_type: "opportunity" — A Market Opportunity they should pursue
4. insight_type: "sales_insight" — A key insight about overall sales growth trajectory and market penetration
5. insight_type: "top_recommendation" — A specific, actionable top recommendation with a short heading-style title
6. insight_type: "market_opportunity" — A specific market opportunity to pursue with a short heading-style title

For types 5 and 6, the title should be a short heading (2-4 words) and content should be 1-2 sentences.
Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    funding: `Analyze these funding and loan metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 4 insights as a JSON array. Each object must have: insight_type, title, content.
The 4 insights should cover:
1. insight_type: "warning" — An Approval Alert about funding pipeline risks or issues
2. insight_type: "success" — A Portfolio Health insight about positive indicators
3. insight_type: "fico_takeaway" — A key takeaway about FICO score distribution and approval probability patterns
4. insight_type: "loan_insight" — A key insight about loan utilization and average funded amounts, including upsell opportunities

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    benchmarks: `Analyze these benchmark comparison metrics (contractor vs peers) for a GoodLeap contractor:
${metricsJson}

Provide exactly 6 insights as a JSON array. Each object must have: insight_type, title, content.
The 6 insights should cover:
1. insight_type: "excellence" — A Sales Excellence insight about where they outperform
2. insight_type: "loyalty" — A Customer Loyalty insight about retention and referrals
3. insight_type: "growth" — A Growth Potential insight about upsell or expansion
4. insight_type: "sales_excellence_card" — A Sales Excellence card insight about conversion rate and sales cycle advantages
5. insight_type: "customer_loyalty_card" — A Customer Loyalty card insight about repeat rate, referrals, and acquisition costs
6. insight_type: "growth_potential_card" — A Growth Potential card insight about upsell rate and training recommendations

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    projects: `Analyze these project pipeline metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 9 insights as a JSON array. Each object must have: insight_type, title, content.
The 9 insights should cover:
1. insight_type: "bottleneck" — A Bottleneck Detection insight about pipeline slowdowns
2. insight_type: "lag" — An Efficiency Insight about process delays
3. insight_type: "strength" — A Stage Optimization insight about what works well
4. insight_type: "efficiency_takeaway_1" — First stage efficiency takeaway about the longest stage
5. insight_type: "efficiency_takeaway_2" — Second stage efficiency takeaway about cycle time trends
6. insight_type: "efficiency_takeaway_3" — Third stage efficiency takeaway about funding efficiency improvements
7. insight_type: "bottleneck_card" — A Bottleneck Detected card about NTP or other stage delays with specific days and benchmarks
8. insight_type: "signature_lag_card" — A Signature Lag card about document signing delays and recommended solutions
9. insight_type: "approval_strength_card" — An Approval Strength card about pull-through rate compared to industry averages

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    satisfaction: `Analyze these customer satisfaction and NPS metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 9 insights as a JSON array. Each object must have: insight_type, title, content.
The 9 insights should cover:
1. insight_type: "installation" — An Installation Experience insight about that touchpoint
2. insight_type: "trend" — An Overall Trend insight about sentiment direction
3. insight_type: "post-funding" — An Improvement Priority for the post-funding experience
4. insight_type: "installation_card" — An Installation Improvement insight about lowest recommendation rates and specific fixes
5. insight_type: "post_funding_card" — A Positive Post-Funding insight about recommendation rates after project completion
6. insight_type: "sentiment_card" — An Above Average Sentiment insight about overall recommendation rates and targeting neutral segment
7. insight_type: "cleanup_insight" — A Site Cleanup insight about debris and cleanup procedures
8. insight_type: "quality_insight" — An Install Quality insight about panel alignment and QC inspections
9. insight_type: "followup_insight" — A Follow-ups insight about post-installation call scheduling

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,
  };

  return templates[section] || templates.sales;
}

function getFallbackInsights(section: string): FallbackInsight[] {
  return FALLBACK_INSIGHTS[section] || FALLBACK_INSIGHTS.sales;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, metrics } = body as {
      section: string;
      metrics: Record<string, unknown>;
    };

    if (!section) {
      return NextResponse.json(
        { error: "Missing required field: section" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        insights: getFallbackInsights(section),
        source: "fallback",
        message: "ANTHROPIC_API_KEY not configured. Showing default insights.",
      });
    }

    const client = new Anthropic({ apiKey });

    const prompt = buildPrompt(section, metrics || {});

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Strip markdown code fences if present
    let rawText = textBlock.text.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
    }

    const insights: FallbackInsight[] = JSON.parse(rawText);

    return NextResponse.json({
      insights,
      source: "ai",
    });
  } catch (error) {
    console.error("AI API error:", error);

    // Try to extract section from the request for fallback
    let section = "sales";
    try {
      const body = await request.clone().json();
      section = body.section || "sales";
    } catch {
      // Use default section
    }

    return NextResponse.json({
      insights: getFallbackInsights(section),
      source: "fallback",
      message: "AI generation failed. Showing default insights.",
    });
  }
}
