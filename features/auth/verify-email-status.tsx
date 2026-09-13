"use client";

import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { verifyEmail } from "./api";

type VerificationState = "loading" | "success" | "error" | "missing";

export function VerifyEmailStatus({ token }: { token?: string }) {
  const [state, setState] = useState<VerificationState>(token ? "loading" : "missing");

  useEffect(() => {
    if (!token) return;
    let active = true;
    void verifyEmail(token)
      .then(() => { if (active) setState("success"); })
      .catch(() => { if (active) setState("error"); });
    return () => { active = false; };
  }, [token]);

  const content = {
    loading: { icon: <LoaderCircle className="spin" />, title: "正在验证邮箱", text: "请稍候，我们正在确认这次验证请求。" },
    success: { icon: <CheckCircle2 />, title: "邮箱记录已确认", text: "现在可以登录并创建第一个雷达；新账号无需执行这一步。" },
    error: { icon: <AlertCircle />, title: "验证链接无效", text: "链接可能已过期或已经使用，请重新注册或联系支持。" },
    missing: { icon: <AlertCircle />, title: "缺少验证信息", text: "请从验证邮件中打开完整链接。" },
  }[state];

  return (
    <div className={`verification-state verification-${state}`} role="status">
      {content.icon}
      <h2>{content.title}</h2>
      <p>{content.text}</p>
      {state !== "loading" ? <Link className="button button-dark auth-submit" href="/login">前往登录</Link> : null}
    </div>
  );
}
