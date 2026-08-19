/**
 * Integration test cho /api/garden* (change my-garden) — mock `auth()` của Clerk
 * (không phụ thuộc Clerk Backend API / rate limit — deterministic).
 *
 * Route handlers là thin wrapper quanh store; store đã được unit test riêng
 * (tests/garden.test.ts). Ở đây kiểm tra: auth gate 401, validation 400/409,
 * owner-only 404, và invariant never-delete qua HTTP layer.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { GET, POST } from "../app/api/garden/route";
import { PATCH, DELETE } from "../app/api/garden/[id]/route";
import { addPlant, listGarden } from "../lib/garden/store";

const mockedAuth = vi.mocked(auth);
const authed = { userId: "user-1" } as Awaited<ReturnType<typeof auth>>;

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "garden-api-test-"));
  process.env.GARDEN_DATA_FILE = path.join(dir, "garden.json");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  delete process.env.GARDEN_DATA_FILE;
  vi.clearAllMocks();
});

const jsonReq = (method: string, body: unknown) =>
  new Request("http://localhost/api/garden", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const paramsOf = (id: string) => ({ params: Promise.resolve({ id }) });

describe("garden API — auth gate", () => {
  it("GET trả 401 khi anonymous", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("POST trả 401 khi anonymous", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
    const res = await POST(jsonReq("POST", { crop_id: "cai_xanh" }));
    expect(res.status).toBe(401);
  });

  it("PATCH trả 401 khi anonymous", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
    const res = await PATCH(jsonReq("PATCH", { cause: "pest" }), paramsOf("any"));
    expect(res.status).toBe(401);
  });

  it("DELETE trả 401 khi anonymous", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);
    const res = await DELETE(new Request("http://localhost"), paramsOf("any"));
    expect(res.status).toBe(401);
  });
});

describe("garden API — POST add", () => {
  it("thêm cây hợp lệ → 201 + status growing", async () => {
    mockedAuth.mockResolvedValue(authed);
    const res = await POST(jsonReq("POST", { crop_id: "cai_xanh" }));
    expect(res.status).toBe(201);
    const body = (await res.json()) as { plant: { crop_id: string; status: string } };
    expect(body.plant.crop_id).toBe("cai_xanh");
    expect(body.plant.status).toBe("growing");
  });

  it("crop_id lạ → 400", async () => {
    mockedAuth.mockResolvedValue(authed);
    const res = await POST(jsonReq("POST", { crop_id: "khong-ton-tai" }));
    expect(res.status).toBe(400);
  });

  it("thêm trùng cây đang trồng → 409", async () => {
    mockedAuth.mockResolvedValue(authed);
    await POST(jsonReq("POST", { crop_id: "cai_xanh" }));
    const res = await POST(jsonReq("POST", { crop_id: "cai_xanh" }));
    expect(res.status).toBe(409);
  });

  it("body không phải JSON → 400", async () => {
    mockedAuth.mockResolvedValue(authed);
    const res = await POST(new Request("http://localhost", { method: "POST", body: "not-json" }));
    expect(res.status).toBe(400);
  });
});

describe("garden API — PATCH mark ghost & DELETE", () => {
  it("PATCH cause hợp lệ → ghost với cause", async () => {
    mockedAuth.mockResolvedValue(authed);
    const plant = addPlant("user-1", "cai_xanh");
    const res = await PATCH(jsonReq("PATCH", { cause: "sun_heat" }), paramsOf(plant.id));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { plant: { status: string; cause: string } };
    expect(body.plant.status).toBe("ghost");
    expect(body.plant.cause).toBe("sun_heat");
  });

  it("PATCH cause lạ → 400", async () => {
    mockedAuth.mockResolvedValue(authed);
    const plant = addPlant("user-1", "cai_xanh");
    const res = await PATCH(jsonReq("PATCH", { cause: "khong-hop-le" }), paramsOf(plant.id));
    expect(res.status).toBe(400);
  });

  it("PATCH không phải cây của mình → 404 (owner-only)", async () => {
    mockedAuth.mockResolvedValue(authed);
    const plant = addPlant("user-1", "cai_xanh");
    mockedAuth.mockResolvedValue({ userId: "user-2" } as Awaited<ReturnType<typeof auth>>);
    const res = await PATCH(jsonReq("PATCH", { cause: "pest" }), paramsOf(plant.id));
    expect(res.status).toBe(404);
  });

  it("DELETE → chuyển ghost cause=unknown, KHÔNG xoá vật lý", async () => {
    mockedAuth.mockResolvedValue(authed);
    const plant = addPlant("user-1", "cai_xanh");
    const res = await DELETE(new Request("http://localhost"), paramsOf(plant.id));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { plant: { status: string; cause: string } };
    expect(body.plant.status).toBe("ghost");
    expect(body.plant.cause).toBe("unknown");
    // Bản ghi vẫn còn — chỉ đổi trạng thái
    expect(listGarden("user-1")).toHaveLength(1);
    expect(listGarden("user-1")[0].status).toBe("ghost");
  });

  it("DELETE id không tồn tại → 404", async () => {
    mockedAuth.mockResolvedValue(authed);
    const res = await DELETE(new Request("http://localhost"), paramsOf("khong-ton-tai"));
    expect(res.status).toBe(404);
  });
});
