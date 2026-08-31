"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError, registerAccount } from "./api";

const registrationSchema = z.object({
  display_name: z.string().trim().min(1, "请输入昵称").max(80, "昵称不能超过 80 个字符"),
  email: z.email("请输入有效的邮箱地址"),
  password: z.string().min(12, "密码至少需要 12 个字符"),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string>();
  const [submitError, setSubmitError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
  });

  async function onSubmit(values: RegistrationValues) {
    setSubmitError(undefined);
    try {
      const result = await registerAccount(values);
      setSubmittedEmail(result.user.email);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : "注册失败，请稍后重试");
    }
  }

  if (submittedEmail) {
    return (
      <div className="auth-success" role="status">
        <CheckCircle2 size={30} aria-hidden="true" />
        <div>
          <h2>验证邮件已发送</h2>
          <p>请前往 <strong>{submittedEmail}</strong> 点击验证链接，然后返回登录。</p>
        </div>
        <Link className="button button-dark auth-submit" href="/login">前往登录 <ArrowRight size={17} /></Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        <span>昵称</span>
        <input autoComplete="name" placeholder="怎么称呼你" {...register("display_name")} />
        {errors.display_name ? <small role="alert">{errors.display_name.message}</small> : null}
      </label>
      <label>
        <span>邮箱</span>
        <input autoComplete="email" type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email ? <small role="alert">{errors.email.message}</small> : null}
      </label>
      <label>
        <span>密码</span>
        <input autoComplete="new-password" type="password" placeholder="至少 12 个字符" {...register("password")} />
        {errors.password ? <small role="alert">{errors.password.message}</small> : null}
      </label>
      {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}
      <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "正在创建…" : "创建账户"}<ArrowRight size={17} />
      </button>
    </form>
  );
}
