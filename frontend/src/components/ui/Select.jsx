import React from "react"

export default function Select({ label, options = [], className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">{label}</label>}
      <select
        className={`w-full px-3 py-2 rounded-md text-sm bg-surface border border-border text-text-primary focus:outline-none focus:border-blue ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  )
}
