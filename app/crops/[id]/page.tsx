/**
 * Crop detail — trang tutorial từng cây (plan mục 5.3, openspec change crop-detail-pages).
 *
 * Server component + SSG: 15 trang tĩnh tại build time (generateStaticParams từ
 * getAllCrops()); id không tồn tại → 404 (dynamicParams = false).
 *
 * Nội dung đọc trực tiếp từ dữ liệu Schema v2 — không có DB/API call. Vùng không có
 * regional_rules (highland_vietnam) được ghi chú rõ là dùng logic nhiệt độ chung.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import { getAllCrops, getCropById } from "@/lib/data/crops";
import {
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  LEVEL_LABEL,
  REGION_LABELS,
  WATER_LABEL,
  WINDOW_TYPE_LABEL,
  soilLabel,
} from "@/lib/labels";
import type { Crop, RegionKey, RegionalRule } from "@/lib/recommendation-engine/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCrops().map((c) => ({ id: c.crop_base.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const crop = getCropById(id);
  if (!crop) return { title: "Không tìm thấy cây" };
  const base = crop.crop_base;
  return {
    title: `${base.names.canonical_vi} — Hướng dẫn trồng`,
    description: `Hướng dẫn trồng ${base.names.canonical_vi} (${base.names.scientific}) cho ban công Việt Nam: thời vụ, đất, nước, chăm sóc và thu hoạch.`,
  };
}

export default async function CropDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const crop = getCropById(id);
  if (!crop) notFound();

  const base = crop.crop_base;
  const rules = crop.growing_rules;
  const hc = crop.hard_constraints;
  const f = crop.beginner_success_factors;
  const regions = Object.keys(rules.regional_rules) as RegionKey[];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-8 sm:px-6">
      <NavBar title={base.names.canonical_vi} />
      <nav className="flex items-center gap-3 text-sm font-medium">
        <Link href="/" className="text-emerald-700 hover:underline">
          ← Trang chủ
        </Link>
        <span className="text-zinc-300">|</span>
        <Link href="/garden" className="text-emerald-700 hover:underline">
          🪴 Vườn của tôi
        </Link>
      </nav>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-emerald-800 sm:text-3xl">{base.names.canonical_vi}</h1>
        <p className="text-sm italic text-zinc-500">
          {base.names.scientific} · {base.names.canonical_en}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-700">
          <span className="rounded-md bg-emerald-100 px-2 py-1 font-medium">
            {CATEGORY_LABEL[base.category]}
          </span>
          <span className="rounded-md bg-zinc-100 px-2 py-1">Độ khó: {DIFFICULTY_LABEL[base.base_difficulty]}</span>
          {base.tags.map((t) => (
            <span key={t} className="rounded-md bg-zinc-100 px-2 py-1">{t}</span>
          ))}
        </div>
      </header>

      {hasLowConfidence(crop) && <LowConfidenceNotice />}

      {/* ── Entry point First Aid (change deterministic-first-aid) ─────── */}
      <Link
        href="/first-aid"
        className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 transition hover:border-red-300 hover:bg-red-100"
      >
        <span className="text-2xl" aria-hidden>
          🆘
        </span>
        <span>
          <span className="block font-medium text-red-900">Cây có vấn đề?</span>
          <span className="block text-xs text-red-700">Lá vàng, héo, sâu bọ… chọn triệu chứng để được chẩn đoán + cách xử lý từng bước.</span>
        </span>
      </Link>

      {/* ── Thời vụ theo vùng ──────────────────────────────────────────── */}
      <Section icon="📅" title="Thời vụ theo vùng">
        {regions.length === 0 ? (
          <p className="text-sm text-zinc-600">
            Chưa có dữ liệu vùng riêng — engine dùng logic nhiệt độ chung (thích hợp vùng cao mát quanh năm).
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {regions.map((region) => (
              <RegionBlock key={region} region={region} rule={rules.regional_rules[region]!} />
            ))}
          </div>
        )}
      </Section>

      {/* ── Điều kiện lý tưởng ─────────────────────────────────────────── */}
      <Section icon="🌡️" title="Điều kiện lý tưởng">
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Fact label="Nhiệt độ" value={`${rangeLabel(rules.optimal_conditions.temperature_c.min, rules.optimal_conditions.temperature_c.optimal_min)} → lý tưởng ${rules.optimal_conditions.temperature_c.optimal_min}–${rules.optimal_conditions.temperature_c.optimal_max}°C → ${rules.optimal_conditions.temperature_c.max}°C`} />
          <Fact label="Nắng" value={`Tối thiểu ${rules.optimal_conditions.sunlight_hours.min}h, lý tưởng ${rules.optimal_conditions.sunlight_hours.optimal}h/ngày`} />
          <Fact label="Nước" value={WATER_LABEL[rules.optimal_conditions.water] ?? rules.optimal_conditions.water} />
          <Fact label="Đất" value={soilLabel(rules.optimal_conditions.soil)} />
        </dl>
      </Section>

      {/* ── Chậu & ngưỡng sống-chết ────────────────────────────────────── */}
      <Section icon="🪴" title="Chậu & giới hạn quan trọng">
        <dl className="flex flex-col gap-2 text-sm">
          <Fact label="Độ sâu chậu tối thiểu" value={`${hc.min_pot_depth_cm}cm`} />
          <Fact label="Nắng tối thiểu để sống" value={`${hc.min_sunlight_hours}h/ngày`} />
          <Fact label="Nhiệt độ tối đa chịu được" value={`${hc.temp_death_max_c.value}°C — ${hc.temp_death_max_c.reason}`} />
          <Fact label="Nhiệt độ tối thiểu chịu được" value={`${hc.temp_death_min_c.value}°C — ${hc.temp_death_min_c.reason}`} />
        </dl>
        <p className="mt-2 text-xs text-zinc-500">
          Vượt các ngưỡng trên = cây không sống được — app sẽ loại cây này khỏi gợi ý khi điều kiện của bạn vi phạm.
        </p>
      </Section>

      {/* ── Timeline ───────────────────────────────────────────────────── */}
      <Section icon="⏱️" title="Timeline sinh trưởng">
        <div className="flex flex-col gap-2 text-sm">
          <p>
            <span className="font-medium">Nảy mầm:</span> {base.timeline_base.germination_days[0]}–{base.timeline_base.germination_days[1]} ngày
          </p>
          <p>
            <span className="font-medium">Thu hoạch:</span> {base.timeline_base.days_to_harvest[0]}–{base.timeline_base.days_to_harvest[1]} ngày
          </p>
        </div>
        <ol className="mt-3 flex flex-col gap-2">
          {base.timeline_base.growth_stages.map((stage, i) => (
            <li key={stage.stage} className="flex items-baseline gap-2 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                {i + 1}
              </span>
              <span className="font-medium capitalize text-zinc-800">{stage.stage}</span>
              <span className="text-zinc-500">— ngày {stage.day_range[0]}–{stage.day_range[1]}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Dành cho người mới ─────────────────────────────────────────── */}
      <Section icon="🌱" title="Dành cho người mới">
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <Fact label="Chịu úng nước" value={LEVEL_LABEL[f.forgiveness_overwatering]} />
          <Fact label="Chịu khô hạn" value={LEVEL_LABEL[f.forgiveness_underwatering]} />
          <Fact label="Kháng sâu bệnh" value={LEVEL_LABEL[f.disease_resistance]} />
          <Fact label="Dễ thấy thành quả" value={LEVEL_LABEL[f.visibility_of_success]} />
        </dl>
        {f.notes && (
          <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm leading-relaxed text-emerald-900">
            💡 {f.notes}
          </p>
        )}
      </Section>

      <footer className="mt-auto pt-4 text-center text-xs text-zinc-400">
        Dữ liệu từ cộng đồng làm vườn đô thị — kết quả có thể khác theo vi khí hậu thực tế.
      </footer>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4">
      <h2 className="mb-3 font-semibold text-zinc-900">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-zinc-400">{label}</dt>
      <dd className="text-sm leading-relaxed text-zinc-800">{value}</dd>
    </div>
  );
}

function RegionBlock({ region, rule }: { region: RegionKey; rule: RegionalRule }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
      <h3 className="text-sm font-semibold text-zinc-800">{REGION_LABELS[region]}</h3>
      <ul className="mt-1 flex flex-col gap-1 text-sm text-zinc-700">
        {rule.planting_windows.map((w, i) => (
          <li key={i}>
            🌱 <span className="font-medium">{WINDOW_TYPE_LABEL[w.type ?? ""] ?? "Cửa sổ trồng"}:</span>{" "}
            {formatMonths(w.months)}
          </li>
        ))}
        {Object.entries(rule.local_anomaly_flags ?? {}).map(([key, message]) => (
          <li key={key} className="text-amber-700">
            ⚠️ {message}
          </li>
        ))}
        {rule.regional_notes && <li className="text-zinc-600">📝 {rule.regional_notes}</li>}
      </ul>
      {rule.source && (
        <p className="mt-1 text-xs text-zinc-400">
          Nguồn: {rule.source.name} · độ tin cậy {rule.source.confidence}
        </p>
      )}
    </div>
  );
}

function LowConfidenceNotice() {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">
      ⚠️ Gợi ý này dựa trên <strong>ít dữ liệu địa phương</strong>. Hãy báo cáo kết quả trồng của
      bạn để giúp app chính xác hơn cho người sau.
    </div>
  );
}

/** Có bất kỳ nguồn dữ liệu nào confidence = low? (thời vụ vùng hoặc ngưỡng nhiệt độ) */
function hasLowConfidence(crop: Crop): boolean {
  const sources: (string | undefined)[] = [
    ...Object.values(crop.growing_rules.regional_rules).map((r) => r?.source?.confidence),
    crop.hard_constraints.temp_death_max_c.source.confidence,
    crop.hard_constraints.temp_death_min_c.source.confidence,
  ];
  return sources.some((c) => c === "low");
}

/** "8, 9, 10, 11, 2, 3" → "Tháng 8, 9, 10, 11, 2, 3" (sắp xếp tăng dần). */
function formatMonths(months: number[]): string {
  const sorted = [...months].sort((a, b) => a - b);
  return `Tháng ${sorted.join(", ")}`;
}

/** "min → optimal_min" chỉ khi khác nhau, ngược lại gọn lại. */
function rangeLabel(min: number, optimalMin: number): string {
  return min === optimalMin ? `${min}°C` : `${min}–${optimalMin}°C`;
}
