"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useConvexAvailable } from "@/components/providers/convex-provider";
import { useDashboardFilters } from "@/contexts/dashboard-filters";

// --- Sales Performance Data ---
export function useSalesData() {
  const available = useConvexAvailable();
  const { filters } = useDashboardFilters();

  const salesData = useQuery(api.salesPerformance.getSalesData, available ? {} : "skip");
  const revenueMonthly = useQuery(api.salesPerformance.getRevenueMonthly, available ? {} : "skip");
  const departmentPerf = useQuery(api.salesPerformance.getDepartmentPerformance, available ? {} : "skip");
  const topReps = useQuery(api.salesPerformance.getTopReps, available ? {} : "skip");
  const productMix = useQuery(api.salesPerformance.getProductMix, available ? {} : "skip");

  // Derive effective org filter: if a rep is selected, look up their department
  let effectiveOrg = filters.organization;
  if (filters.salesRep !== "all" && topReps) {
    const rep = topReps.find((r) => r.rep_name === filters.salesRep);
    if (rep) {
      effectiveOrg = rep.department;
    }
  }
  const orgActive = effectiveOrg !== "all";
  const categoryActive = filters.productCategory !== "all";

  // Filter department performance by org
  const filteredDepartments = departmentPerf
    ? orgActive
      ? departmentPerf.filter((d) => d.department === effectiveOrg)
      : departmentPerf
    : [];

  // Filter top reps by effective org + specific rep name
  const filteredReps = topReps
    ? topReps.filter((r) => {
        if (orgActive && r.department !== effectiveOrg) return false;
        if (filters.salesRep !== "all" && r.rep_name !== filters.salesRep) return false;
        return true;
      })
    : [];

  // Filter product mix by department and category, then aggregate by category
  const filteredProducts = (() => {
    if (!productMix) return [];
    let rows = productMix;
    if (orgActive) {
      rows = rows.filter((p) => p.department === effectiveOrg);
    }
    if (categoryActive) {
      rows = rows.filter((p) => p.category === filters.productCategory);
    }
    // Aggregate by category (sum across departments)
    if (!orgActive || rows.length === 0) {
      const byCat = new Map<string, number>();
      for (const r of rows) {
        byCat.set(r.category, (byCat.get(r.category) ?? 0) + r.count);
      }
      return Array.from(byCat.entries()).map(([category, count]) => ({ category, count }));
    }
    return rows.map((r) => ({ category: r.category, count: r.count }));
  })();

  // Filter revenue monthly by department, then aggregate by month
  const filteredRevenue = (() => {
    if (!revenueMonthly) return [];
    let rows = revenueMonthly;
    if (orgActive) {
      rows = rows.filter((r) => r.department === effectiveOrg);
    }
    // Aggregate by month (sum across departments)
    if (!orgActive) {
      const byMonth = new Map<number, { actual: number; forecast: number | undefined }>();
      for (const r of rows) {
        const existing = byMonth.get(r.month);
        if (existing) {
          existing.actual += r.actual_revenue;
          if (r.forecast_revenue !== undefined) {
            existing.forecast = (existing.forecast ?? 0) + r.forecast_revenue;
          }
        } else {
          byMonth.set(r.month, {
            actual: r.actual_revenue,
            forecast: r.forecast_revenue,
          });
        }
      }
      return Array.from(byMonth.entries())
        .sort(([a], [b]) => a - b)
        .map(([month, data]) => ({
          month,
          year: 2024,
          actual_revenue: data.actual,
          forecast_revenue: data.forecast,
        }));
    }
    return rows.map((r) => ({
      month: r.month,
      year: r.year,
      actual_revenue: r.actual_revenue,
      forecast_revenue: r.forecast_revenue,
    }));
  })();

  return {
    salesData: salesData ?? null,
    revenueMonthly: filteredRevenue,
    departmentPerf: filteredDepartments,
    topReps: filteredReps,
    productMix: filteredProducts,
    isLoading: available && salesData === undefined,
  };
}

// --- Funding Health Data ---
export function useFundingData() {
  const available = useConvexAvailable();

  const fundingHealth = useQuery(api.fundingHealth.getFundingHealth, available ? {} : "skip");
  const ficoDistribution = useQuery(api.fundingHealth.getFicoDistribution, available ? {} : "skip");
  const loanAmounts = useQuery(api.fundingHealth.getLoanAmounts, available ? {} : "skip");

  return {
    fundingHealth: fundingHealth ?? null,
    ficoDistribution: ficoDistribution ?? [],
    loanAmounts: loanAmounts ?? null,
    isLoading: available && fundingHealth === undefined,
  };
}

// --- Benchmarks Data ---
export function useBenchmarkData() {
  const available = useConvexAvailable();

  const benchmarks = useQuery(api.benchmarks.getBenchmarks, available ? {} : "skip");

  return {
    benchmarks: benchmarks ?? [],
    isLoading: available && benchmarks === undefined,
  };
}

// --- Project Health Data ---
export function useProjectHealthData() {
  const available = useConvexAvailable();

  const pipelineStages = useQuery(api.projectHealth.getPipelineStages, available ? {} : "skip");
  const expiringLoans = useQuery(api.projectHealth.getExpiringLoans, available ? {} : "skip");
  const actionItems = useQuery(api.projectHealth.getActionItems, available ? {} : "skip");

  return {
    pipelineStages: pipelineStages ?? [],
    expiringLoans: expiringLoans ?? null,
    actionItems: actionItems ?? [],
    isLoading: available && pipelineStages === undefined,
  };
}

// --- Customer Satisfaction Data ---
export function useCustomerSatisfactionData() {
  const available = useConvexAvailable();

  const feedback = useQuery(api.customerSatisfaction.getCustomerFeedback, available ? {} : "skip");
  const touchpoints = useQuery(api.customerSatisfaction.getFeedbackByTouchpoint, available ? {} : "skip");
  const insights = useQuery(api.customerSatisfaction.getCustomerInsights, available ? {} : "skip");

  return {
    feedback: feedback ?? null,
    touchpoints: touchpoints ?? [],
    insights: insights ?? [],
    isLoading: available && feedback === undefined,
  };
}

// --- AI Insights ---
export function useAIInsightsConvex(section: string) {
  const available = useConvexAvailable();

  const insights = useQuery(api.ai.getInsights, available ? { section } : "skip");

  return {
    insights: insights ?? [],
    isLoading: available && insights === undefined,
  };
}

// --- Contractor Info ---
export function useContractorInfo() {
  const available = useConvexAvailable();

  const contractor = useQuery(api.contractors.getDefaultContractor, available ? {} : "skip");
  const user = useQuery(api.contractors.getContractorUser, available ? {} : "skip");

  return {
    contractor: contractor ?? null,
    user: user ?? null,
    isLoading: available && contractor === undefined,
  };
}
