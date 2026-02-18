import { query } from "./_generated/server";
import { v } from "convex/values";

export const getCustomerFeedback = query({
  args: {
    contractor_id: v.optional(v.id("contractors")),
    period: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let contractorId = args.contractor_id;
    if (!contractorId) {
      const contractor = await ctx.db.query("contractors").first();
      if (!contractor) return null;
      contractorId = contractor._id;
    }
    const results = await ctx.db
      .query("customer_feedback")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.find((r) => r.period === args.period) ?? null;
    }
    return results[0] ?? null;
  },
});

export const getFeedbackByTouchpoint = query({
  args: {
    contractor_id: v.optional(v.id("contractors")),
    period: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let contractorId = args.contractor_id;
    if (!contractorId) {
      const contractor = await ctx.db.query("contractors").first();
      if (!contractor) return [];
      contractorId = contractor._id;
    }
    const results = await ctx.db
      .query("feedback_by_touchpoint")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.filter((r) => r.period === args.period);
    }
    return results;
  },
});

export const getCustomerInsights = query({
  args: {
    contractor_id: v.optional(v.id("contractors")),
    period: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let contractorId = args.contractor_id;
    if (!contractorId) {
      const contractor = await ctx.db.query("contractors").first();
      if (!contractor) return [];
      contractorId = contractor._id;
    }
    const results = await ctx.db
      .query("customer_insights")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.filter((r) => r.period === args.period);
    }
    return results;
  },
});
