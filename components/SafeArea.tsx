"use client";

/**
 * SafeArea — wrapper đảm bảo content không bị che bởi
 * Android 3-button navigation bar (bottom) và gesture nav (edges).
 *
 * Sử dụng CSS env() safe area insets — hoạt động trên cả Android và iOS.
 * Wrapper toàn bộ layout để tạo padding bottom an toàn.
 */

import { type ReactNode } from "react";

interface SafeAreaProps {
  children: ReactNode;
  /** Có thêm padding bottom cho nav bar không. Default: true. */
  bottom?: boolean;
  /** Có thêm padding top cho status bar không. Default: false. */
  top?: boolean;
}

export default function SafeArea({ children, bottom = true, top = false }: SafeAreaProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        paddingTop: top ? "env(safe-area-inset-top, 0px)" : undefined,
        paddingBottom: bottom ? "env(safe-area-inset-bottom, 0px)" : undefined,
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * BottomSafePadding — thêm padding bottom đủ lớn để content không bị che
 * bởi Android 3-button navigation bar (~48dp) hoặc gesture nav (~20dp).
 *
 * Dùng cho các trang có fixed bottom elements (banner ads, floating buttons).
 */
export function BottomSafePadding({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        paddingBottom: "calc(48px + env(safe-area-inset-bottom, 0px))",
      }}
    />
  );
}
