import Link from "next/link";

import { AuthCard } from "@/features/auth/auth-card";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="欢迎回来"
      title="继续关注重要变化"
      description="登录后查看雷达运行状态、搜索服务配置和最新命中。"
      footer={<p>还没有账户？<Link href="/register">免费注册</Link></p>}
    >
      <LoginForm />
    </AuthCard>
  );
}
