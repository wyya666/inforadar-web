import { AuthCard } from "@/features/auth/auth-card";
import { ForgotPasswordForm } from "@/features/auth/password-recovery";

export default function ForgotPasswordPage() {
  return <AuthCard eyebrow="找回密码" title="重新获得账户访问权" description="输入注册邮箱，我们会发送一条限时重置链接。"><ForgotPasswordForm /></AuthCard>;
}
