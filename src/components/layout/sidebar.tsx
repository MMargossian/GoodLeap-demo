"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Heart,
} from "lucide-react";
import { NAV_ITEMS, DEMO_USER } from "@/lib/constants";

const iconMap = {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Heart,
} as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[280px] flex-col bg-white border-r border-gray-200 shrink-0">
      {/* Brand area */}
      <div className="px-6 pt-6 pb-4">
        <span className="text-xl font-bold tracking-tight text-gray-900">
          GoodLeap
        </span>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#4A1D8E] mt-0.5">
          ANALYTICS
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#4A1D8E] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4A1D8E] text-xs font-bold text-white">
            {DEMO_USER.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{DEMO_USER.name}</p>
            <p className="text-xs text-gray-500 truncate">{DEMO_USER.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
