import React from "react"
import Card from "../ui/Card"
import CountUp from "../ui/CountUp"

function Stat({ label, value }) {
  return (
    <Card className="p-3">
      <p className="text-text-muted text-xs uppercase tracking-wide">{label}</p>
      <p className="text-xl font-display mt-1"><CountUp end={Number(value) || 0} /></p>
    </Card>
  )
}

export default function CrawlStats({ job }) {
  const duration = job?.started_at
    ? Math.max(
        0,
        Math.floor(
          ((job?.finished_at ? new Date(job.finished_at) : new Date()) - new Date(job.started_at)) / 1000
        )
      )
    : 0
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Stat label="Items" value={job?.items_scraped ?? 0} />
      <Stat label="Pages" value={job?.pages_crawled ?? 0} />
      <Stat label="Errors" value={job?.errors ?? 0} />
      <Stat label="Duration (s)" value={duration} />
    </div>
  )
}
