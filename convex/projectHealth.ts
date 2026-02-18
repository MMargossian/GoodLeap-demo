import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPipelineStages = query({
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
      .query("pipeline_stages")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.filter((r) => r.period === args.period);
    }
    return results;
  },
});

export const getExpiringLoans = query({
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
      .query("expiring_loans")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.find((r) => r.period === args.period) ?? null;
    }
    return results[0] ?? null;
  },
});

export const getActionItems = query({
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
      .query("action_items")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.filter((r) => r.period === args.period);
    }
    return results;
  },
});
