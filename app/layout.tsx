import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trồng gì hôm nay? — Gợi ý rau củ quả theo mùa",
  description:
    "Cây nào bạn có khả năng trồng thành công nhất ngay bây giờ? Gợi ý trồng rau/củ/quả theo mùa và vị trí cho người mới trồng ban công ở Việt Nam.",
  applicationName: "Trồng gì hôm nay?",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // System font stack — tránh phụ thuộc Google Fonts (dev/offline-friendly, PWA-ready)
    <html lang="vi" className="h-full antialiased">
      {/* ClerkProvider phải nằm trong <body> (docs Next 15+) */}
      <ClerkProvider>
        <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-900">
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
