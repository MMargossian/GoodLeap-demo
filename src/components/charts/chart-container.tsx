"use client";

import { useState, useEffect, ReactNode } from "react";

/**
 * Wrapper that delays rendering of Recharts children until after mount.
 * This ensures CSS (including Tailwind v4 overrides for SVG box-sizing)
 * is fully applied before Recharts calculates chart dimensions.
 */
export function ChartContainer({ children, height = 300 }: { children: ReactNode; height?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay ensures CSS is fully applied before Recharts measures
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  if (!mounted) {
    return <div style={{ width: "100%", height }} />;
  }

  return <>{children}</>;
}
