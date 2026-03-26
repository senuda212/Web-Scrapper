import React from "react"

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</label>}
      <input
        className={`w-full px-3 py-2 rounded-md text-sm font-mono bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue ${error ? "border-red" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red">{error}</p>}
    </div>
  )
}
