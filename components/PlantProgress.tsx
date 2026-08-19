"use client";

/**
 * PlantProgress — passive tracker (change garden-progress).
 *
 * Tính tiến trình từ planted_at + crop timeline data (growth_stages + days_to_harvest).
 * Hiển thị: progress bar + giai đoạn hiện tại + milestone badge (nếu có).
 *
 * Milestone badge tự hiển thị khi plant vượt qua stage boundary — không persist,
 * mỗi render đều tính lại từ dữ liệu (deterministic, không cần state).
 */

import { useMemo } from "react";

interface PlantProgressProps {
  plantedAt: string;
  /** Timeline từ crop data — có thể null nếu crop chưa có data. */
  timeline: {
    germination_days: [number, number];
    days_to_harvest: [number, number];
    growth_stages: { stage: string; day_range: [number, number] }[];
  } | null;
}

interface ProgressInfo {
  daysPlanted: number;
  progress: number; // 0-100
  currentStage: string;
  currentStageLabel: string;
  daysToHarvest: [number, number];
  canHarvest: boolean;
  milestone: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  germination: "Đang nảy mầm",
  seedling: "Mầm non",
  vegetative: "Đang lớn",
  harvest: "Sẵn sàng thu hoạch",
};

/** Milestone khi VỪA bước vào stage mới (day_range[0] của stage). */
const MILESTONE_ON_ENTER: Record<string, string> = {
  seedling: "🌱 Nảy mầm!",   // germination xong → mầm nhú lên
  vegetative: "🌿 Lớn lên!", // seedling xong → cây lớn
  harvest: "🎉 Sắp thu hoạch!",
};

/** Tính thông tin tiến trình từ ngày trồng + timeline. */
export function calcProgress(plantedAt: string, timeline: PlantProgressProps["timeline"]): ProgressInfo {
  const now = Date.now();
  const planted = new Date(plantedAt).getTime();
  const daysPlanted = Math.max(0, Math.floor((now - planted) / (1000 * 60 * 60 * 24)));

  if (!timeline) {
    return {
      daysPlanted,
      progress: 0,
      currentStage: "unknown",
      currentStageLabel: "Đang lớn",
      daysToHarvest: [30, 45],
      canHarvest: false,
      milestone: null,
    };
  }

  const harvestMax = Math.max(1, timeline.days_to_harvest[1]); // guard division by zero
  const progress = Math.min(100, Math.round((daysPlanted / harvestMax) * 100));
  const canHarvest = progress >= 80;

  // Tìm giai đoạn hiện tại
  let currentStage = "germination";
  for (const s of timeline.growth_stages) {
    if (daysPlanted >= s.day_range[0]) {
      currentStage = s.stage;
    }
  }

  // Milestone: hiển thị trong cửa sổ 2 ngày đầu khi bước vào stage mới
  // (Không persist state → hiển thị lại mỗi render nếu đang trong cửa sổ)
  let milestone: string | null = null;
  for (const s of timeline.growth_stages) {
    if (
      daysPlanted >= s.day_range[0] &&
      daysPlanted <= s.day_range[0] + 1 &&
      MILESTONE_ON_ENTER[s.stage]
    ) {
      milestone = MILESTONE_ON_ENTER[s.stage];
      break;
    }
  }

  return {
    daysPlanted,
    progress,
    currentStage,
    currentStageLabel: STAGE_LABELS[currentStage] ?? currentStage,
    daysToHarvest: timeline.days_to_harvest,
    canHarvest,
    milestone,
  };
}

export default function PlantProgress({ plantedAt, timeline }: PlantProgressProps) {
  const info = useMemo(() => calcProgress(plantedAt, timeline), [plantedAt, timeline]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Milestone badge */}
      {info.milestone && (
        <div className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 animate-pulse">
          {info.milestone}
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${info.progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-zinc-600 tabular-nums">{info.progress}%</span>
      </div>

      {/* Stage + days info */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>
          {info.currentStageLabel} · Ngày {info.daysPlanted} / {info.daysToHarvest[1]}
        </span>
        {info.canHarvest && (
          <span className="font-medium text-emerald-600">✅ Sẵn sàng thu hoạch</span>
        )}
      </div>
    </div>
  );
}
