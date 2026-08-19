/**
 * /garden — My Garden (change my-garden).
 *
 * Server component: yêu cầu đăng nhập (chưa login → redirect /sign-in kèm return path).
 * Lấy danh sách cây của user từ store, map sang view model rồi giao client
 * `GardenView` lo phần tương tác (mark ghost / bỏ theo dõi).
 */

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import { getAllCrops } from "@/lib/data/crops";
import { listGarden } from "@/lib/garden/store";
import GardenView, { type GardenPlantView } from "@/components/GardenView";

export const metadata = {
  title: "Vườn của tôi — Trồng gì hôm nay?",
};

export default async function GardenPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/garden");
  }

  const crops = getAllCrops();
  const nameOf = (cropId: string): string =>
    crops.find((c) => c.crop_base.id === cropId)?.crop_base.names.canonical_vi ?? cropId;

  const cropMap = new Map(crops.map((c) => [c.crop_base.id, c]));

  const view: GardenPlantView[] = listGarden(userId).map((p) => {
    const crop = cropMap.get(p.crop_id);
    return {
      id: p.id,
      cropId: p.crop_id,
      cropName: nameOf(p.crop_id),
      plantedAt: p.planted_at,
      status: p.status,
      diedAt: p.died_at,
      cause: p.cause,
      harvestedAt: p.harvested_at,
      timeline: crop?.crop_base.timeline_base ?? null,
      category: crop?.crop_base.category,
    };
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <NavBar title="Vườn của tôi" />
      <header>
        <h1 className="text-2xl font-bold text-emerald-800 sm:text-3xl">🪴 Vườn của tôi</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Theo dõi cây đang trồng — khi cây chết, chọn nhanh nguyên nhân để lần sau được gợi ý đúng hơn.
        </p>
      </header>

      <GardenView plants={view} />

      <footer className="mt-auto pt-6 text-center text-xs text-zinc-400">
        <nav className="flex items-center justify-center gap-3 text-sm font-medium">
          <Link href="/" className="text-emerald-700 hover:underline">
            ← Trang chủ
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href="/first-aid" className="text-emerald-700 hover:underline">
            🆘 Sơ cứu cây
          </Link>
        </nav>
      </footer>
    </main>
  );
}
