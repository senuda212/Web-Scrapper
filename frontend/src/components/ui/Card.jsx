import React from "react"

export default function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-elevated border border-border rounded-lg ${className}`} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }} {...props}>
      {children}
    </div>
  )
}
