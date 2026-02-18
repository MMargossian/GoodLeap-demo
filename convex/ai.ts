import { query, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getInsights = query({
  args: {
    contractor_id: v.optional(v.id("contractors")),
    section: v.string(),
  },
  handler: async (ctx, args) => {
    let contractorId = args.contractor_id;
    if (!contractorId) {
      const contractor = await ctx.db.query("contractors").first();
      if (!contractor) return [];
      contractorId = contractor._id;
    }
    return await ctx.db
      .query("ai_insights")
      .withIndex("by_contractor_section", (q) =>
        q.eq("contractor_id", contractorId).eq("section", args.section)
      )
      .collect();
  },
});

export const storeInsight = internalMutation({
  args: {
    contractor_id: v.id("contractors"),
    section: v.string(),
    insight_type: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ai_insights", {
      contractor_id: args.contractor_id,
      section: args.section,
      insight_type: args.insight_type,
      title: args.title,
      content: args.content,
      generated_at: Date.now(),
    });
  },
});

export const generateInsights = action({
  args: {
    contractor_id: v.id("contractors"),
    section: v.string(),
    metrics: v.string(),
  },
  handler: async (ctx, args) => {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      temperature: 0.3,
      system:
        "You are an analytics advisor for solar and home improvement contractors using the GoodLeap platform. Provide actionable, data-driven insights based on the contractor's performance metrics. Be concise and specific. Return your response as JSON with fields: insight_type (string), title (string), content (string).",
      messages: [
        {
          role: "user",
          content: `Analyze these ${args.section} metrics for a contractor and provide one key insight:\n\n${args.metrics}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from AI");
    }

    const parsed = JSON.parse(textBlock.text);

    await ctx.runMutation(internal.ai.storeInsight, {
      contractor_id: args.contractor_id,
      section: args.section,
      insight_type: parsed.insight_type,
      title: parsed.title,
      content: parsed.content,
    });

    return parsed;
  },
});
