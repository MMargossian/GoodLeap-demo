import { query } from "./_generated/server";
import { v } from "convex/values";

export const getSalesData = query({
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
      .query("sales_data")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.find((r) => r.period === args.period) ?? null;
    }
    return results[0] ?? null;
  },
});

export const getRevenueMonthly = query({
  args: {
    contractor_id: v.optional(v.id("contractors")),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let contractorId = args.contractor_id;
    if (!contractorId) {
      const contractor = await ctx.db.query("contractors").first();
      if (!contractor) return [];
      contractorId = contractor._id;
    }
    const results = await ctx.db
      .query("revenue_monthly")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    const year = args.year ?? 2024;
    return results
      .filter((r) => r.year === year)
      .sort((a, b) => a.month - b.month);
  },
});

export const getDepartmentPerformance = query({
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
      .query("department_perf")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.filter((r) => r.period === args.period);
    }
    return results;
  },
});

export const getTopReps = query({
  args: {
    contractor_id: v.optional(v.id("contractors")),
    department: v.optional(v.string()),
    period: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let contractorId = args.contractor_id;
    if (!contractorId) {
      const contractor = await ctx.db.query("contractors").first();
      if (!contractor) return [];
      contractorId = contractor._id;
    }
    let results = await ctx.db
      .query("top_reps")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.department) {
      results = results.filter((r) => r.department === args.department);
    }
    if (args.period) {
      results = results.filter((r) => r.period === args.period);
    }
    return results.sort((a, b) => b.amount - a.amount);
  },
});

export const getProductMix = query({
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
      .query("product_mix")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.filter((r) => r.period === args.period);
    }
    return results;
  },
});
