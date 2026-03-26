import React from "react"
import Badge from "../ui/Badge"

export default function CrawlCard({ crawl, spiderName, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-3 ${active ? "border-blue bg-blue/10" : "border-border bg-elevated"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium truncate">{spiderName || crawl.spider_id}</p>
        <Badge status={crawl.status}>{crawl.status}</Badge>
      </div>
      <p className="text-xs text-text-muted mt-1">Items: {crawl.items_scraped}</p>
      <p className="text-xs text-text-muted">Started: {crawl.started_at || "-"}</p>
    </button>
  )
}
