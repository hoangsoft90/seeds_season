import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Login-on-demand (plan mục 5.1): chỉ bảo vệ API garden — mọi trang xem
 * gợi ý / crop detail / mẹo vặt vẫn public, không ép đăng nhập.
 * Đăng nhập chỉ cần khi bấm "Thêm vào vườn" (gọi /api/garden*).
 *
 * Trả 401 JSON (thay vì 404 của auth().protect()) để client fetch xử lý đúng
 * — spec user-auth yêu cầu "API returns 401".
 */
const isGardenApi = createRouteMatcher(["/api/garden(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isGardenApi(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Bạn cần đăng nhập để quản lý vườn." }, { status: 401 });
    }
  }
});

export const config = {
  matcher: [
    // Chạy trên mọi route trừ static assets & Next internals (mẫu chuẩn của Clerk)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Clerk auto-proxy path (bắt buộc sau API/TRPC matcher — hướng dẫn CLI)
    "/__clerk/:path*",
  ],
};
