"use client";

/**
 * Trang chủ — Onboarding zero-friction (plan mục 5.1) + 2 tầng recommendation (5.2):
 *   1. Location (chọn thành phố hoặc GPS) → hiện 🌍 Level 1 "Good for your area"
 *   2. Goal siêu ngắn (3 lựa chọn, có thể bỏ qua)
 *   3. Micro-climate proxy (3 icon) → hiện 🪴 Level 2 "Best for your balcony"
 *
 * KHÔNG yêu cầu đăng nhập để xem gợi ý (chỉ cần khi bấm "Thêm vào vườn" — placeholder).
 */

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import CropCard, { type ApiRecommendation } from "@/components/CropCard";
import ScrapTip from "@/components/ScrapTip";
import NavBar from "@/components/NavBar";
import { getScrapTips } from "@/lib/data/scrap-tips";
import type { Region, UserGoal } from "@/lib/recommendation-engine/types";

type Tab = "grow" | "tips";

type ApiResponse =
  | { status: "ok"; region: string; month: number; recommendations: ApiRecommendation[] }
  | { status: "no_match"; message: string };

type MicroClimate = "window" | "balcony" | "garden";

const CITIES: { label: string; region: Region; hint: string }[] = [
  { label: "Hà Nội", region: "north_vietnam", hint: "Miền Bắc" },
  { label: "TP. Hồ Chí Minh", region: "south_vietnam", hint: "Miền Nam" },
  { label: "Đà Lạt", region: "highland_vietnam", hint: "Vùng cao" },
];

const GOALS: { value: UserGoal; icon: string; label: string }[] = [
  { value: "fastest_harvest", icon: "⚡", label: "Thu hoạch nhanh nhất" },
  { value: "easy_care", icon: "🌿", label: "Dễ sống, ít công chăm" },
  { value: "daily_food", icon: "🍅", label: "Rau củ quả ăn hàng ngày" },
];

const MICROS: { value: MicroClimate; icon: string; label: string; desc: string }[] = [
  { value: "window", icon: "🏢", label: "Cửa sổ ban công", desc: "Ít nắng, ít gió" },
  { value: "balcony", icon: "🏠", label: "Sân thượng / ban công rộng", desc: "Nắng nhiều, gió lớn" },
  { value: "garden", icon: "🌳", label: "Sân vườn đất", desc: "Nắng toàn phần, rễ sâu" },
];

/** Proxy micro-climate → tham số context (plan mục 5.1: app tự gán mặc định). */
const MICRO_PROXY: Record<MicroClimate, { location_type: "window" | "balcony" | "garden"; sunlight_hours: number; pot_depth_cm: number | null }> = {
  window: { location_type: "window", sunlight_hours: 2, pot_depth_cm: 12 },
  balcony: { location_type: "balcony", sunlight_hours: 4, pot_depth_cm: 20 },
  garden: { location_type: "garden", sunlight_hours: 7, pot_depth_cm: null },
};

/** Mặc định Level 1 (trước khi có micro-climate): ước lượng ban công 3h nắng, chậu 15cm. */
const LEVEL1_DEFAULTS = { location_type: "balcony" as const, sunlight_hours: 3, pot_depth_cm: 15 };

/** Tìm vùng gần nhất theo tọa độ GPS (không lưu tọa độ — plan mục 9, Nghị định 13/2023). */
function regionFromCoords(lat: number, lng: number): Region {
  const refs: { region: Region; lat: number; lng: number }[] = [
    { region: "north_vietnam", lat: 21.0285, lng: 105.8542 }, // Hà Nội
    { region: "south_vietnam", lat: 10.8231, lng: 106.6297 }, // TP.HCM
    { region: "highland_vietnam", lat: 11.9465, lng: 108.4419 }, // Đà Lạt
  ];
  let best = refs[0];
  let bestDist = Infinity;
  for (const r of refs) {
    const d = Math.hypot(r.lat - lat, r.lng - lng);
    if (d < bestDist) {
      bestDist = d;
      best = r;
    }
  }
  return best.region;
}

export default function Home() {
  const month = useMemo(() => new Date().getMonth() + 1, []);
  const tips = useMemo(() => getScrapTips(), []);
  const [tab, setTab] = useState<Tab>("grow");

  const [region, setRegion] = useState<Region | null>(null);
  const [goal, setGoal] = useState<UserGoal | null>(null);
  const [micro, setMicro] = useState<MicroClimate | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [level1, setLevel1] = useState<ApiResponse | null>(null);
  const [level2, setLevel2] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async (ctx: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ctx),
      });
      const data = (await res.json()) as ApiResponse | { error?: string };
      if (!res.ok || "error" in data) {
        setError((data as { error?: string }).error ?? "Lỗi không xác định.");
        return null;
      }
      return data as ApiResponse;
    } catch {
      setError("Không kết nối được máy chủ. Thử lại sau.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Bước 1: chọn vùng → hiện Level 1 ngay
  const selectRegion = useCallback(
    async (r: Region) => {
      setRegion(r);
      setGeoError(null);
      const data = await fetchRecommendations({ region: r, month, ...LEVEL1_DEFAULTS });
      setLevel1(data);
    },
    [fetchRecommendations, month],
  );

  // GPS → vùng gần nhất (chỉ lưu cấp vùng, không lưu tọa độ)
  const useGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Trình duyệt không hỗ trợ GPS. Hãy chọn thành phố thủ công.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        void selectRegion(regionFromCoords(pos.coords.latitude, pos.coords.longitude));
      },
      () => {
        setLocating(false);
        setGeoError("Không lấy được vị trí. Hãy chọn thành phố thủ công.");
      },
      { timeout: 8000 },
    );
  }, [selectRegion]);

  /** Tính lại Level 2 với micro + goal hiện tại (dùng khi đổi goal hoặc micro). */
  const computeLevel2 = async (m: MicroClimate, g: UserGoal | null) => {
    if (!region) return null;
    const proxy = MICRO_PROXY[m];
    return fetchRecommendations({
      region,
      month,
      location_type: proxy.location_type,
      sunlight_hours: proxy.sunlight_hours,
      pot_depth_cm: proxy.pot_depth_cm,
      user_goal: g ?? undefined,
    });
  };

  // Bước 3: chọn micro-climate → Level 2 với context đầy đủ
  const selectMicro = async (m: MicroClimate) => {
    if (!region) return;
    setMicro(m);
    const data = await computeLevel2(m, goal);
    setLevel2(data);
  };

  // Goal đổi sau khi đã chọn micro-climate → tính lại Level 2 ngay (không reset micro)
  const applyGoal = (g: UserGoal) => {
    const next = goal === g ? null : g;
    setGoal(next);
    if (region && micro) {
      void computeLevel2(micro, next).then(setLevel2);
    }
  };

  const addToGarden = (name: string) => {
    // Change my-garden: AddToGardenButton đã POST /api/garden thật, đây chỉ là toast xác nhận
    setToast(`"${name}" đã thêm vào vườn 🌱`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <NavBar hideBack />
      <header>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-emerald-800 sm:text-3xl">🌱 Trồng gì hôm nay?</h1>
          {/* Trạng thái đăng nhập (change add-to-garden-auth) — xem gợi ý không cần login.
              Clerk v7 Core 3: dùng <Show when=...> thay <SignedIn>/<SignedOut>. */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Change my-garden: link tới My Garden (server component tự redirect nếu chưa login) */}
            <Show when="signed-in">
              <Link
                href="/garden"
                className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                🪴 Vườn của tôi
              </Link>
            </Show>
            <Show when="signed-in">
              {/* sign out mặc định quay về trang chủ */}
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal" />
              <SignUpButton mode="modal" />
            </Show>
          </div>
        </div>
        <p className="mt-1 text-sm text-zinc-600">
          Cây nào bạn có khả năng trồng <strong>thành công</strong> nhất ngay bây giờ — theo mùa và vị trí của bạn.
        </p>
      </header>

      {/* ── Tab: Gợi ý / Mẹo vặt (plan 5.3 — mẹo vặt tách riêng, không làm lu mờ USP) ── */}
      <div
        role="tablist"
        aria-label="Nội dung chính"
        className="flex gap-1 rounded-2xl border border-zinc-200 bg-zinc-100 p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "grow"}
          onClick={() => setTab("grow")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
            tab === "grow" ? "bg-white text-emerald-800 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          🌱 Gợi ý trồng gì
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "tips"}
          onClick={() => setTab("tips")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition ${
            tab === "tips" ? "bg-white text-teal-800 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          🧑‍🍳 Mẹo vặt
        </button>
      </div>

      {tab === "grow" && (
        <>
      {/* ── Bước 1: Location ─────────────────────────────────────────────── */}
      <section aria-label="Bước 1: Vị trí" className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="font-semibold text-zinc-900">📍 Bạn ở đâu?</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={useGps}
            disabled={locating}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
          >
            {locating ? "Đang tìm vị trí…" : "📡 Dùng vị trí của tôi"}
          </button>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c.region}
                type="button"
                onClick={() => void selectRegion(c.region)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  region === c.region
                    ? "bg-emerald-600 text-white"
                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {c.label}
                <span className={`ml-1 text-xs ${region === c.region ? "text-emerald-100" : "text-zinc-400"}`}>
                  {c.hint}
                </span>
              </button>
            ))}
          </div>
        </div>
        {geoError && <p className="text-sm text-red-600">{geoError}</p>}
      </section>

      {/* ── Level 1: Good for your area ─────────────────────────────────── */}
      {region && (
        <section aria-label="Level 1" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">🌍 Good for your area</h2>
          <p className="text-sm text-zinc-500">
            Dựa trên vị trí + mùa hiện tại (tháng {month}). Ước lượng ban đầu: ban công, 3h nắng.
          </p>
          {loading && !level1 ? <p className="text-sm text-zinc-500">Đang tính toán…</p> : null}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {level1?.status === "ok" && <CropList recs={level1.recommendations} onAdd={addToGarden} />}
          {level1?.status === "no_match" && <NoMatch message={level1.message} />}
        </section>
      )}

      {/* ── Bước 2: Goal (tùy chọn) ─────────────────────────────────────── */}
      <section aria-label="Bước 2: Mục tiêu" className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="font-semibold text-zinc-900">🎯 Bạn muốn gì nhất?</h2>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => applyGoal(g.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                goal === g.value
                  ? "bg-emerald-600 text-white"
                  : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {g.icon} {g.label}
            </button>
          ))}
          <span className="self-center text-xs text-zinc-400">(bỏ qua cũng được)</span>
        </div>
      </section>

      {/* ── Bước 3: Micro-climate proxy ─────────────────────────────────── */}
      <section aria-label="Bước 3: Vi khí hậu" className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="font-semibold text-zinc-900">🪴 Chỗ trồng của bạn gần giống với?</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {MICROS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => void selectMicro(m.value)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition ${
                micro === m.value
                  ? "border-emerald-600 bg-emerald-50"
                  : "border-zinc-200 hover:border-emerald-300 hover:bg-zinc-50"
              }`}
            >
              <span className="text-3xl">{m.icon}</span>
              <span className="text-sm font-medium text-zinc-900">{m.label}</span>
              <span className="text-xs text-zinc-500">{m.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Level 2: Best for your balcony ──────────────────────────────── */}
      {micro && (
        <section aria-label="Level 2" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">🪴 Best for your balcony</h2>
          <p className="text-sm text-zinc-500">
            Đã tính với chỗ trồng của bạn{MICROS.find((m) => m.value === micro)?.label.toLowerCase() ?? ""}
            {goal ? ` + mục tiêu ${GOALS.find((g) => g.value === goal)?.label ?? ""}` : ""}.
          </p>
          {loading && !level2 ? <p className="text-sm text-zinc-500">Đang tính toán…</p> : null}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {level2?.status === "ok" && <CropList recs={level2.recommendations} onAdd={addToGarden} />}
          {level2?.status === "no_match" && <NoMatch message={level2.message} />}
        </section>
      )}
        </>
      )}

      {/* ── Tab Mẹo vặt: regrow từ phế liệu bếp (plan 5.3) ────────────────── */}
      {tab === "tips" && (
        <section aria-label="Mẹo vặt" className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-900">🧑‍🍳 Mẹo vặt: trồng lại từ phế liệu bếp</h2>
          <p className="text-sm text-zinc-500">
            Không tốn hạt giống, không cần kinh nghiệm — chỉ cần phần gốc hoặc cành còn lại khi nấu ăn.
          </p>
          {tips.length === 0 ? (
            <p className="text-sm text-zinc-500">Chưa có mẹo nào.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {tips.map((tip) => (
                <ScrapTip key={tip.cropId} tip={tip} />
              ))}
            </div>
          )}
        </section>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <footer className="mt-auto pt-6 text-center text-xs text-zinc-400">
        Gợi ý dựa trên dữ liệu khí hậu phổ thông Việt Nam — kết quả trồng có thể khác nhau theo vi khí hậu thực tế.
      </footer>
    </main>
  );
}

function CropList({ recs, onAdd }: { recs: ApiRecommendation[]; onAdd: (name: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {recs.map((rec) => (
        <CropCard key={rec.crop_id} rec={rec} onAdd={onAdd} />
      ))}
    </div>
  );
}

function NoMatch({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      {message}
    </div>
  );
}
