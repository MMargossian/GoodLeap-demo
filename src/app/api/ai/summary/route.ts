import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT =
  "You are an analytics advisor for solar and home improvement contractors using the GoodLeap platform. Write clear, professional executive summaries.";

const FALLBACK_SUMMARY = `EverGreen Climate demonstrates solid overall performance across key business areas. Revenue of $2.48M with 140 completed projects reflects consistent market penetration, supported by a strong 22% conversion rate that outpaces the 18% peer average. The 3-month consecutive growth streak and 95.2% target attainment indicate healthy momentum heading into the next quarter.

Funding health presents a mixed picture. While the 59.5% approval rate is competitive, the 40.2% pull-through rate reveals a significant gap between approved and funded projects. Addressing this post-approval drop-off represents the single largest revenue opportunity. The 3.2% delinquency rate remains well within acceptable limits, reflecting good credit screening practices.

Customer satisfaction scores are encouraging, with 58% of customers recommending EverGreen Climate and only 11% detractors. However, the installation touchpoint lags at 48% recommendation rate, signaling a need for improved on-site procedures. Project pipeline efficiency is strong at the top of funnel, though the NTP stage at 12 days and 39% expiring loan rate warrant immediate attention to prevent revenue leakage.

Strategic priorities for the next quarter should focus on three areas: (1) streamlining the post-approval funding process to close the pull-through gap, (2) implementing installation quality improvements including mandatory cleanup checklists and QC inspections, and (3) accelerating the NTP stage through workflow automation to reduce the 39% loan expiration rate.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metrics } = body as { metrics: Record<string, unknown> };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        summary: FALLBACK_SUMMARY,
        source: "fallback",
      });
    }

    const client = new Anthropic({ apiKey });

    const prompt = `Given these contractor performance metrics across all business areas:
${JSON.stringify(metrics, null, 2)}

Write a 3-4 paragraph executive summary for a performance report. Cover:
1. Overall business health and revenue performance
2. Key strengths and competitive advantages
3. Areas of concern requiring attention
4. Strategic recommendations for the next quarter

Be specific with numbers from the data. Write in a professional, concise style suitable for executive leadership.
Respond with ONLY the summary text, no headers or formatting.`;

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

    return NextResponse.json({
      summary: textBlock.text.trim(),
      source: "ai",
    });
  } catch (error) {
    console.error("AI Summary API error:", error);
    return NextResponse.json({
      summary: FALLBACK_SUMMARY,
      source: "fallback",
    });
  }
}
