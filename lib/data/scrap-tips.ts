/**
 * Tab "Mẹo vặt" (kitchen scraps) — plan mục 5.3.
 *
 * Chọn cây có khả năng regrow dựa trên tags hiện có trong crops_data.json:
 *   - regrow_from_scraps   → trồng lại từ gốc (hành lá)
 *   - regrow_from_cuttings → trồng từ cành cắt (rau muống)
 *
 * Hướng dẫn từng bước là nội dung tĩnh viết tay, dễ mở rộng sau này —
 * KHÔNG lồng vào luồng recommendation (giữ USP "what to grow now" rõ ràng).
 */

import { getAllCrops } from "./crops";
import type { Crop } from "../recommendation-engine/types";

export type ScrapMethod = "regrow_from_scraps" | "regrow_from_cuttings";

export interface ScrapStep {
  title: string;
  detail: string;
}

export interface ScrapTip {
  cropId: string;
  name: string;
  scientific: string;
  icon: string;
  method: ScrapMethod;
  methodLabel: string;
  summary: string;
  steps: ScrapStep[];
  daysToHarvest: [number, number];
}

const REGROW_TAGS: ScrapMethod[] = ["regrow_from_scraps", "regrow_from_cuttings"];

/** Hướng dẫn từng bước viết tay theo crop_id (dữ liệu tĩnh, curated). */
const CURATED_STEPS: Record<string, ScrapStep[]> = {
  hanh_la: [
    {
      title: "Giữ lại gốc hành",
      detail:
        "Khi dùng hành lá mua ở chợ, cắt phần lá để nấu ăn, giữ lại gốc trắng dài khoảng 3–4 cm (kèm rễ).",
    },
    {
      title: "Ngâm trong cốc nước",
      detail:
        "Dựng đứng gốc hành trong cốc nước nhỏ, ngập phần rễ. Đặt nơi có nắng nhẹ, thay nước mỗi 1–2 ngày.",
    },
    {
      title: "Đợi rễ và lá mọc",
      detail: "Sau 3–5 ngày, rễ trắng dài ra và lá xanh nhú lên từ giữa gốc.",
    },
    {
      title: "Chuyển ra đất",
      detail:
        "Khi lá cao ~5–7 cm, trồng vào chậu đất ẩm (sâu ~2–3 cm), tưới giữ ẩm. Hành lá chịu được nắng ít (từ 1–4h/ngày).",
    },
    {
      title: "Thu hoạch nhiều lần",
      detail:
        "Sau 15–25 ngày, cắt lá dùng dần — cây tiếp tục mọc lại từ gốc, thu hoạch được nhiều đợt.",
    },
  ],
  rau_muong: [
    {
      title: "Lấy cành khỏe",
      detail:
        "Chọn cành rau muống tươi dài ~20–25 cm, cắt bỏ hết lá ở phần gốc cành, chừa lại 2–3 lá ngọn.",
    },
    {
      title: "Ngâm gốc cành trong nước",
      detail:
        "Đặt phần gốc (đã bỏ lá) ngập trong cốc nước, để nơi thoáng có nắng nhẹ, thay nước thường xuyên.",
    },
    {
      title: "Đợi ra rễ",
      detail: "Sau 3–7 ngày, các mấu ở phần ngập nước nhú rễ trắng.",
    },
    {
      title: "Trồng xuống chậu",
      detail:
        "Cắm cành vào đất ẩm sâu ~5 cm. Rau muống chịu úng rất tốt, chỉ cần giữ đất luôn ẩm là đủ.",
    },
    {
      title: "Thu hoạch và để đẻ nhánh",
      detail:
        "Sau 20–30 ngày, cắt ngọn dùng dần — cây đẻ thêm nhánh và tiếp tục mọc lại.",
    },
  ],
};

const TIP_ICONS: Record<string, string> = {
  hanh_la: "🧅",
  rau_muong: "🥬",
};

const METHOD_LABELS: Record<ScrapMethod, string> = {
  regrow_from_scraps: "Trồng lại từ gốc",
  regrow_from_cuttings: "Trồng từ cành",
};

const SUMMARIES: Record<string, string> = {
  hanh_la: "Gần như không thể chết — trồng lại từ gốc hành mua ở chợ, không tốn hạt giống.",
  rau_muong: "Cây dễ nhất cho người mới: cắm cành vào nước là ra rễ, chịu nóng và mưa dầm tốt.",
};

/** Toàn bộ tips regrow (chỉ cây có tag regrow — đúng spec "Only regrow-capable crops listed"). */
export function getScrapTips(): ScrapTip[] {
  const crops: Crop[] = getAllCrops();
  const tips: ScrapTip[] = [];

  for (const crop of crops) {
    const method = REGROW_TAGS.find((t) => crop.crop_base.tags.includes(t));
    if (!method) continue;

    const steps = CURATED_STEPS[crop.crop_base.id];
    if (!steps) continue; // cây có tag nhưng chưa có hướng dẫn curated → bỏ qua

    tips.push({
      cropId: crop.crop_base.id,
      name: crop.crop_base.names.canonical_vi,
      scientific: crop.crop_base.names.scientific,
      icon: TIP_ICONS[crop.crop_base.id] ?? "🌱",
      method,
      methodLabel: METHOD_LABELS[method],
      summary: SUMMARIES[crop.crop_base.id] ?? "",
      steps,
      daysToHarvest: crop.crop_base.timeline_base.days_to_harvest,
    });
  }

  return tips;
}
