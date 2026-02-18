"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// --- AnimatedCard ---
// Renders instantly (no framer-motion entrance animations for reliable SSR/hydration)
interface AnimatedCardProps {
  delay?: number;
  className?: string;
  children: ReactNode;
}

export function AnimatedCard({ className, children }: AnimatedCardProps) {
  return <Card className={className}>{children}</Card>;
}

// --- AnimatedNumber ---
// Displays the final formatted value instantly
interface AnimatedNumberProps {
  value: number;
  format?: "dollar" | "percent" | "plain";
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  format = "plain",
  className,
}: AnimatedNumberProps) {
  let display: string;
  if (format === "dollar") {
    display = `$${Math.round(value).toLocaleString("en-US")}`;
  } else if (format === "percent") {
    display = `${value.toFixed(1)}%`;
  } else {
    display = Math.round(value).toLocaleString("en-US");
  }
  return <span className={className}>{display}</span>;
}

// --- FadeIn ---
interface FadeInProps {
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  children: ReactNode;
}

export function FadeIn({ className, children }: FadeInProps) {
  return <div className={className}>{children}</div>;
}

// --- StaggerContainer & StaggerItem ---
interface StaggerContainerProps {
  staggerDelay?: number;
  className?: string;
  children: ReactNode;
}

export function StaggerContainer({ className, children }: StaggerContainerProps) {
  return <div className={className}>{children}</div>;
}

interface StaggerItemProps {
  className?: string;
  children: ReactNode;
}

export function StaggerItem({ className, children }: StaggerItemProps) {
  return <div className={className}>{children}</div>;
}

// --- PageTransition ---
interface PageTransitionProps {
  className?: string;
  children: ReactNode;
}

export function PageTransition({ className, children }: PageTransitionProps) {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
}
