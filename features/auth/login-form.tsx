"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ApiError, login } from "./api";

const loginSchema = z.object({
  email: z.email("请输入有效的邮箱地址"),
  password: z.string().min(1, "请输入密码"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginValues) {
    setSubmitError(undefined);
    try {
      await login(values);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : "登录失败，请稍后重试");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        <span>邮箱</span>
        <input autoComplete="email" type="email" placeholder="you@example.com" {...register("email")} />
        {errors.email ? <small role="alert">{errors.email.message}</small> : null}
      </label>
      <div className="auth-field">
        <span className="label-row"><label htmlFor="login-password">密码</label><Link href="/forgot-password">忘记密码？</Link></span>
        <input id="login-password" autoComplete="current-password" type="password" placeholder="输入你的密码" {...register("password")} />
        {errors.password ? <small role="alert">{errors.password.message}</small> : null}
      </div>
      {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}
      <button className="button button-primary auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "正在登录…" : "登录"}<ArrowRight size={17} />
      </button>
    </form>
  );
}
