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
  const topReps = useQuery(
    api.salesPerformance.getTopReps,
    available ? (filters.organization !== "all" ? { department: filters.organization } : {}) : "skip"
  );
  const productMix = useQuery(api.salesPerformance.getProductMix, available ? {} : "skip");

  const filteredDepartments = departmentPerf
    ? filters.organization !== "all"
      ? departmentPerf.filter((d) => d.department === filters.organization)
      : departmentPerf
    : null;

  const filteredProducts = productMix
    ? filters.productCategory !== "all"
      ? productMix.filter((p) => p.category === filters.productCategory)
      : productMix
    : null;

  return {
    salesData: salesData ?? null,
    revenueMonthly: revenueMonthly ?? [],
    departmentPerf: filteredDepartments ?? [],
    topReps: topReps ?? [],
    productMix: filteredProducts ?? [],
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
