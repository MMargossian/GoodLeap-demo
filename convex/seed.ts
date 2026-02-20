import { internalMutation } from "./_generated/server";

// Shared data constants used by both seed and reseedFilterData
const MONTHLY_TOTALS = [
  { month: 1, actual_revenue: 165000 },
  { month: 2, actual_revenue: 178000 },
  { month: 3, actual_revenue: 195000 },
  { month: 4, actual_revenue: 210000 },
  { month: 5, actual_revenue: 225000 },
  { month: 6, actual_revenue: 238000 },
  { month: 7, actual_revenue: 215000 },
  { month: 8, actual_revenue: 198000 },
  { month: 9, actual_revenue: 220000 },
  { month: 10, actual_revenue: 245000, forecast_revenue: 240000 },
  { month: 11, actual_revenue: 230000, forecast_revenue: 235000 },
  { month: 12, actual_revenue: 156700, forecast_revenue: 220000 },
] as { month: number; actual_revenue: number; forecast_revenue?: number }[];

const DEPT_REVENUE_SHARES: Record<string, number> = {
  "West Coast": 0.246,
  "Northeast": 0.199,
  "Southeast": 0.180,
  "Midwest": 0.147,
  "Southwest": 0.135,
  "Pacific NW": 0.092,
};

const PRODUCT_MIX_BY_DEPT = [
  { department: "West Coast", categories: [{ category: "Home Improvement", count: 14 }, { category: "Roofing", count: 10 }, { category: "Home Remodel", count: 9 }, { category: "Solar Panel", count: 8 }, { category: "HVAC", count: 5 }] },
  { department: "Northeast", categories: [{ category: "Home Improvement", count: 12 }, { category: "Roofing", count: 11 }, { category: "Home Remodel", count: 8 }, { category: "Solar Panel", count: 5 }, { category: "HVAC", count: 4 }] },
  { department: "Southeast", categories: [{ category: "Home Improvement", count: 10 }, { category: "Roofing", count: 9 }, { category: "Home Remodel", count: 7 }, { category: "Solar Panel", count: 6 }, { category: "HVAC", count: 4 }] },
  { department: "Midwest", categories: [{ category: "Home Improvement", count: 8 }, { category: "Roofing", count: 8 }, { category: "Home Remodel", count: 6 }, { category: "Solar Panel", count: 4 }, { category: "HVAC", count: 3 }] },
  { department: "Southwest", categories: [{ category: "Home Improvement", count: 7 }, { category: "Roofing", count: 6 }, { category: "Home Remodel", count: 5 }, { category: "Solar Panel", count: 3 }, { category: "HVAC", count: 2 }] },
  { department: "Pacific NW", categories: [{ category: "Home Improvement", count: 4 }, { category: "Roofing", count: 4 }, { category: "Home Remodel", count: 2 }, { category: "Solar Panel", count: 2 }, { category: "HVAC", count: 1 }] },
];

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query("contractors").first();
    if (existing) {
      return { message: "Data already seeded", contractorId: existing._id };
    }

    // 1. Create contractor
    const contractorId = await ctx.db.insert("contractors", {
      name: "EverGreen Climate",
      greeting_name: "John",
    });

    // 2. Create user
    await ctx.db.insert("users", {
      contractor_id: contractorId,
      name: "John",
      email: "john@evergreenclimate.com",
      role: "Sales Manager",
    });

    // 3. Sales data
    await ctx.db.insert("sales_data", {
      contractor_id: contractorId,
      period: "2024",
      revenue: 2475700,
      target: 2600000,
      projects: 140,
      avg_sale: 17683,
      conversion_rate: 22,
      referral_conversion: 38.9,
      repeat_customer_rate: 42,
      upsell_rate: 28,
      avg_sales_cycle: 34,
      cancellations: 12,
      avg_install_length: 4.2,
    });

    // 4. Monthly revenue (granular per-department)
    for (const m of MONTHLY_TOTALS) {
      for (const [dept, share] of Object.entries(DEPT_REVENUE_SHARES)) {
        await ctx.db.insert("revenue_monthly", {
          contractor_id: contractorId,
          year: 2024,
          month: m.month,
          actual_revenue: Math.round(m.actual_revenue * share),
          forecast_revenue: m.forecast_revenue ? Math.round(m.forecast_revenue * share) : undefined,
          department: dept,
        });
      }
    }

    // 5. Department performance
    const departments = [
      { department: "Northeast", revenue: 420000 },
      { department: "Southeast", revenue: 380000 },
      { department: "Midwest", revenue: 310000 },
      { department: "West Coast", revenue: 520000 },
      { department: "Southwest", revenue: 285000 },
      { department: "Pacific NW", revenue: 195000 },
    ];
    for (const d of departments) {
      await ctx.db.insert("department_perf", {
        contractor_id: contractorId,
        department: d.department,
        revenue: d.revenue,
        period: "2024",
      });
    }

    // 6. Top reps
    const topReps = [
      { department: "Northeast", rep_name: "Sarah Chen", amount: 185000 },
      { department: "Northeast", rep_name: "Mike Torres", amount: 142000 },
      { department: "Southeast", rep_name: "David Kim", amount: 168000 },
      { department: "Southeast", rep_name: "Lisa Wang", amount: 125000 },
      { department: "Midwest", rep_name: "James Miller", amount: 134000 },
      { department: "Midwest", rep_name: "Anna Scott", amount: 98000 },
      { department: "West Coast", rep_name: "Ryan Park", amount: 210000 },
      { department: "West Coast", rep_name: "Emily Davis", amount: 178000 },
      { department: "Southwest", rep_name: "Carlos Ruiz", amount: 145000 },
      { department: "Southwest", rep_name: "Amy Johnson", amount: 88000 },
      { department: "Pacific NW", rep_name: "Tom Wilson", amount: 112000 },
      { department: "Pacific NW", rep_name: "Jen Martinez", amount: 83000 },
    ];
    for (const r of topReps) {
      await ctx.db.insert("top_reps", {
        contractor_id: contractorId,
        department: r.department,
        rep_name: r.rep_name,
        amount: r.amount,
        period: "2024",
      });
    }

    // 7. Product mix (granular per-department)
    for (const dept of PRODUCT_MIX_BY_DEPT) {
      for (const p of dept.categories) {
        await ctx.db.insert("product_mix", {
          contractor_id: contractorId,
          category: p.category,
          count: p.count,
          period: "2024",
          department: dept.department,
        });
      }
    }

    // 8. Funding health
    await ctx.db.insert("funding_health", {
      contractor_id: contractorId,
      period: "2024",
      approval_rate: 59.5,
      sales_pull_through: 40.2,
      total_delinquent: 125000,
      delinquency_rate: 3.2,
      payment_status: "Good Standing",
    });

    // 9. FICO distribution
    const ficoRanges = [
      { fico_range: "580-619", approval_probability: 15 },
      { fico_range: "620-659", approval_probability: 35 },
      { fico_range: "660-699", approval_probability: 55 },
      { fico_range: "700-739", approval_probability: 72 },
      { fico_range: "740-779", approval_probability: 85 },
      { fico_range: "780+", approval_probability: 92 },
    ];
    for (const f of ficoRanges) {
      await ctx.db.insert("fico_distribution", {
        contractor_id: contractorId,
        fico_range: f.fico_range,
        approval_probability: f.approval_probability,
        period: "2024",
      });
    }

    // 10. Loan amounts
    await ctx.db.insert("loan_amounts", {
      contractor_id: contractorId,
      period: "2024",
      avg_loan: 28500,
      utilization_rate: 78,
      total_funded: 3990000,
    });

    // 11. Pipeline stages
    const stages = [
      { stage: "Submitted", count: 141, avg_days: 2.1, similar_contractor_avg_days: 2.5 },
      { stage: "Approved", count: 97, avg_days: 3.4, similar_contractor_avg_days: 4.2 },
      { stage: "Docs Sent", count: 84, avg_days: 1.8, similar_contractor_avg_days: 2.0 },
      { stage: "Contract Signed", count: 72, avg_days: 4.5, similar_contractor_avg_days: 3.8 },
      { stage: "NTP", count: 63, avg_days: 6.2, similar_contractor_avg_days: 5.0 },
      { stage: "Install Complete", count: 58, avg_days: 18.5, similar_contractor_avg_days: 15.0 },
      { stage: "Funded", count: 51, avg_days: 3.2, similar_contractor_avg_days: 3.5 },
    ];
    for (const s of stages) {
      await ctx.db.insert("pipeline_stages", {
        contractor_id: contractorId,
        period: "2024",
        stage: s.stage,
        count: s.count,
        avg_days: s.avg_days,
        similar_contractor_avg_days: s.similar_contractor_avg_days,
      });
    }

    // 12. Expiring loans
    await ctx.db.insert("expiring_loans", {
      contractor_id: contractorId,
      period: "2024",
      expiring_pct: 8.5,
      expired_value: 340000,
      active_inventory_days: 45,
    });

    // 13. Action items
    const actions = [
      { stage: "Approved", action_text: "Send loan documents to approved applicants", project_count: 13, risk_level: "high" },
      { stage: "Docs Sent", action_text: "Follow up on unsigned documents", project_count: 12, risk_level: "medium" },
      { stage: "Contract Signed", action_text: "Submit for NTP approval", project_count: 9, risk_level: "low" },
      { stage: "NTP", action_text: "Schedule installation appointments", project_count: 12, risk_level: "medium" },
      { stage: "Install Complete", action_text: "Submit funding request for completed installs", project_count: 7, risk_level: "high" },
      { stage: "Expiring", action_text: "Contact customers with expiring loan approvals", project_count: 15, risk_level: "high" },
    ];
    for (const a of actions) {
      await ctx.db.insert("action_items", {
        contractor_id: contractorId,
        stage: a.stage,
        action_text: a.action_text,
        project_count: a.project_count,
        risk_level: a.risk_level,
        period: "2024",
      });
    }

    // 14. Benchmarks
    const benchmarks = [
      { metric_name: "Conversion Rate", contractor_value: 22, peer_value: 18 },
      { metric_name: "Avg Sale", contractor_value: 17683, peer_value: 15200 },
      { metric_name: "Referral Rate", contractor_value: 38.9, peer_value: 25.0 },
      { metric_name: "Customer Retention", contractor_value: 42, peer_value: 35 },
      { metric_name: "Avg Sales Cycle", contractor_value: 34, peer_value: 42 },
      { metric_name: "Upsell Rate", contractor_value: 28, peer_value: 20 },
      { metric_name: "NPS Score", contractor_value: 58, peer_value: 52 },
    ];
    for (const b of benchmarks) {
      await ctx.db.insert("benchmarks", {
        contractor_id: contractorId,
        metric_name: b.metric_name,
        contractor_value: b.contractor_value,
        peer_value: b.peer_value,
        period: "2024",
      });
    }

    // 15. Customer feedback
    await ctx.db.insert("customer_feedback", {
      contractor_id: contractorId,
      period: "2024",
      would_recommend_pct: 58,
      neutral_pct: 31,
      would_not_recommend_pct: 11,
      open_issues: 23,
      defective_projects: 8,
      defective_rate: 5.7,
      escalations: 4,
    });

    // 16. Feedback by touchpoint
    const touchpoints = [
      { touchpoint: "Application & Sales", recommend_pct: 72, neutral_pct: 20, not_recommend_pct: 8 },
      { touchpoint: "Installation", recommend_pct: 48, neutral_pct: 35, not_recommend_pct: 17 },
      { touchpoint: "Post-Funding", recommend_pct: 55, neutral_pct: 38, not_recommend_pct: 7 },
    ];
    for (const t of touchpoints) {
      await ctx.db.insert("feedback_by_touchpoint", {
        contractor_id: contractorId,
        period: "2024",
        touchpoint: t.touchpoint,
        recommend_pct: t.recommend_pct,
        neutral_pct: t.neutral_pct,
        not_recommend_pct: t.not_recommend_pct,
      });
    }

    // 17. Customer insights
    const insights = [
      { category: "Site Cleanup", description: "Multiple reports of debris left after installation. Implement mandatory cleanup checklist." },
      { category: "Install Quality", description: "Panel alignment issues reported in 12% of installations. Schedule additional QC inspections." },
      { category: "Follow-ups", description: "Post-installation follow-up calls delayed by average 5 days. Automate scheduling within 48 hours." },
    ];
    for (const i of insights) {
      await ctx.db.insert("customer_insights", {
        contractor_id: contractorId,
        period: "2024",
        category: i.category,
        description: i.description,
      });
    }

    // 18. AI Insights (pre-generated)
    const now = Date.now();
    const aiInsights = [
      // Sales Performance
      { section: "sales", insight_type: "Sales Performance Insight", title: "Strong Growth Trajectory", content: "Your 3.9% revenue growth and $206K monthly average demonstrate consistent market penetration. Focus on maintaining the Q4 momentum by targeting the home improvement segment which shows highest conversion rates." },
      { section: "sales", insight_type: "Growth Insight", title: "Monthly Revenue Acceleration", content: "October peak of $245K suggests strong seasonal demand. Consider pre-positioning inventory and staffing for Q4 2025 to capture similar or greater revenue." },
      { section: "sales", insight_type: "Top Recommendation", title: "Expand Referral Program", content: "With 38.9% referral conversion\u2014well above the 25% industry average\u2014invest in formalizing your referral incentive program to drive even more high-quality leads." },
      { section: "sales", insight_type: "Market Opportunity", title: "Home Remodel Expansion", content: "Home remodel projects show the highest average ticket size. Consider targeted marketing campaigns to grow this segment from 37 to 50+ projects next quarter." },
      // Funding Health
      { section: "funding", insight_type: "Approval Alert", title: "Pull-Through Gap", content: "Your 59.5% approval rate is solid, but only 40.2% pull-through means you're losing nearly 20% of approved applicants. Streamline your post-approval process to capture more funded deals." },
      { section: "funding", insight_type: "Payment Performance", title: "Healthy Portfolio", content: "3.2% delinquency rate is well within industry norms. Continue monitoring the 580-659 FICO segment which carries higher risk." },
      // Benchmarks
      { section: "benchmarks", insight_type: "Sales Excellence", title: "Outperforming Peers", content: "Your conversion rate of 22% exceeds the peer average of 18%. Your shorter sales cycle (34 vs 42 days) gives you a competitive edge in closing deals faster." },
      { section: "benchmarks", insight_type: "Customer Loyalty", title: "Strong Retention", content: "42% repeat customer rate (vs 35% peers) and 38.9% referral rate show strong customer relationships. This organic growth engine reduces your customer acquisition costs." },
      { section: "benchmarks", insight_type: "Growth Potential", title: "Upsell Opportunity", content: "28% upsell rate significantly exceeds the 20% peer average. Train the full sales team on the upsell strategies your top performers use." },
      // Project Health
      { section: "projects", insight_type: "Bottleneck Detection", title: "Installation Bottleneck", content: "Average 18.5 days at Install Complete stage (vs 15 days for similar contractors) suggests installation scheduling or capacity constraints." },
      { section: "projects", insight_type: "Signature Lag", title: "Contract Signing Delay", content: "4.5 days to sign contracts (vs 3.8 peer avg) indicates friction in the signing process. Consider e-signature solutions or simplified contracts." },
      { section: "projects", insight_type: "Approval Strength", title: "Strong Top-of-Funnel", content: "68.8% submission-to-approval rate exceeds industry benchmarks. Your pre-qualification process is effective at filtering quality applications." },
      // Customer Satisfaction
      { section: "satisfaction", insight_type: "Installation Experience", title: "Installation Improvement Needed", content: "Installation touchpoint has lowest recommendation rate (48%). Focus on cleanup procedures and panel alignment quality to boost satisfaction." },
      { section: "satisfaction", insight_type: "Post-Funding Success", title: "Positive Post-Funding Experience", content: "55% recommendation in post-funding with only 7% negative shows strong ongoing customer relationships after project completion." },
      { section: "satisfaction", insight_type: "Overall Trend", title: "Above Average Sentiment", content: "58% recommendation rate with only 11% detractors puts you in a solid position. Target the 31% neutral segment with proactive outreach to convert them to promoters." },
    ];
    for (const ai of aiInsights) {
      await ctx.db.insert("ai_insights", {
        contractor_id: contractorId,
        section: ai.section,
        insight_type: ai.insight_type,
        title: ai.title,
        content: ai.content,
        generated_at: now,
      });
    }

    return { message: "Seed complete", contractorId };
  },
});

// Reseed only product_mix and revenue_monthly with granular per-department data.
// Useful for updating these tables on an existing deployment without re-seeding everything.
export const reseedFilterData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const contractor = await ctx.db.query("contractors").first();
    if (!contractor) {
      throw new Error("No contractor found. Run seed first.");
    }
    const contractorId = contractor._id;

    // Delete existing product_mix rows
    const existingProducts = await ctx.db
      .query("product_mix")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    for (const row of existingProducts) {
      await ctx.db.delete(row._id);
    }

    // Delete existing revenue_monthly rows
    const existingRevenue = await ctx.db
      .query("revenue_monthly")
      .withIndex("by_contractor", (q) => q.eq("contractor_id", contractorId))
      .collect();
    for (const row of existingRevenue) {
      await ctx.db.delete(row._id);
    }

    // Insert 30 product_mix rows (6 departments x 5 categories)
    for (const dept of PRODUCT_MIX_BY_DEPT) {
      for (const p of dept.categories) {
        await ctx.db.insert("product_mix", {
          contractor_id: contractorId,
          category: p.category,
          count: p.count,
          period: "2024",
          department: dept.department,
        });
      }
    }

    // Insert 72 revenue_monthly rows (6 departments x 12 months)
    for (const m of MONTHLY_TOTALS) {
      for (const [dept, share] of Object.entries(DEPT_REVENUE_SHARES)) {
        await ctx.db.insert("revenue_monthly", {
          contractor_id: contractorId,
          year: 2024,
          month: m.month,
          actual_revenue: Math.round(m.actual_revenue * share),
          forecast_revenue: m.forecast_revenue ? Math.round(m.forecast_revenue * share) : undefined,
          department: dept,
        });
      }
    }

    return { message: "Reseed complete", productMixRows: 30, revenueMonthlyRows: 72 };
  },
});
