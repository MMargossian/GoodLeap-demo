import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface AIInsight {
  insight_type: string;
  title: string;
  content: string;
}

const SYSTEM_PROMPT =
  "You are an analytics advisor for solar and home improvement contractors using the GoodLeap platform. Provide actionable, data-driven insights. Be concise and specific.";

function buildPrompt(section: string, metrics: Record<string, unknown>): string {
  const metricsJson = JSON.stringify(metrics, null, 2);

  const templates: Record<string, string> = {
    sales: `Analyze these sales performance metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 3 insights as a JSON array. Each object must have: insight_type, title, content.
The 3 insights should cover:
1. insight_type: "performance" — A Sales Performance Insight about current revenue trends
2. insight_type: "recommendation" — A Top Recommendation for improving sales
3. insight_type: "opportunity" — A Market Opportunity they should pursue

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    funding: `Analyze these funding and loan metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 2 insights as a JSON array. Each object must have: insight_type, title, content.
The 2 insights should cover:
1. insight_type: "warning" — An Approval Alert about funding pipeline risks or issues
2. insight_type: "success" — A Portfolio Health insight about positive indicators

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    benchmarks: `Analyze these benchmark comparison metrics (contractor vs peers) for a GoodLeap contractor:
${metricsJson}

Provide exactly 3 insights as a JSON array. Each object must have: insight_type, title, content.
The 3 insights should cover:
1. insight_type: "excellence" — A Sales Excellence insight about where they outperform
2. insight_type: "loyalty" — A Customer Loyalty insight about retention and referrals
3. insight_type: "growth" — A Growth Potential insight about upsell or expansion

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    projects: `Analyze these project pipeline metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 3 insights as a JSON array. Each object must have: insight_type, title, content.
The 3 insights should cover:
1. insight_type: "bottleneck" — A Bottleneck Detection insight about pipeline slowdowns
2. insight_type: "lag" — An Efficiency Insight about process delays
3. insight_type: "strength" — A Stage Optimization insight about what works well

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,

    satisfaction: `Analyze these customer satisfaction and NPS metrics for a GoodLeap contractor:
${metricsJson}

Provide exactly 3 insights as a JSON array. Each object must have: insight_type, title, content.
The 3 insights should cover:
1. insight_type: "installation" — An Installation Experience insight about that touchpoint
2. insight_type: "trend" — An Overall Trend insight about sentiment direction
3. insight_type: "post-funding" — An Improvement Priority for the post-funding experience

Keep each content field to 1-2 sentences. Be specific with numbers from the data.
Respond with ONLY the JSON array, no other text.`,
  };

  return templates[section] || templates.sales;
}

function getFallbackInsights(section: string): AIInsight[] {
  const fallbacks: Record<string, AIInsight[]> = {
    sales: [
      {
        insight_type: "performance",
        title: "Strong Growth Trajectory",
        content:
          "Your 3.9% revenue growth and $206K monthly average demonstrate consistent market penetration. Focus on maintaining Q4 momentum by targeting the home improvement segment.",
      },
      {
        insight_type: "recommendation",
        title: "Expand Referral Program",
        content:
          "With 38.9% referral conversion\u2014well above the 25% industry average\u2014invest in formalizing your referral incentive program to drive more high-quality leads.",
      },
      {
        insight_type: "opportunity",
        title: "Home Remodel Expansion",
        content:
          "Home remodel projects show the highest average ticket size. Target marketing campaigns to grow this segment from 37 to 50+ projects next quarter.",
      },
    ],
    funding: [
      {
        insight_type: "warning",
        title: "Pull-Through Gap",
        content:
          "59.5% approval rate is solid, but only 40.2% pull-through means you're losing nearly 20% of approved applicants. Streamline post-approval process.",
      },
      {
        insight_type: "success",
        title: "Healthy Portfolio",
        content:
          "3.2% delinquency rate is well within industry norms. Continue monitoring the 580-659 FICO segment.",
      },
    ],
    benchmarks: [
      {
        insight_type: "excellence",
        title: "Outperforming Peers",
        content:
          "Your 22% conversion rate exceeds the 18% peer average. Shorter sales cycle (34 vs 42 days) gives you a competitive edge.",
      },
      {
        insight_type: "loyalty",
        title: "Strong Retention",
        content:
          "42% repeat customer rate vs 35% peers and 38.9% referral rate show strong customer relationships reducing acquisition costs.",
      },
      {
        insight_type: "growth",
        title: "Upsell Opportunity",
        content:
          "28% upsell rate significantly exceeds the 20% peer average. Train the full sales team on top performers' strategies.",
      },
    ],
    projects: [
      {
        insight_type: "bottleneck",
        title: "Installation Bottleneck",
        content:
          "18.5 days at Install Complete stage vs 15 days for peers suggests scheduling or capacity constraints.",
      },
      {
        insight_type: "lag",
        title: "Contract Signing Delay",
        content:
          "4.5 days to sign contracts vs 3.8 peer avg indicates friction. Consider e-signature solutions.",
      },
      {
        insight_type: "strength",
        title: "Strong Top-of-Funnel",
        content:
          "68.8% submission-to-approval rate exceeds benchmarks. Pre-qualification process is effective.",
      },
    ],
    satisfaction: [
      {
        insight_type: "installation",
        title: "Installation Improvement Needed",
        content:
          "Installation touchpoint has lowest recommendation rate (48%). Focus on cleanup procedures and panel alignment.",
      },
      {
        insight_type: "trend",
        title: "Above Average Sentiment",
        content:
          "58% recommendation rate with only 11% detractors is solid. Target the 31% neutral segment with proactive outreach.",
      },
      {
        insight_type: "post-funding",
        title: "Positive Post-Funding",
        content:
          "55% recommendation in post-funding with only 7% negative shows strong ongoing customer relationships.",
      },
    ],
  };

  return fallbacks[section] || fallbacks.sales;
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

    const insights: AIInsight[] = JSON.parse(textBlock.text);

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
