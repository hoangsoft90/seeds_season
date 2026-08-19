/**
 * /api/garden/[id] — thao tác trên một cây trong vườn (change my-garden).
 *
 * PATCH  → đánh dấu chết (ghost) + cause (☀️/🐛/🌊/❓)
 * DELETE → bỏ theo dõi: KHÔNG xoá vật lý, chuyển ghost cause=unknown (plan mục 6)
 *
 * Chỉ user sở hữu cây mới thao tác được (404 nếu không thuộc về mình).
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { markGhost, markHarvested, removePlant } from "@/lib/garden/store";
import type { GhostCause } from "@/lib/garden/types";

const UNAUTH = { error: "Bạn cần đăng nhập để quản lý vườn." };
const NOT_FOUND = { error: "Không tìm thấy cây này trong vườn của bạn." };
const CAUSES = new Set<GhostCause>(["sun_heat", "pest", "waterlogged", "unknown"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(UNAUTH, { status: 401 });

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body không phải JSON hợp lệ." }, { status: 400 });
  }

  // Harvest action: { status: "harvested" }
  const status = (body as { status?: unknown } | null)?.status;
  if (status === "harvested") {
    const plant = markHarvested(userId, id);
    if (!plant) return NextResponse.json(NOT_FOUND, { status: 404 });
    return NextResponse.json({ plant });
  }

  // Ghost action: { cause: GhostCause }
  const cause = (body as { cause?: unknown } | null)?.cause;
  if (typeof cause !== "string" || !CAUSES.has(cause as GhostCause)) {
    return NextResponse.json({ error: `'cause' không hợp lệ: ${String(cause)}` }, { status: 400 });
  }

  const ghostPlant = markGhost(userId, id, cause as GhostCause);
  if (!ghostPlant) return NextResponse.json(NOT_FOUND, { status: 404 });
  return NextResponse.json({ plant: ghostPlant });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(UNAUTH, { status: 401 });

  const { id } = await params;
  const plant = removePlant(userId, id);
  if (!plant) return NextResponse.json(NOT_FOUND, { status: 404 });
  return NextResponse.json({ plant });
}
