/**
 * My Garden — storage file-based per-user (change my-garden, design.md Decisions).
 *
 * File JSON duy nhất `data/garden.json` (có thể ghi đè đường dẫn qua env
 * `GARDEN_DATA_FILE` — dùng trong test). Đủ cho single-instance dev/MVP;
 * khi migrate Postgres chỉ cần giữ nguyên chữ ký hàm (add/list/markGhost/remove).
 *
 * Bất biến quan trọng (đừng phá): **remove ≠ xoá** — mọi bản ghi cây đã thêm
 * đều được giữ lại, chuyển sang ghost. Không tồn tại hàm xoá vật lý trong MVP.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import type { GardenPlant, GhostCause } from "./types";
import { DuplicateCropError } from "./types";

interface GardenFile {
  plants: GardenPlant[];
}

function dataFile(): string {
  return process.env.GARDEN_DATA_FILE ?? path.join(process.cwd(), "data", "garden.json");
}

function load(): GardenPlant[] {
  try {
    const file = dataFile();
    if (!existsSync(file)) return [];
    const parsed = JSON.parse(readFileSync(file, "utf-8")) as GardenFile;
    return Array.isArray(parsed.plants) ? parsed.plants : [];
  } catch {
    // File hỏng → coi như rỗng (dev); không crash request.
    return [];
  }
}

function save(plants: GardenPlant[]): void {
  const file = dataFile();
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify({ plants } satisfies GardenFile, null, 2), "utf-8");
}

/** Danh sách cây của một user (growing trước, rồi ghost theo thời gian chết). */
export function listGarden(userId: string): GardenPlant[] {
  return load()
    .filter((p) => p.user_id === userId)
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "growing" ? -1 : 1;
      return new Date(b.planted_at).getTime() - new Date(a.planted_at).getTime();
    });
}

/** Thêm cây vào vườn với ngày trồng = hôm nay. Ném DuplicateCropError nếu đã có cây đang trồng cùng loại. */
export function addPlant(userId: string, cropId: string): GardenPlant {
  const plants = load();
  if (plants.some((p) => p.user_id === userId && p.crop_id === cropId && p.status === "growing")) {
    throw new DuplicateCropError(cropId);
  }
  const plant: GardenPlant = {
    id: randomUUID(),
    user_id: userId,
    crop_id: cropId,
    planted_at: new Date().toISOString(),
    status: "growing",
  };
  plants.push(plant);
  save(plants);
  return plant;
}

/** Đánh dấu cây chết → ghost với cause. Chỉ user sở hữu. Trả null nếu không tìm thấy. */
export function markGhost(userId: string, plantId: string, cause: GhostCause): GardenPlant | null {
  const plants = load();
  const plant = plants.find((p) => p.id === plantId && p.user_id === userId);
  if (!plant) return null;
  if (plant.status === "growing") {
    plant.status = "ghost";
    plant.died_at = new Date().toISOString();
    plant.cause = cause;
    save(plants);
  }
  return plant;
}

/**
 * Bỏ theo dõi / xoá khỏi danh sách growing → KHÔNG xoá vật lý: chuyển sang ghost
 * với cause = unknown (history không bao giờ bị huỷ — plan mục 6). Trả null nếu không tìm thấy.
 */
export function removePlant(userId: string, plantId: string): GardenPlant | null {
  const plants = load();
  const plant = plants.find((p) => p.id === plantId && p.user_id === userId);
  if (!plant) return null;
  if (plant.status === "growing") {
    plant.status = "ghost";
    plant.died_at = new Date().toISOString();
    plant.cause = "unknown";
    save(plants);
  }
  return plant;
}

/** Đánh dấu cây đã thu hoạch → status = harvested. Trả null nếu không tìm thấy hoặc không phải growing. */
export function markHarvested(userId: string, plantId: string): GardenPlant | null {
  const plants = load();
  const plant = plants.find((p) => p.id === plantId && p.user_id === userId);
  if (!plant || plant.status !== "growing") return null;
  plant.status = "harvested";
  plant.harvested_at = new Date().toISOString();
  save(plants);
  return plant;
}

/** Lịch sử thất bại (ghost plants) của user — dùng cho nudge gợi ý (data moat). */
export function getGhostHistory(userId: string): GardenPlant[] {
  return load().filter((p) => p.user_id === userId && p.status === "ghost");
}
