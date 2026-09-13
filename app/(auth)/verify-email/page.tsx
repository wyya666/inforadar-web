import { AuthCard } from "@/features/auth/auth-card";
import { VerifyEmailStatus } from "@/features/auth/verify-email-status";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const query = await searchParams;
  const token = Array.isArray(query.token) ? query.token[0] : query.token;

  return (
    <AuthCard eyebrow="兼容页面" title="确认邮箱记录" description="新账号无需验证即可登录；此页面仅用于兼容已有验证链接。">
      <VerifyEmailStatus token={token} />
    </AuthCard>
  );
}
