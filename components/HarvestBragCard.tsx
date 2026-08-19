"use client";

/**
 * HarvestBragCard — hiển thị giá trị sản lượng quy đổi (change harvest-brag-card).
 *
 * Ẩn mặc định, bấm toggle để hiện. Tính giá từ crop category × market price.
 * Nút "Sao chép" copy text摘要 ra clipboard.
 */

import { useCallback, useMemo, useState } from "react";
import { DEFAULT_YIELD_KG, MARKET_PRICE_PER_KG } from "@/lib/labels";

interface HarvestBragCardProps {
  cropName: string;
  category: string;
  plantedAt: string;
  harvestedAt: string;
}

function daysBetween(a: string, b: string): number {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)));
}

function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN");
}

export default function HarvestBragCard({ cropName, category, plantedAt, harvestedAt }: HarvestBragCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const value = useMemo(() => {
    const yieldKg = DEFAULT_YIELD_KG[category] ?? 0.3;
    const pricePerKg = MARKET_PRICE_PER_KG[category] ?? 30_000;
    return { yieldKg, valueVnd: yieldKg * pricePerKg };
  }, [category]);

  const daysPlanted = daysBetween(plantedAt, harvestedAt);

  const copyText = useMemo(
    () =>
      [
        `🌱 ${cropName} — ${daysPlanted} ngày trồng`,
        `📦 Ước tính: ${value.yieldKg}kg`,
        `💰 Giá trị quy đổi: ${formatVnd(value.valueVnd)}đ`,
        `#TrồngGìHômNay`,
      ].join("\n"),
    [cropName, daysPlanted, value],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select + execCommand
      const ta = document.createElement("textarea");
      ta.value = copyText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copyText]);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
      >
        {open ? "🙈 Ẩn đi" : "👁️ Xem giá trị"}
      </button>

      {/* Animated card */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "300px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎊</span>
            <span className="font-semibold text-emerald-900">{cropName}</span>
          </div>

          <dl className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-emerald-700">Thời gian trồng</dt>
              <dd className="font-medium text-emerald-900">{daysPlanted} ngày</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-emerald-700">Ước tính sản lượng</dt>
              <dd className="font-medium text-emerald-900">{value.yieldKg} kg</dd>
            </div>
            <div className="flex justify-between border-t border-emerald-200 pt-1.5">
              <dt className="text-emerald-700">Giá trị quy đổi</dt>
              <dd className="font-bold text-emerald-900">{formatVnd(value.valueVnd)}đ</dd>
            </div>
          </dl>

          <p className="mt-2 text-xs text-emerald-600 italic">
            Theo giá rau sạch trung bình thị trường. Thực tế có thể khác.
          </p>

          <button
            type="button"
            onClick={() => void handleCopy()}
            className="mt-3 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            {copied ? "✅ Đã sao chép!" : "📋 Sao chép"}
          </button>
        </div>
      </div>
    </div>
  );
}
