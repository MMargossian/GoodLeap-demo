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

export function HierarchyFilters() {
  const { toast } = useToast();

  return (
    <div className="flex items-center gap-4 border-b bg-[#f8fafc] px-6 py-3">
      {/* Left: Funnel icon + label */}
      <div className="flex items-center gap-2 mr-2">
        <Filter className="h-4 w-4 text-gray-700" />
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
          Hierarchy Filters
        </span>
      </div>

      {/* Sales Rep dropdown */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Sales Rep
        </span>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-blue-500" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] bg-white h-8 text-sm">
              <SelectValue placeholder="Sales Rep" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reps</SelectItem>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="mike-chen">Mike Chen</SelectItem>
              <SelectItem value="lisa-rodriguez">Lisa Rodriguez</SelectItem>
              <SelectItem value="david-kim">David Kim</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Organization dropdown */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Organization
        </span>
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-emerald-500" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[170px] bg-white h-8 text-sm">
              <SelectValue placeholder="Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              <SelectItem value="west">West Region</SelectItem>
              <SelectItem value="east">East Region</SelectItem>
              <SelectItem value="central">Central Region</SelectItem>
              <SelectItem value="south">South Region</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Category dropdown */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          Product Category
        </span>
        <div className="flex items-center gap-1.5">
          <LayoutGrid className="h-3.5 w-3.5 text-orange-500" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[170px] bg-white h-8 text-sm">
              <SelectValue placeholder="Product Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="solar">Solar Panel</SelectItem>
              <SelectItem value="home-improvement">Home Improvement</SelectItem>
              <SelectItem value="roofing">Roofing</SelectItem>
              <SelectItem value="remodel">Home Remodel</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right side: Save button + Role badge */}
      <div className="ml-auto flex items-center gap-3">
        <Button
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 h-8"
          onClick={() => toast("Selection saved")}
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
