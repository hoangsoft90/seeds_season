/**
 * /api/garden — My Garden (change my-garden).
 *
 * GET  → danh sách cây của user (auth bắt buộc)
 * POST → thêm cây (auth bắt buộc; 400 crop_id lạ; 409 đã có cây đang trồng cùng loại)
 *
 * Auth: check `auth()` trong route handler (Clerk v7 khuyến nghị — defense in depth,
 * ngoài proxy.ts đã gate 401 cho toàn namespace /api/garden*).
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { addPlant, listGarden } from "@/lib/garden/store";
import { DuplicateCropError } from "@/lib/garden/types";
import { getCropById } from "@/lib/data/crops";

const UNAUTH = { error: "Bạn cần đăng nhập để quản lý vườn." };

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(UNAUTH, { status: 401 });
  return NextResponse.json({ plants: listGarden(userId) });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json(UNAUTH, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body không phải JSON hợp lệ." }, { status: 400 });
  }
  const cropId = (body as { crop_id?: unknown } | null)?.crop_id;
  if (typeof cropId !== "string" || !getCropById(cropId)) {
    return NextResponse.json({ error: `'crop_id' không hợp lệ: ${String(cropId)}` }, { status: 400 });
  }

  try {
    const plant = addPlant(userId, cropId);
    return NextResponse.json({ plant }, { status: 201 });
  } catch (err) {
    if (err instanceof DuplicateCropError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }
}
