"use client";

import { useState } from "react";
import { Home, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_USER } from "@/lib/constants";
import { useToast } from "@/components/ui/toast";

export function Header() {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setGenerating(true);
    toast("Collecting dashboard data...");

    try {
      const { collectReportData } = await import("@/lib/report-data");

      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
      const reportData = await collectReportData(convexUrl);

      toast("Generating PDF report...");

      const { generateReport } = await import("@/lib/pdf-report");
      const doc = await generateReport(reportData);

      doc.save("performance-report.pdf");
      toast("Report downloaded successfully!");
    } catch (error) {
      console.error("Report generation failed:", error);
      toast("Report generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <header className="flex h-[72px] items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <Home className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold leading-tight text-gray-900">
            {DEMO_USER.company}
          </span>
          <span className="text-sm text-muted-foreground">
            Hi, {DEMO_USER.name}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="border-gray-800 text-gray-800 hover:bg-gray-100"
        onClick={handleGenerateReport}
        disabled={generating}
      >
        {generating ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        {generating ? "Generating..." : "Generate Report"}
      </Button>
    </header>
  );
}
