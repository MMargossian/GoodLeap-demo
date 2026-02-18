"use client";

import {
  FileText,
  CheckCircle,
  Send,
  PenTool,
  Hammer,
  DollarSign,
} from "lucide-react";

const pipelineData = [
  { stage: "SUBMISSIONS", count: 141, dropPct: null, icon: FileText },
  { stage: "APPROVALS", count: 97, dropPct: 31, icon: CheckCircle },
  { stage: "DOCS SENT", count: 84, dropPct: 13, icon: Send },
  { stage: "NOTICE TO PROCEED (NTP)", count: 63, dropPct: 25, icon: Hammer },
  { stage: "FUNDED", count: 51, dropPct: 19, icon: DollarSign },
];

const maxCount = pipelineData[0].count;

export function PipelineFunnel() {
  return (
    <div className="space-y-4">
      {/* Total Funded stat */}
      <div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">$1.2M</p>
          <p className="text-xs text-muted-foreground">Total capital deployed</p>
        </div>
      </div>

      {/* Pipeline stages */}
      <div className="space-y-3">
        {pipelineData.map((item) => {
          const progressPct = (item.count / maxCount) * 100;
          const Icon = item.icon;

          return (
            <div key={item.stage} className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                <Icon className="h-4 w-4 text-primary" />
              </div>

              {/* Stage info + progress bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-wider text-gray-800">
                      {item.stage}
                    </span>
                    {item.dropPct !== null && (
                      <span className="text-[10px] font-medium text-muted-foreground bg-gray-100 rounded px-1.5 py-0.5">
                        {item.dropPct}% DROP
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    {item.count}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
