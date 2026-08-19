import Link from "next/link";
import type { ScrapTip as ScrapTipData } from "@/lib/data/scrap-tips";

/**
 * Card tip "Mẹo vặt" — hiển thị cây có thể regrow từ phế liệu bếp.
 * Tách biệt khỏi CropCard (luồng recommendation) để không làm lu mờ USP chính.
 */
export default function ScrapTip({ tip }: { tip: ScrapTipData }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-teal-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {tip.icon}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900">
            <Link href={`/crops/${tip.cropId}`} className="text-teal-800 hover:underline">
              {tip.name}
            </Link>
          </h3>
          <p className="text-xs italic text-zinc-500">{tip.scientific}</p>
        </div>
        <span className="ml-auto shrink-0 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-800">
          {tip.methodLabel}
        </span>
      </div>

      <p className="text-sm text-zinc-600">{tip.summary}</p>

      <ol className="flex flex-col gap-2.5">
        {tip.steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white"
              aria-hidden
            >
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-zinc-800">{step.title}</p>
              <p className="leading-relaxed text-zinc-600">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-xs text-zinc-500">
        ⏱️ Thu hoạch sau {tip.daysToHarvest[0]}–{tip.daysToHarvest[1]} ngày
      </p>
    </div>
  );
}
