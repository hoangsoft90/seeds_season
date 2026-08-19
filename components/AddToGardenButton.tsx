"use client";

import { useState } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";

/**
 * Auth-gate + hành động "Thêm vào vườn" thật (change my-garden):
 * - Chưa đăng nhập → redirect tới /sign-in kèm redirectUrl (quay lại sau khi đăng nhập).
 * - Đã đăng nhập → POST /api/garden { crop_id }; thành công → báo `onAdded` + đổi nút thành "✓ Đã thêm".
 *
 * Clerk v7: `redirectToSignIn` nằm trên `useClerk()`, không phải `useAuth()`.
 */
export default function AddToGardenButton({
  cropId,
  cropName,
  onAdded,
}: {
  cropId: string;
  cropName: string;
  onAdded?: (name: string) => void;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const { redirectToSignIn } = useClerk();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!isLoaded) return; // đang kiểm tra session
    if (!isSignedIn) {
      void redirectToSignIn({ redirectUrl: window.location.href });
      return;
    }
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop_id: cropId }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Không thêm được vào vườn.");
        return;
      }
      setAdded(true);
      onAdded?.(cropName);
    } catch {
      setError("Không kết nối được máy chủ. Thử lại sau.");
    } finally {
      setAdding(false);
    }
  };

  if (added) {
    return (
      <span className="self-start rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
        ✓ Đã thêm vào vườn
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={adding || !isLoaded}
        className="self-start rounded-full border border-emerald-600 px-4 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:opacity-60"
      >
        {adding ? "Đang thêm…" : "+ Thêm vào vườn"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
