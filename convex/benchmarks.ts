import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBenchmarks = query({
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
      .query("benchmarks")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    if (args.period) {
      return results.filter((r) => r.period === args.period);
    }
    return results;
  },
});
