"use client";

/**
 * NavBar — navigation element chung cho mọi page mobile.
 *
 * Tính năng:
 * - Nút back an toàn (router.back → fallback "/" nếu history rỗng)
 * - Links đến các section chính: Trang chủ, Vườn, Sơ cứu
 * - Hiển thị trên mobile, ẩn trên desktop (app mobile-first)
 *
 * Safe-back: tránh trường hợp user deep-link vào app → bấm back → thoát app.
 * Thay vào đó, fallback về trang chủ.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface NavBarProps {
  /** Ẩn nút back (VD: ở trang chủ). Default: false. */
  hideBack?: boolean;
  /** Title hiển thị giữa navbar. */
  title?: string;
}

export default function NavBar({ hideBack = false, title }: NavBarProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    // Safe-back: nếu có history thì back, không thì về trang chủ
    // Tránh dead-end khi user deep-link vào app
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <nav className="sticky top-0 z-50 flex items-center gap-2 border-b border-zinc-200 bg-white/80 px-4 py-2.5 backdrop-blur-sm sm:hidden">
      {/* Back button — an toàn, không bao giờ dead-end */}
      {!hideBack && (
        <button
          type="button"
          onClick={handleBack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100"
          aria-label="Quay lại"
        >
          ←
        </button>
      )}

      {/* Title */}
      {title && (
        <span className="truncate text-sm font-semibold text-zinc-900">{title}</span>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Quick links */}
      <Link
        href="/"
        className="rounded-full px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100"
        aria-label="Trang chủ"
      >
        🏠
      </Link>
      <Link
        href="/garden"
        className="rounded-full px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100"
        aria-label="Vườn của tôi"
      >
        🪴
      </Link>
      <Link
        href="/first-aid"
        className="rounded-full px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100"
        aria-label="Sơ cứu cây"
      >
        🆘
      </Link>
    </nav>
  );
}
