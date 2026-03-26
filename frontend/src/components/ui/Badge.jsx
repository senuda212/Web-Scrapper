import React from "react"

const colors = {
  running: "bg-green/10 text-green border-green/20",
  finished: "bg-green/10 text-green border-green/20",
  error: "bg-red/10 text-red border-red/20",
  stopped: "bg-gray-500/10 text-text-muted border-gray-500/20",
  pending: "bg-yellow/10 text-yellow border-yellow/20",
  default: "bg-elevated text-text-secondary border-border",
}

export default function Badge({ status, children, className = "" }) {
  const color = colors[status] || colors.default
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${color} ${className}`}>
      {status && <span className={`status-dot ${status}`} />}
      {children || status}
    </span>
  )
}
