import React, { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import Button from "../ui/Button"

function BrandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2.5" y="3" width="4" height="18" rx="1" fill="var(--green)" />
      <rect x="17.5" y="3" width="4" height="18" rx="1" fill="var(--green)" />
      <path d="M6.5 17.5L17.5 6.5" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default function PublicNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-border/50 bg-[rgba(10,14,26,0.85)] backdrop-blur-[20px]">
      <div className="mx-auto max-w-7xl h-full px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 rounded-md bg-green-muted border border-green/35 grid place-items-center">
            <BrandIcon />
          </div>
          <span className="font-display font-bold tracking-wide">HARVESTER</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {[
            ["/", "Home"],
            ["/about", "About"],
            ["/pricing", "Pricing"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `transition-colors ${isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link to="/workspace">
            <Button variant="ghost" className="border-green text-green hover:bg-green-muted">Open Workspace &rarr;</Button>
          </Link>
        </div>

        <button className="md:hidden p-2 text-text-secondary hover:text-text-primary" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-surface px-5 py-4 animate-fade-in-up">
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/" onClick={() => setOpen(false)} className="text-text-secondary hover:text-text-primary">Home</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="text-text-secondary hover:text-text-primary">About</Link>
            <Link to="/pricing" onClick={() => setOpen(false)} className="text-text-secondary hover:text-text-primary">Pricing</Link>
            <Link to="/workspace" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full border-green text-green hover:bg-green-muted">Open Workspace &rarr;</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
