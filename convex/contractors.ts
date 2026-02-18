import { query } from "./_generated/server";
import { v } from "convex/values";

export const getContractor = query({
  args: { contractor_id: v.id("contractors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contractor_id);
  },
});

export const getDefaultContractor = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contractors").first();
  },
});

export const getContractorUser = query({
  args: { contractor_id: v.optional(v.id("contractors")) },
  handler: async (ctx, args) => {
    let contractorId = args.contractor_id;
    if (!contractorId) {
      const contractor = await ctx.db.query("contractors").first();
      if (!contractor) return null;
      contractorId = contractor._id;
    }
    return await ctx.db
      .query("users")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .first();
  },
});
