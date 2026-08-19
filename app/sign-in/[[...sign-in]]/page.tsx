import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-4 py-8">
      <div className="text-center">
        <h1 className="text-xl font-bold text-emerald-800">🌱 Đăng nhập để quản lý vườn</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Xem gợi ý vẫn miễn phí không cần tài khoản — đăng nhập chỉ để lưu vườn của bạn.
        </p>
      </div>
      <SignIn />
    </main>
  );
}
