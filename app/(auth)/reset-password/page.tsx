import { AuthCard } from "@/features/auth/auth-card";
import { ResetPasswordForm } from "@/features/auth/password-recovery";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const query = await searchParams;
  const token = Array.isArray(query.token) ? query.token[0] : query.token;
  return <AuthCard eyebrow="设置新密码" title="更新你的登录密码" description="完成后，所有旧的刷新会话都会被撤销。"><ResetPasswordForm token={token} /></AuthCard>;
}
