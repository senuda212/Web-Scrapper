import React from "react"
import * as Switch from "@radix-ui/react-switch"

export default function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && <p className="text-sm font-medium text-text-primary">{label}</p>}
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
      <Switch.Root checked={checked} onCheckedChange={onChange} className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${checked ? "bg-green" : "bg-border-active"}`}>
        <Switch.Thumb className={`block w-4 h-4 rounded-full bg-white shadow transition-transform duration-150 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </Switch.Root>
    </div>
  )
}
