"use client";

import Link from "next/link";
import AddToGardenButton from "./AddToGardenButton";
import { CATEGORY_LABEL } from "@/lib/labels";

export interface ApiRecommendation {
  crop_id: string;
  name: string;
  scientific: string;
  category: string;
  role: "easy" | "step_up";
  score: number;
  days_to_harvest: [number, number];
  why: string;
}

export default function CropCard({
  rec,
  onAdd,
}: {
  rec: ApiRecommendation;
  onAdd: (name: string) => void;
}) {
  const isStepUp = rec.role === "step_up";
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border p-4 shadow-sm transition hover:shadow-md ${
        isStepUp ? "border-amber-300 bg-amber-50" : "border-emerald-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          {/* Tên cây là Link → trang chi tiết /crops/[id] (change crop-detail-pages) */}
          <h3 className="text-lg font-semibold text-zinc-900">
            <Link href={`/crops/${rec.crop_id}`} className="text-emerald-800 hover:underline">
              {rec.name}
            </Link>
          </h3>
          <p className="text-xs italic text-zinc-500">{rec.scientific}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            isStepUp ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"
          }`}
        >
          {isStepUp ? "🍅 Bước lên" : "🌱 Dễ trồng"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5">
          {CATEGORY_LABEL[rec.category as keyof typeof CATEGORY_LABEL] ?? rec.category}
        </span>
        <span className="rounded-md bg-zinc-100 px-2 py-0.5">
          Thu hoạch {rec.days_to_harvest[0]}-{rec.days_to_harvest[1]} ngày
        </span>
        <span className="rounded-md bg-zinc-100 px-2 py-0.5">Độ phù hợp {rec.score}/100</span>
      </div>

      <p className="text-sm leading-relaxed text-zinc-700">{rec.why}</p>

      <div className="mt-1 flex items-center gap-3">
        {/* Auth-gate + gọi API thật khi đã login (change my-garden); onAdded → toast ở trang chủ */}
        <AddToGardenButton cropId={rec.crop_id} cropName={rec.name} onAdded={onAdd} />
        <Link
          href={`/crops/${rec.crop_id}`}
          className="self-start text-sm font-medium text-zinc-600 transition hover:text-emerald-700 hover:underline"
        >
          Xem cách trồng →
        </Link>
      </div>
    </div>
  );
}
