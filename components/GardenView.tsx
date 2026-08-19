"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { GhostCause } from "@/lib/garden/types";
import { GHOST_CAUSE_LABEL } from "@/lib/labels";
import PlantProgress, { calcProgress } from "@/components/PlantProgress";
import HarvestBragCard from "@/components/HarvestBragCard";

type Timeline = {
  germination_days: [number, number];
  days_to_harvest: [number, number];
  growth_stages: { stage: string; day_range: [number, number] }[];
} | null;

export interface GardenPlantView {
  id: string;
  cropId: string;
  cropName: string;
  plantedAt: string;
  status: "growing" | "ghost" | "harvested";
  diedAt?: string;
  cause?: GhostCause;
  harvestedAt?: string;
  timeline?: Timeline;
  category?: string;
}

const CAUSES: GhostCause[] = ["sun_heat", "pest", "waterlogged", "unknown"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/**
 * My Garden UI (change my-garden) — nhận danh sách cây từ server, thao tác
 * PATCH/DELETE qua API. Nguyên tắc Ghost Plant: mọi thao tác "chết"/"bỏ theo dõi"
 * đều chuyển sang ghost — không bao giờ xoá khỏi lịch sử.
 */
export default function GardenView({ plants: initial }: { plants: GardenPlantView[] }) {
  const [plants, setPlants] = useState(initial);
  const router = useRouter();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const growing = plants.filter((p) => p.status === "growing");
  const ghosts = plants.filter((p) => p.status === "ghost");
  const harvested = plants.filter((p) => p.status === "harvested");

  const applyResult = (plant: GardenPlantView) => {
    setPlants((prev) => prev.map((p) => (p.id === plant.id ? plant : p)));
  };

  const harvestPlant = async (id: string) => {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/garden/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "harvested" }),
      });
      const data = (await res.json()) as { plant?: GardenPlantView; error?: string };
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/sign-in?redirect_url=/garden");
          return;
        }
        setError(data.error ?? "Thao tác thất bại.");
        return;
      }
      if (data.plant) applyResult(data.plant);
    } catch {
      setError("Không kết nối được máy chủ. Thử lại sau.");
    } finally {
      setBusy(null);
    };
  };

  const call = async (method: string, id: string, body?: unknown) => {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/garden/${id}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await res.json()) as { plant?: GardenPlantView; error?: string };
      if (!res.ok) {
        // Session hết hạn → quay lại đăng nhập
        if (res.status === 401) {
          router.push("/sign-in?redirect_url=/garden");
          return;
        }
        setError(data.error ?? "Thao tác thất bại.");
        return;
      }
      if (data.plant) applyResult(data.plant);
    } catch {
      setError("Không kết nối được máy chủ. Thử lại sau.");
    } finally {
      setBusy(null);
      setMarkingId(null);
    }
  };

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
        <span className="text-4xl">🪴</span>
        <p className="font-medium text-zinc-900">Vườn của bạn đang trống</p>
        <p className="text-sm text-zinc-500">Xem gợi ý và bấm “Thêm vào vườn” trên mỗi cây để bắt đầu.</p>
        <Link href="/" className="mt-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          🌱 Xem gợi ý trồng gì
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <section aria-label="Cây đang trồng" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">🌱 Đang trồng ({growing.length})</h2>
        {growing.length === 0 ? (
          <p className="text-sm text-zinc-500">Chưa có cây nào đang trồng.</p>
        ) : (
          growing.map((p) => (
            <div key={p.id} className="flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-zinc-900">
                    <Link href={`/crops/${p.cropId}`} className="text-emerald-800 hover:underline">
                      {p.cropName}
                    </Link>
                  </h3>
                  <p className="text-xs text-zinc-500">Trồng từ {formatDate(p.plantedAt)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Đang trồng
                </span>
              </div>

              {markingId === p.id ? (
                <div className="flex flex-col gap-1.5 rounded-xl bg-amber-50 p-3">
                  <p className="text-sm font-medium text-amber-900">Cây chết vì gì? (chọn nhanh)</p>
                  <div className="flex flex-wrap gap-2">
                    {CAUSES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        disabled={busy === p.id}
                        onClick={() => void call("PATCH", p.id, { cause: c })}
                        className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-sm text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
                      >
                        {GHOST_CAUSE_LABEL[c]}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress tracker (change garden-progress) */}
                  <PlantProgress plantedAt={p.plantedAt} timeline={p.timeline ?? null} />

                  <div className="flex items-center gap-3">
                    {calcProgress(p.plantedAt, p.timeline ?? null).canHarvest && (
                      <button
                        type="button"
                        disabled={busy === p.id}
                        onClick={() => void harvestPlant(p.id)}
                        className="self-start rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                      >
                        🎊 Thu hoạch
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busy === p.id}
                      onClick={() => setMarkingId(p.id)}
                      className="self-start rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
                    >
                      💀 Đánh dấu chết
                    </button>
                    <button
                      type="button"
                      disabled={busy === p.id}
                      onClick={() => void call("DELETE", p.id)}
                      className="self-start rounded-full border border-transparent px-3 py-1 text-sm text-zinc-500 transition hover:text-red-600 disabled:opacity-60"
                    >
                      Bỏ theo dõi
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </section>

      {/* ── Harvested section (change garden-progress) ── */}
      {harvested.length > 0 && (
        <section aria-label="Đã thu hoạch" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">🎊 Đã thu hoạch ({harvested.length})</h2>
          {harvested.map((p) => (
            <div key={p.id} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium text-emerald-900">
                    <Link href={`/crops/${p.cropId}`} className="hover:underline">
                      {p.cropName}
                    </Link>
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Trồng {formatDate(p.plantedAt)} → Thu hoạch {p.harvestedAt ? formatDate(p.harvestedAt) : "—"}
                  </p>
                </div>
                <span className="shrink-0 text-xl" aria-hidden>🎊</span>
              </div>
              {p.category && p.harvestedAt && (
                <HarvestBragCard
                  cropName={p.cropName}
                  category={p.category}
                  plantedAt={p.plantedAt}
                  harvestedAt={p.harvestedAt}
                />
              )}
            </div>
          ))}
          <p className="text-xs text-emerald-600">
            Giá trị ước tính theo giá rau sạch trung bình thị trường.
          </p>
        </section>
      )}

      {ghosts.length > 0 && (
        <section aria-label="Cây đã chết" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">💐 Đã qua đời ({ghosts.length})</h2>
          <p className="text-sm text-zinc-500">
            Lịch sử được giữ lại để lần sau gợi ý đúng hơn cho bạn — không bao giờ xoá.
          </p>
          {ghosts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 opacity-80">
              <div>
                <h3 className="font-medium text-zinc-700">{p.cropName}</h3>
                <p className="text-xs text-zinc-500">
                  {p.diedAt ? `Chết ${formatDate(p.diedAt)}` : "Đã bỏ theo dõi"} ·{" "}
                  {p.cause ? (GHOST_CAUSE_LABEL[p.cause] ?? p.cause) : GHOST_CAUSE_LABEL.unknown}
                </p>
              </div>
              <span className="shrink-0 text-xl" aria-hidden>
                {p.cause === "sun_heat" ? "☀️" : p.cause === "pest" ? "🐛" : p.cause === "waterlogged" ? "🌊" : "💐"}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
