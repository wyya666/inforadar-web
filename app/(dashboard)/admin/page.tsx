import { UserManagement } from "@/features/admin/user-management";
import { FailedScans } from "@/features/admin/failed-scans";
import { PlatformDashboard } from "@/features/admin/platform-dashboard";

export default function AdminPage() {
  return <main className="dashboard-content"><div className="dashboard-title settings-heading"><div><span>管理员</span><h1>平台控制台</h1></div><p>管理用户额度、失败扫描与平台预算；所有写操作都会进入审计记录。</p></div><div className="settings-stack"><PlatformDashboard /><UserManagement /><FailedScans /></div></main>;
}
