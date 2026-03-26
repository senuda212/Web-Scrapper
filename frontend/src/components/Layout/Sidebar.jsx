import React from "react"
import { Link, NavLink } from "react-router-dom"
import { Calendar, Database, LayoutDashboard, Play, Settings, Shield, Bug, Zap } from "lucide-react"

const NAV = [
  { to: "/workspace", icon: LayoutDashboard, label: "Workspace" },
  { to: "/workspace/spiders", icon: Bug, label: "Spiders" },
  { to: "/workspace/crawls", icon: Play, label: "Crawl Monitor" },
  { to: "/workspace/data", icon: Database, label: "Data Explorer" },
  { to: "/workspace/scheduler", icon: Calendar, label: "Scheduler" },
  { to: "/workspace/proxies", icon: Shield, label: "Proxies" },
  { to: "/workspace/settings", icon: Settings, label: "Settings" },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col border-r border-border z-40" style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f1629 42%, #151d35 100%)" }}>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #00c9a0, #0d5c4a)" }}>
          <Zap size={16} color="#ffffff" />
        </div>
        <div>
          <p className="font-display font-bold text-text-primary text-base leading-none">HARVESTER</p>
          <p className="text-xs text-text-muted mt-0.5 font-mono">v1.0.0</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <Link to="/" className="text-xs text-text-muted hover:text-text-primary px-2 inline-block mb-3">← Back to site</Link>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest px-2 mb-3">Navigation</p>
        <div className="flex flex-col gap-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/workspace"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-[#0a3d35]/35 text-white border border-border"
                    : "text-text-secondary hover:text-text-primary hover:bg-elevated border border-transparent"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-text-muted font-mono">Powered by Scrapy 2.14.2</p>
        <p className="text-xs text-text-muted">BSD-3 License</p>
      </div>
    </aside>
  )
}
