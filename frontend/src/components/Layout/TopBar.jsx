import React from "react"
import { useLocation, useNavigate } from "react-router-dom"

const TITLES = {
  "/workspace": "Overview",
  "/workspace/spiders": "Spiders",
  "/workspace/crawls": "Crawl Monitor",
  "/workspace/data": "Data Explorer",
  "/workspace/scheduler": "Scheduler",
  "/workspace/proxies": "Proxies",
  "/workspace/settings": "Settings",
}

export default function TopBar() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const title =
    TITLES[pathname] ||
    (pathname.startsWith("/workspace/spiders") ? "Spiders" :
    pathname.startsWith("/workspace/crawls") ? "Crawl Monitor" :
    pathname.startsWith("/workspace/data") ? "Data Explorer" :
    pathname.startsWith("/workspace/scheduler") ? "Scheduler" :
    pathname.startsWith("/workspace/proxies") ? "Proxies" :
    pathname.startsWith("/workspace/settings") ? "Settings" : "Harvester")
  return (
    <header className="fixed top-0 left-60 right-0 h-14 flex items-center px-6 border-b border-border z-30" style={{ background: "linear-gradient(90deg, #0a0e1a 0%, #0d1730 60%, #122140 100%)" }}>
      <h1 className="font-display text-lg font-semibold text-text-primary">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => nav("/")}
          className="h-8 px-3 rounded-md border border-green text-green hover:bg-green-muted transition-colors text-xs font-semibold"
        >
          Site
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border">
          <span className="status-dot finished" />
          <span className="text-xs font-mono text-green">API Online</span>
        </div>
      </div>
    </header>
  )
}
