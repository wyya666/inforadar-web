import { AuthCard } from "@/features/auth/auth-card";
import { VerifyEmailStatus } from "@/features/auth/verify-email-status";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const query = await searchParams;
  const token = Array.isArray(query.token) ? query.token[0] : query.token;

  return (
    <AuthCard eyebrow="邮箱验证" title="确认你的邮箱" description="完成验证后，登录会话才会被启用。">
      <VerifyEmailStatus token={token} />
    </AuthCard>
  );
}
