/**
 * Custom 404 cho /crops/* — hiển thị khi deep link có ID không tồn tại.
 * VD: /crops/invalid-id → trang này thay vì default Next.js 404.
 */

import Link from "next/link";

export default function CropNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:px-6">
      <span className="text-6xl" aria-hidden>
        🌿
      </span>
      <h1 className="text-2xl font-bold text-zinc-900">Không tìm thấy loại cây này</h1>
      <p className="max-w-sm text-sm text-zinc-500">
        Có thể URL không chính xác hoặc loại cây này chưa có trong hệ thống.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          🌱 Xem gợi ý trồng gì
        </Link>
        <Link
          href="/garden"
          className="rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          🪴 Vườn của tôi
        </Link>
      </div>
    </main>
  );
}
