import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contractors: defineTable({
    name: v.string(),
    logo: v.optional(v.string()),
    greeting_name: v.string(),
  }),

  users: defineTable({
    contractor_id: v.id("contractors"),
    name: v.string(),
    email: v.string(),
    role: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  sales_data: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    revenue: v.number(),
    target: v.number(),
    projects: v.number(),
    avg_sale: v.number(),
    conversion_rate: v.number(),
    referral_conversion: v.number(),
    repeat_customer_rate: v.number(),
    upsell_rate: v.number(),
    avg_sales_cycle: v.number(),
    cancellations: v.number(),
    avg_install_length: v.number(),
  }).index("by_contractor", ["contractor_id"]),

  revenue_monthly: defineTable({
    contractor_id: v.id("contractors"),
    year: v.number(),
    month: v.number(),
    actual_revenue: v.number(),
    forecast_revenue: v.optional(v.number()),
  }).index("by_contractor", ["contractor_id"]),

  department_perf: defineTable({
    contractor_id: v.id("contractors"),
    department: v.string(),
    revenue: v.number(),
    period: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  top_reps: defineTable({
    contractor_id: v.id("contractors"),
    department: v.string(),
    rep_name: v.string(),
    amount: v.number(),
    period: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  product_mix: defineTable({
    contractor_id: v.id("contractors"),
    category: v.string(),
    count: v.number(),
    period: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  funding_health: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    approval_rate: v.number(),
    sales_pull_through: v.number(),
    total_delinquent: v.number(),
    delinquency_rate: v.number(),
    payment_status: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  fico_distribution: defineTable({
    contractor_id: v.id("contractors"),
    fico_range: v.string(),
    approval_probability: v.number(),
    period: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  loan_amounts: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    avg_loan: v.number(),
    utilization_rate: v.number(),
    total_funded: v.number(),
  }).index("by_contractor", ["contractor_id"]),

  pipeline_stages: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    stage: v.string(),
    count: v.number(),
    avg_days: v.number(),
    similar_contractor_avg_days: v.number(),
  }).index("by_contractor", ["contractor_id"]),

  expiring_loans: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    expiring_pct: v.number(),
    expired_value: v.number(),
    active_inventory_days: v.number(),
  }).index("by_contractor", ["contractor_id"]),

  action_items: defineTable({
    contractor_id: v.id("contractors"),
    stage: v.string(),
    action_text: v.string(),
    project_count: v.number(),
    risk_level: v.string(),
    period: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  benchmarks: defineTable({
    contractor_id: v.id("contractors"),
    metric_name: v.string(),
    contractor_value: v.number(),
    peer_value: v.number(),
    period: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  customer_feedback: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    would_recommend_pct: v.number(),
    neutral_pct: v.number(),
    would_not_recommend_pct: v.number(),
    open_issues: v.number(),
    defective_projects: v.number(),
    defective_rate: v.number(),
    escalations: v.number(),
  }).index("by_contractor", ["contractor_id"]),

  feedback_by_touchpoint: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    touchpoint: v.string(),
    recommend_pct: v.number(),
    neutral_pct: v.number(),
    not_recommend_pct: v.number(),
  }).index("by_contractor", ["contractor_id"]),

  customer_insights: defineTable({
    contractor_id: v.id("contractors"),
    period: v.string(),
    category: v.string(),
    description: v.string(),
  }).index("by_contractor", ["contractor_id"]),

  ai_insights: defineTable({
    contractor_id: v.id("contractors"),
    section: v.string(),
    insight_type: v.string(),
    title: v.string(),
    content: v.string(),
    generated_at: v.number(),
  }).index("by_contractor_section", ["contractor_id", "section"]),
});
