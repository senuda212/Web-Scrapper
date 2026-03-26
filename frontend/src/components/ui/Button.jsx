import React from "react"

const variants = {
  green: "bg-green text-[#081911] hover:brightness-95",
  red: "bg-red text-white hover:brightness-95",
  blue: "bg-blue text-white hover:bg-[#3d83ff]",
  ghost: "bg-transparent text-text-secondary border border-border hover:border-border-active hover:text-text-primary",
  surface: "bg-elevated text-text-primary border border-border hover:border-border-active",
}

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm font-medium",
}

export default function Button({
  children,
  variant = "surface",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-md font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant] || variants.surface} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}
