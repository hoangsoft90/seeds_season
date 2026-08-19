/**
 * Unit test cho My Garden store (change my-garden).
 *
 * Bảo vệ 2 bất biến quan trọng:
 * 1. Per-user isolation — user này không thấy/sửa được cây của user khác.
 * 2. NEVER delete — remove/markGhost đều giữ bản ghi (chuyển ghost), không xoá vật lý.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { addPlant, listGarden, markGhost, markHarvested, removePlant, getGhostHistory } from "../lib/garden/store";
import { DuplicateCropError } from "../lib/garden/types";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "garden-test-"));
  process.env.GARDEN_DATA_FILE = path.join(dir, "garden.json");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  delete process.env.GARDEN_DATA_FILE;
});

describe("garden store", () => {
  it("adds a plant with growing status and today as planting date", () => {
    const plant = addPlant("user-1", "cai_xanh");
    expect(plant.status).toBe("growing");
    expect(plant.crop_id).toBe("cai_xanh");
    expect(plant.user_id).toBe("user-1");
    expect(new Date(plant.planted_at).getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("lists only the caller's plants (per-user isolation)", () => {
    addPlant("user-1", "cai_xanh");
    addPlant("user-2", "rau_muong");
    const list1 = listGarden("user-1");
    const list2 = listGarden("user-2");
    expect(list1).toHaveLength(1);
    expect(list1[0].crop_id).toBe("cai_xanh");
    expect(list2).toHaveLength(1);
    expect(list2[0].crop_id).toBe("rau_muong");
  });

  it("rejects a duplicate growing crop for the same user", () => {
    addPlant("user-1", "cai_xanh");
    expect(() => addPlant("user-1", "cai_xanh")).toThrow(DuplicateCropError);
    // Nhưng user khác vẫn thêm được cây đó
    expect(() => addPlant("user-2", "cai_xanh")).not.toThrow();
  });

  it("markGhost converts growing → ghost with cause and keeps the record", () => {
    const plant = addPlant("user-1", "cai_xanh");
    const ghost = markGhost("user-1", plant.id, "sun_heat");
    expect(ghost).not.toBeNull();
    expect(ghost!.status).toBe("ghost");
    expect(ghost!.cause).toBe("sun_heat");
    expect(ghost!.died_at).toBeDefined();
    // Vẫn còn trong list — chỉ đổi trạng thái
    expect(listGarden("user-1")).toHaveLength(1);
    expect(listGarden("user-1")[0].status).toBe("ghost");
  });

  it("cannot mark ghost another user's plant", () => {
    const plant = addPlant("user-1", "cai_xanh");
    expect(markGhost("user-2", plant.id, "pest")).toBeNull();
    expect(listGarden("user-1")[0].status).toBe("growing");
  });

  it("remove converts to ghost with unknown cause — NEVER deletes physically", () => {
    const plant = addPlant("user-1", "rau_muong");
    const removed = removePlant("user-1", plant.id);
    expect(removed).not.toBeNull();
    expect(removed!.status).toBe("ghost");
    expect(removed!.cause).toBe("unknown");
    // Bản ghi vẫn tồn tại trong file
    expect(listGarden("user-1")).toHaveLength(1);
    expect(getGhostHistory("user-1")).toHaveLength(1);
    // Không có hàm xoá vật lý: bất biến "history never destroyed" giữ nguyên
    expect(existsSync(path.join(dir, "garden.json"))).toBe(true);
  });

  it("returns null for unknown plant id", () => {
    expect(markGhost("user-1", "khong-ton-tai", "pest")).toBeNull();
    expect(removePlant("user-1", "khong-ton-tai")).toBeNull();
  });

  it("markHarvested converts growing → harvested with harvested_at", () => {
    const plant = addPlant("user-1", "cai_xanh");
    const harvested = markHarvested("user-1", plant.id);
    expect(harvested).not.toBeNull();
    expect(harvested!.status).toBe("harvested");
    expect(harvested!.harvested_at).toBeDefined();
    expect(listGarden("user-1")).toHaveLength(1);
    expect(listGarden("user-1")[0].status).toBe("harvested");
  });

  it("cannot harvest a ghost or already harvested plant", () => {
    const plant = addPlant("user-1", "cai_xanh");
    markGhost("user-1", plant.id, "pest");
    expect(markHarvested("user-1", plant.id)).toBeNull();

    const plant2 = addPlant("user-1", "rau_muong");
    markHarvested("user-1", plant2.id);
    expect(markHarvested("user-1", plant2.id)).toBeNull();
  });

  it("getGhostHistory returns only ghost plants with cause", () => {
    const growing = addPlant("user-1", "cai_xanh");
    const ghost = addPlant("user-1", "xa_lach");
    markGhost("user-1", ghost.id, "waterlogged");
    const history = getGhostHistory("user-1");
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe(ghost.id);
    expect(history[0].cause).toBe("waterlogged");
    expect(history[0].crop_id).not.toBe(growing.crop_id);
  });
});
