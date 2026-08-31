import Link from "next/link";

import { AuthCard } from "@/features/auth/auth-card";
import { RegistrationForm } from "@/features/auth/registration-form";

export default function RegisterPage() {
  return (
    <AuthCard
      eyebrow="创建账户"
      title="开始你的长期关注"
      description="注册后先验证邮箱，再配置自己的 DeepSeek API Key。"
      footer={<p>已有账户？<Link href="/login">直接登录</Link></p>}
    >
      <RegistrationForm />
    </AuthCard>
  );
}
