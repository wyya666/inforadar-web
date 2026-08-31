"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError, requestPasswordReset, resetPassword } from "./api";

const emailSchema = z.object({ email: z.email("请输入有效的邮箱地址") });
const passwordSchema = z.object({ password: z.string().min(12, "密码至少需要 12 个字符") });

export function ForgotPasswordForm() {
  const [accepted, setAccepted] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });

  if (accepted) return (
    <div className="auth-success" role="status"><Mail /><div><h2>如果账户存在，邮件已经发出</h2><p>请检查收件箱和垃圾邮件。为保护账户隐私，我们不会确认该邮箱是否注册。</p></div><Link className="button button-dark auth-submit" href="/login">返回登录</Link></div>
  );

  return <form className="auth-form" onSubmit={handleSubmit(async ({ email }) => {
    setSubmitError(undefined);
    try { await requestPasswordReset(email); setAccepted(true); }
    catch (error) { setSubmitError(error instanceof ApiError ? error.message : "请求失败，请稍后重试"); }
  })} noValidate>
    <label><span>邮箱</span><input type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />{errors.email ? <small role="alert">{errors.email.message}</small> : null}</label>
    {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}
    <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">{isSubmitting ? "正在发送…" : "发送重置邮件"}<Mail size={17} /></button>
  </form>;
}

export function ResetPasswordForm({ token }: { token?: string }) {
  const [complete, setComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) });

  if (!token) return <div className="verification-state verification-error"><p>重置链接不完整，请从邮件中重新打开。</p></div>;
  if (complete) return <div className="auth-success" role="status"><CheckCircle2 /><div><h2>密码已更新</h2><p>所有旧会话均已退出，请使用新密码重新登录。</p></div><Link className="button button-dark auth-submit" href="/login">前往登录</Link></div>;

  return <form className="auth-form" onSubmit={handleSubmit(async ({ password }) => {
    setSubmitError(undefined);
    try { await resetPassword(token, password); setComplete(true); }
    catch (error) { setSubmitError(error instanceof ApiError ? error.message : "重置失败，请重新申请链接"); }
  })} noValidate>
    <label><span>新密码</span><input type="password" autoComplete="new-password" placeholder="至少 12 个字符" {...register("password")} />{errors.password ? <small role="alert">{errors.password.message}</small> : null}</label>
    {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}
    <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">{isSubmitting ? "正在更新…" : "更新密码"}<Save size={17} /></button>
  </form>;
}
