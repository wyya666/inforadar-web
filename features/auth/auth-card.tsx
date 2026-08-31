import { Radar } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="auth-shell">
      <section className="auth-aside" aria-label="InfoRadar 介绍">
        <Link href="/" className="brand auth-brand">
          <span className="brand-mark" aria-hidden="true"><Radar size={20} /></span>
          <span>InfoRadar</span>
        </Link>
        <div>
          <span className="auth-aside-kicker">持续关注，不再错过</span>
          <h2>把互联网的变化，变成你的专属信号。</h2>
          <p>创建雷达后，AI 会持续搜索、判断相关性，并把值得关注的内容整理给你。</p>
        </div>
        <span className="auth-aside-note">JWT 安全会话 · DeepSeek Key 加密保存</span>
      </section>
      <section className="auth-main">
        <div className="auth-card">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>
          {children}
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
