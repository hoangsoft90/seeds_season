/**
 * My Garden — AsyncStorage-based store (Expo React Native version).
 * 
 * Bất biến: KHÔNG BAO GIỜ xoá vật lý — chuyển sang ghost.
 * Dùng AsyncStorage thay vì file system (React Native không có fs trực tiếp).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "../utils/uuid";
import type { GardenPlant, GhostCause } from "./types";

const STORAGE_KEY = "@seeds_season_garden";

interface GardenFile {
  plants: GardenPlant[];
}

async function load(): Promise<GardenPlant[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GardenFile;
    return Array.isArray(parsed.plants) ? parsed.plants : [];
  } catch {
    return [];
  }
}

async function save(plants: GardenPlant[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ plants }));
}

/** Danh sách cây của user (growing trước, ghost/harvested sau). */
export async function listGarden(userId: string): Promise<GardenPlant[]> {
  const plants = await load();
  return plants
    .filter((p) => p.user_id === userId)
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "growing" ? -1 : 1;
      return new Date(b.planted_at).getTime() - new Date(a.planted_at).getTime();
    });
}

/** Thêm cây vào vườn. Throw nếu đã có cây đang trồng cùng loại. */
export async function addPlant(userId: string, cropId: string): Promise<GardenPlant> {
  const plants = await load();
  if (plants.some((p) => p.user_id === userId && p.crop_id === cropId && p.status === "growing")) {
    throw new Error(`Cây '${cropId}' đã có trong vườn của bạn.`);
  }
  const plant: GardenPlant = {
    id: randomUUID(),
    user_id: userId,
    crop_id: cropId,
    planted_at: new Date().toISOString(),
    status: "growing",
  };
  plants.push(plant);
  await save(plants);
  return plant;
}

/** Đánh dấu cây chết → ghost. */
export async function markGhost(userId: string, plantId: string, cause: GhostCause): Promise<GardenPlant | null> {
  const plants = await load();
  const plant = plants.find((p) => p.id === plantId && p.user_id === userId);
  if (!plant) return null;
  if (plant.status === "growing") {
    plant.status = "ghost";
    plant.died_at = new Date().toISOString();
    plant.cause = cause;
    await save(plants);
  }
  return plant;
}

/** Bỏ theo dõi → ghost (cause = unknown, KHÔNG xoá vật lý). */
export async function removePlant(userId: string, plantId: string): Promise<GardenPlant | null> {
  const plants = await load();
  const plant = plants.find((p) => p.id === plantId && p.user_id === userId);
  if (!plant) return null;
  if (plant.status === "growing") {
    plant.status = "ghost";
    plant.died_at = new Date().toISOString();
    plant.cause = "unknown";
    await save(plants);
  }
  return plant;
}

/** Đánh dấu đã thu hoạch. */
export async function markHarvested(userId: string, plantId: string): Promise<GardenPlant | null> {
  const plants = await load();
  const plant = plants.find((p) => p.id === plantId && p.user_id === userId);
  if (!plant || plant.status !== "growing") return null;
  plant.status = "harvested";
  plant.harvested_at = new Date().toISOString();
  await save(plants);
  return plant;
}

/** Lịch sử thất bại (ghost plants) — Data Moat. */
export async function getGhostHistory(userId: string): Promise<GardenPlant[]> {
  const plants = await load();
  return plants.filter((p) => p.user_id === userId && p.status === "ghost");
}
