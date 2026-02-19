"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Filter, Users, Globe, LayoutGrid, Bookmark } from "lucide-react";
import { DEMO_USER } from "@/lib/constants";
import { useDashboardFilters } from "@/contexts/dashboard-filters";

const SALES_REPS = [
  { value: "all", label: "All Reps" },
  { value: "Sarah Chen", label: "Sarah Chen" },
  { value: "Mike Torres", label: "Mike Torres" },
  { value: "David Kim", label: "David Kim" },
  { value: "Lisa Wang", label: "Lisa Wang" },
  { value: "James Miller", label: "James Miller" },
  { value: "Ryan Park", label: "Ryan Park" },
  { value: "Emily Davis", label: "Emily Davis" },
  { value: "Carlos Ruiz", label: "Carlos Ruiz" },
];

const ORGANIZATIONS = [
  { value: "all", label: "All Organizations" },
  { value: "Northeast", label: "Northeast" },
  { value: "Southeast", label: "Southeast" },
  { value: "Midwest", label: "Midwest" },
  { value: "West Coast", label: "West Coast" },
  { value: "Southwest", label: "Southwest" },
  { value: "Pacific NW", label: "Pacific NW" },
];

const PRODUCT_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "Home Improvement", label: "Home Improvement" },
  { value: "Roofing", label: "Roofing" },
  { value: "Home Remodel", label: "Home Remodel" },
  { value: "Solar Panel", label: "Solar Panel" },
  { value: "HVAC", label: "HVAC" },
];

export function HierarchyFilters() {
  const { toast } = useToast();
  const { filters, setFilter } = useDashboardFilters();

  return (
    <div className="flex items-center gap-4 border-b bg-[#f8fafc] px-6 py-3">
      <div className="flex items-center gap-2 mr-2">
        <Filter className="h-4 w-4 text-gray-700" />
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
          Hierarchy Filters
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Sales Rep
        </span>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-blue-500" />
          <Select value={filters.salesRep} onValueChange={(v) => setFilter("salesRep", v)}>
            <SelectTrigger className="w-[150px] bg-white h-8 text-sm">
              <SelectValue placeholder="Sales Rep" />
            </SelectTrigger>
            <SelectContent>
              {SALES_REPS.map((rep) => (
                <SelectItem key={rep.value} value={rep.value}>
                  {rep.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Organization
        </span>
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-emerald-500" />
          <Select value={filters.organization} onValueChange={(v) => setFilter("organization", v)}>
            <SelectTrigger className="w-[170px] bg-white h-8 text-sm">
              <SelectValue placeholder="Organization" />
            </SelectTrigger>
            <SelectContent>
              {ORGANIZATIONS.map((org) => (
                <SelectItem key={org.value} value={org.value}>
                  {org.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Product Category
        </span>
        <div className="flex items-center gap-1.5">
          <LayoutGrid className="h-3.5 w-3.5 text-orange-500" />
          <Select value={filters.productCategory} onValueChange={(v) => setFilter("productCategory", v)}>
            <SelectTrigger className="w-[170px] bg-white h-8 text-sm">
              <SelectValue placeholder="Product Category" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Button
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 h-8"
          onClick={() => toast("Filters applied")}
        >
          <Bookmark className="mr-1.5 h-3.5 w-3.5" />
          Save Selection
        </Button>

        <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Role: {DEMO_USER.role}
        </div>
      </div>
    </div>
  );
}
