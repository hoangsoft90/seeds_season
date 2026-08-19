/**
 * /first-aid — Deterministic First Aid (change deterministic-first-aid, plan mục 6).
 * Checklist phân nhánh luật cứng: user chọn triệu chứng → câu hỏi → diagnosis + remedy.
 * Chạy client-side hoàn toàn — không login, không API.
 */

import Link from "next/link";
import FirstAidWizard from "@/components/FirstAidWizard";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Cây có vấn đề? — Sơ cứu cây trồng — Trồng gì hôm nay?",
  description:
    "Chọn triệu chứng và trả lời vài câu hỏi để nhận chẩn đoán + cách xử lý từng bước — không cần đăng nhập.",
};

export default function FirstAidPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8 sm:px-6">
      <NavBar title="Sơ cứu cây" />
      <header>
        <h1 className="text-2xl font-bold text-emerald-800 sm:text-3xl">🆘 Sơ cứu cây trồng</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Cây có vấn đề? Trả lời vài câu hỏi để nhận chẩn đoán và cách xử lý từng bước — miễn phí, không cần đăng nhập.
        </p>
      </header>

      <FirstAidWizard />

      <footer className="mt-auto pt-6 text-center text-xs text-zinc-400">
        <p>Hướng dẫn chung dựa trên kiến thức làm vườn phổ thông — kết quả có thể khác nhau theo cây và điều kiện thực tế.</p>
        <nav className="mt-2 flex items-center justify-center gap-3 text-sm font-medium">
          <Link href="/" className="text-emerald-700 hover:underline">
            ← Trang chủ
          </Link>
          <span className="text-zinc-300">|</span>
          <Link href="/garden" className="text-emerald-700 hover:underline">
            🪴 Vườn của tôi
          </Link>
        </nav>
      </footer>
    </main>
  );
}
