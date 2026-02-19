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
      {
        insight_type: "sales_insight",
        title: "Strong Growth Trajectory",
        content:
          "Your 3.9% revenue growth and $206K monthly average demonstrate consistent market penetration. Focus on maintaining the Q4 momentum by targeting the home improvement segment which shows highest conversion rates.",
      },
      {
        insight_type: "top_recommendation",
        title: "Expand Referral Program",
        content:
          "With 38.9% referral conversion\u2014well above the 25% industry average\u2014invest in formalizing your referral incentive program to drive even more high-quality leads.",
      },
      {
        insight_type: "market_opportunity",
        title: "Home Remodel Expansion",
        content:
          "Home remodel projects show the highest average ticket size. Consider targeted marketing campaigns to grow this segment from 37 to 50+ projects next quarter.",
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
      {
        insight_type: "fico_takeaway",
        title: "FICO Distribution Impact",
        content:
          "Applications with FICO >700 have 85% approval vs. 45% below 700. Focusing on high-credit borrowers drastically improves pull-through.",
      },
      {
        insight_type: "loan_insight",
        title: "Loan Utilization Gap",
        content:
          "Customers are using only 36% of approved loan capacity. Average customer could borrow $400K but take $10,812, presenting a significant opportunity to upsell project add-ons.",
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
      {
        insight_type: "sales_excellence_card",
        title: "Sales Excellence",
        content:
          "Your conversion rate of 22% exceeds the peer average of 18%. Your shorter sales cycle (34 vs 42 days) gives you a competitive edge in closing deals faster.",
      },
      {
        insight_type: "customer_loyalty_card",
        title: "Customer Loyalty",
        content:
          "42% repeat customer rate (vs 35% peers) and 38.9% referral rate show strong customer relationships. This organic growth engine reduces your customer acquisition costs.",
      },
      {
        insight_type: "growth_potential_card",
        title: "Growth Potential",
        content:
          "28% upsell rate significantly exceeds the 20% peer average. Train the full sales team on the upsell strategies your top performers use.",
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
      {
        insight_type: "efficiency_takeaway_1",
        title: "Longest Stage",
        content:
          "Longest stage is currently Notice to Proceed at 12 days.",
      },
      {
        insight_type: "efficiency_takeaway_2",
        title: "Cycle Time Improving",
        content:
          "Overall cycle time is 3.2 days faster than last quarter.",
      },
      {
        insight_type: "efficiency_takeaway_3",
        title: "Funding Efficiency",
        content:
          "Funding efficiency has improved by 12% following new audit protocols.",
      },
      {
        insight_type: "bottleneck_card",
        title: "Bottleneck Detected",
        content:
          "The NTP stage is averaging 12 days, significantly above the 8-day benchmark. Consider streamlining the approval workflow to reduce delays.",
      },
      {
        insight_type: "signature_lag_card",
        title: "Signature Lag",
        content:
          "The signature cycle has increased by 1.2 days compared to last quarter. Automated reminders may help accelerate document completion.",
      },
      {
        insight_type: "approval_strength_card",
        title: "Approval Strength",
        content:
          "Approval-to-funding pull-through rate remains strong at 52.6%, exceeding the industry average by 8 percentage points.",
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
      {
        insight_type: "installation_card",
        title: "Installation Improvement Needed",
        content:
          "Installation touchpoint has lowest recommendation rate (48%). Focus on cleanup procedures and panel alignment quality to boost satisfaction.",
      },
      {
        insight_type: "post_funding_card",
        title: "Positive Post-Funding Experience",
        content:
          "55% recommendation in post-funding with only 7% negative shows strong ongoing customer relationships after project completion.",
      },
      {
        insight_type: "sentiment_card",
        title: "Above Average Sentiment",
        content:
          "58% recommendation rate with only 11% detractors puts you in a solid position. Target the 31% neutral segment with proactive outreach to convert them to promoters.",
      },
      {
        insight_type: "cleanup_insight",
        title: "Site Cleanup",
        content:
          "Multiple reports of debris left after installation. Implement mandatory cleanup checklist.",
      },
      {
        insight_type: "quality_insight",
        title: "Install Quality",
        content:
          "Panel alignment issues reported in 12% of installations. Schedule additional QC inspections.",
      },
      {
        insight_type: "followup_insight",
        title: "Follow-ups",
        content:
          "Post-installation follow-up calls delayed by average 5 days. Automate scheduling within 48 hours.",
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

    // Strip markdown code fences if present
    let rawText = textBlock.text.trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "").trim();
    }

    const insights: AIInsight[] = JSON.parse(rawText);

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
