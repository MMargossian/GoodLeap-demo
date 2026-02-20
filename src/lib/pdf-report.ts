import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DEMO_USER } from "./constants";
import type { ReportData } from "./report-data";
import type { FallbackInsight } from "./fallback-insights";

const BRAND_COLOR: [number, number, number] = [124, 58, 237]; // #7c3aed
const DARK_TEXT: [number, number, number] = [31, 41, 55];
const MUTED_TEXT: [number, number, number] = [107, 114, 128];
const WHITE: [number, number, number] = [255, 255, 255];
const LIGHT_BG: [number, number, number] = [248, 250, 252];

function addPageHeader(doc: jsPDF, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Purple accent bar
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, pageWidth, 4, "F");

  // Section title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text(title, 20, 24);

  // Divider line
  doc.setDrawColor(...BRAND_COLOR);
  doc.setLineWidth(0.5);
  doc.line(20, 30, pageWidth - 20, 30);

  return 40; // starting Y position for content
}

function addInsightBlocks(
  doc: jsPDF,
  insights: FallbackInsight[],
  startY: number,
  maxInsights = 3
): number {
  let y = startY;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const blockWidth = pageWidth - 2 * margin;

  const displayInsights = insights.slice(0, maxInsights);

  for (const insight of displayInsights) {
    // Check page break
    if (y + 30 > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    // Background box
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(margin, y, blockWidth, 24, 2, 2, "F");

    // Left purple accent
    doc.setFillColor(...BRAND_COLOR);
    doc.rect(margin, y, 3, 24, "F");

    // Title
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BRAND_COLOR);
    doc.text(insight.title, margin + 8, y + 8);

    // Content
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED_TEXT);
    const lines = doc.splitTextToSize(insight.content, blockWidth - 16);
    doc.text(lines.slice(0, 2), margin + 8, y + 15);

    y += 28;
  }

  return y;
}

function addCoverPage(doc: jsPDF, data: ReportData) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Full-page brand background at top
  doc.setFillColor(...BRAND_COLOR);
  doc.rect(0, 0, pageWidth, pageHeight * 0.45, "F");

  // Company name
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...WHITE);
  doc.text(DEMO_USER.company, pageWidth / 2, 60, { align: "center" });

  // Report title
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("Executive", pageWidth / 2, 90, { align: "center" });
  doc.text("Performance Report", pageWidth / 2, 105, { align: "center" });

  // Date
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const dateStr = data.generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(dateStr, pageWidth / 2, 125, { align: "center" });

  // Decorative line
  doc.setDrawColor(...WHITE);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 40, 135, pageWidth / 2 + 40, 135);

  // Bottom section - report contents
  const startY = pageHeight * 0.55;
  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Report Contents", pageWidth / 2, startY, { align: "center" });

  const sections = [
    "Executive Summary",
    "Sales Performance",
    "Funding Health",
    "Performance Benchmarks",
    "Project Health",
    "Customer Satisfaction",
  ];

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED_TEXT);
  sections.forEach((section, i) => {
    doc.text(`${i + 1}.  ${section}`, pageWidth / 2, startY + 16 + i * 12, {
      align: "center",
    });
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_TEXT);
  doc.text(
    `Prepared for ${DEMO_USER.name} | ${DEMO_USER.role}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: "center" }
  );
}

function addExecutiveSummary(doc: jsPDF, summary: string) {
  doc.addPage();
  let y = addPageHeader(doc, "Executive Summary");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK_TEXT);

  const paragraphs = summary.split("\n\n").filter((p) => p.trim());
  for (const paragraph of paragraphs) {
    const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);
    const blockHeight = lines.length * 5;

    if (y + blockHeight > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }

    doc.text(lines, margin, y);
    y += blockHeight + 6;
  }
}

function addSalesPage(doc: jsPDF, data: ReportData) {
  doc.addPage();
  let y = addPageHeader(doc, "Sales Performance");

  const m = data.sales.metrics;

  // Key metrics table
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", `$${m.revenue.toLocaleString()}`],
      ["Projects Completed", String(m.projects)],
      ["Average Sale", `$${m.avgSale.toLocaleString()}`],
      ["Conversion Rate", `${m.conversionRate}%`],
      ["Referral Conversion", `${m.referralConversion}%`],
      ["Repeat Customer Rate", `${m.repeatRate}%`],
      ["Upsell Rate", `${m.upsellRate}%`],
      ["Avg Sales Cycle", `${m.avgSalesCycle} days`],
      ["Cancellations", String(m.cancellations)],
      ["Target Attainment", `${m.targetAttainment}%`],
    ],
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: "grid",
    styles: { cellPadding: 4 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // AI Insights
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text("AI Insights", 20, y);
  y += 8;

  y = addInsightBlocks(doc, data.sales.insights, y);
}

function addFundingPage(doc: jsPDF, data: ReportData) {
  doc.addPage();
  let y = addPageHeader(doc, "Funding Health");

  const m = data.funding.metrics;

  // Funding metrics table
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Approval Rate", `${m.approvalRate}%`],
      ["Sales Pull-Through", `${m.pullThrough}%`],
      ["Delinquency Rate", `${m.delinquencyRate}%`],
      ["Payment Status", m.paymentStatus],
      ["Average Loan", `$${m.avgLoan.toLocaleString()}`],
      ["Utilization Rate", `${m.utilizationRate}%`],
      ["Total Funded", `$${m.totalFunded.toLocaleString()}`],
    ],
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: "grid",
    styles: { cellPadding: 4 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // FICO Distribution table
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text("FICO Score Distribution", 20, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["FICO Range", "Approval Probability"]],
    body: data.funding.ficoDistribution.map((f) => [
      f.ficoRange,
      `${f.approvalProbability}%`,
    ]),
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: "grid",
    styles: { cellPadding: 4 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // AI Insights
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text("AI Insights", 20, y);
  y += 8;

  addInsightBlocks(doc, data.funding.insights, y);
}

function addBenchmarksPage(doc: jsPDF, data: ReportData) {
  doc.addPage();
  let y = addPageHeader(doc, "Performance Benchmarks");

  // Benchmark comparison table
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Your Value", "Peer Average", "Difference"]],
    body: data.benchmarks.metrics.map((b) => {
      const diff = b.contractorValue - b.peerValue;
      const isPercentMetric =
        b.metricName !== "Avg Sale" && b.metricName !== "Avg Sales Cycle";
      const format = (v: number) => {
        if (b.metricName === "Avg Sale")
          return `$${v.toLocaleString()}`;
        if (b.metricName === "Avg Sales Cycle") return `${v} days`;
        return `${v}%`;
      };
      const diffStr =
        b.metricName === "Avg Sales Cycle"
          ? `${diff > 0 ? "+" : ""}${diff} days`
          : isPercentMetric
            ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`
            : `${diff > 0 ? "+" : ""}$${Math.abs(diff).toLocaleString()}`;
      return [b.metricName, format(b.contractorValue), format(b.peerValue), diffStr];
    }),
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: "grid",
    styles: { cellPadding: 4 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // AI Insights
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text("AI Insights", 20, y);
  y += 8;

  addInsightBlocks(doc, data.benchmarks.insights, y);
}

function addProjectHealthPage(doc: jsPDF, data: ReportData) {
  doc.addPage();
  let y = addPageHeader(doc, "Project Health");

  const pm = data.projects.metrics;

  // Pipeline stages table
  autoTable(doc, {
    startY: y,
    head: [["Stage", "Count", "Avg Days", "Peer Avg Days", "Difference"]],
    body: pm.pipelineStages.map((s) => {
      const diff = s.avgDays - s.peerAvgDays;
      return [
        s.stage,
        String(s.count),
        String(s.avgDays),
        String(s.peerAvgDays),
        `${diff > 0 ? "+" : ""}${diff.toFixed(1)} days`,
      ];
    }),
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: "grid",
    styles: { cellPadding: 4 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Key metrics row
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text(
    `Expiring Loans: ${pm.expiringPct}%    |    Expired Value: $${pm.expiredValue.toLocaleString()}`,
    20,
    y
  );
  y += 10;

  // Action items
  if (pm.actionItems.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Action Items", 20, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Stage", "Action", "Projects", "Risk"]],
      body: pm.actionItems.map((a) => [
        a.stage,
        a.actionText,
        String(a.projectCount),
        a.riskLevel,
      ]),
      margin: { left: 20, right: 20 },
      headStyles: {
        fillColor: BRAND_COLOR,
        textColor: WHITE,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
      alternateRowStyles: { fillColor: LIGHT_BG },
      theme: "grid",
      styles: { cellPadding: 4 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // AI Insights
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text("AI Insights", 20, y);
  y += 8;

  addInsightBlocks(doc, data.projects.insights, y);
}

function addSatisfactionPage(doc: jsPDF, data: ReportData) {
  doc.addPage();
  let y = addPageHeader(doc, "Customer Satisfaction");

  const sm = data.satisfaction.metrics;

  // Satisfaction metrics table
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Would Recommend", `${sm.wouldRecommendPct}%`],
      ["Neutral", `${sm.neutralPct}%`],
      ["Would Not Recommend", `${sm.wouldNotRecommendPct}%`],
      ["Open Issues", String(sm.openIssues)],
      ["Defective Projects", String(sm.defectiveProjects)],
      ["Defective Rate", `${sm.defectiveRate}%`],
      ["Escalations", String(sm.escalations)],
    ],
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: "grid",
    styles: { cellPadding: 4 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // Touchpoint breakdown
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text("Recommendation by Touchpoint", 20, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Touchpoint", "Recommend", "Neutral", "Not Recommend"]],
    body: data.satisfaction.touchpoints.map((t) => [
      t.touchpoint,
      `${t.recommendPct}%`,
      `${t.neutralPct}%`,
      `${t.notRecommendPct}%`,
    ]),
    margin: { left: 20, right: 20 },
    headStyles: {
      fillColor: BRAND_COLOR,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: DARK_TEXT },
    alternateRowStyles: { fillColor: LIGHT_BG },
    theme: "grid",
    styles: { cellPadding: 4 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // AI Insights
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_TEXT);
  doc.text("AI Insights", 20, y);
  y += 8;

  addInsightBlocks(doc, data.satisfaction.insights, y);
}

function addFooters(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED_TEXT);
    doc.text(
      `${DEMO_USER.company} | Performance Report`,
      20,
      pageHeight - 10
    );
    doc.text(`Page ${i - 1} of ${pageCount - 1}`, pageWidth - 20, pageHeight - 10, {
      align: "right",
    });
  }
}

export async function generateReport(data: ReportData): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Cover page
  addCoverPage(doc, data);

  // Executive summary
  addExecutiveSummary(doc, data.executiveSummary);

  // Section pages
  addSalesPage(doc, data);
  addFundingPage(doc, data);
  addBenchmarksPage(doc, data);
  addProjectHealthPage(doc, data);
  addSatisfactionPage(doc, data);

  // Add footers to all pages
  addFooters(doc);

  return doc;
}
