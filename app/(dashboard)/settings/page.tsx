import { DeepSeekSettings } from "@/features/settings/deepseek-settings";
import { ProfileSettings } from "@/features/settings/profile-settings";
import { UsageSettings } from "@/features/settings/usage-settings";

export default function SettingsPage() {
  return <main className="dashboard-content"><div className="dashboard-title settings-heading"><div><span>设置</span><h1>账户与服务</h1></div><p>管理个人资料、安全设置、每日摘要和模型凭证。</p></div><div className="settings-stack"><UsageSettings /><DeepSeekSettings /><ProfileSettings /></div></main>;
}
