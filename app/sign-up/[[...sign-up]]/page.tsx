import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-8">
      <div className="text-center">
        <h1 className="text-xl font-bold text-emerald-800">🌱 Tạo tài khoản</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Miễn phí — lưu vườn của bạn và nhận gợi ý cá nhân hóa theo lịch sử trồng.
        </p>
      </div>
      <SignUp />
    </main>
  );
}
