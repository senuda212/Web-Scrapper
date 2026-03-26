import React from "react"

export default function Spinner({ size = 20, className = "" }) {
  return (
    <div className={`rounded-full border-2 border-border border-t-blue animate-spin ${className}`} style={{ width: size, height: size }} />
  )
}
