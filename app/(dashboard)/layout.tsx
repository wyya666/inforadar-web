import { Gauge, Inbox, Radar, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { SessionSummary } from "@/features/auth/session-summary";

const navigation = [
  { href: "/dashboard", label: "概览", icon: Gauge },
  { href: "/radars", label: "我的雷达", icon: Radar },
  { href: "/results", label: "结果", icon: Inbox },
  { href: "/settings", label: "设置", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="brand dashboard-brand" href="/dashboard"><span className="brand-mark"><Radar size={20} /></span><span>InfoRadar</span></Link>
        <nav aria-label="应用导航">
          {navigation.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={18} />{label}</Link>)}
        </nav>
        <div className="sidebar-foot"><SessionSummary /></div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-header"><span><Sparkles size={16} />AI 信息雷达</span><Link className="button button-dark" href="/radars/new">创建雷达</Link></header>
        {children}
      </div>
    </div>
  );
}
