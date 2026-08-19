/**
 * Custom 404 page — thay thế default Next.js 404 (ugly, no navigation).
 * Hiển thị khi: deep link invalid (VD: /crops/invalid-id), URL sai, etc.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:px-6">
      <span className="text-6xl" aria-hidden>
        🌱
      </span>
      <h1 className="text-2xl font-bold text-zinc-900">Không tìm thấy trang</h1>
      <p className="max-w-sm text-sm text-zinc-500">
        Trang bạn tìm có thể đã bị di chuyển, chưa tồn tại, hoặc URL không chính xác.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          🌱 Về trang chủ
        </Link>
        <Link
          href="/garden"
          className="rounded-full border border-emerald-300 px-5 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
        >
          🪴 Vườn của tôi
        </Link>
        <Link
          href="/first-aid"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          🆘 Sơ cứu cây
        </Link>
      </div>
    </main>
  );
}
