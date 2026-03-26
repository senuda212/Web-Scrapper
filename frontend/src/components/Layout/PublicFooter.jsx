import React from "react"
import { Link } from "react-router-dom"
import { Github, Twitter } from "lucide-react"

export default function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface mt-16">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display font-bold text-text-primary">HARVESTER</p>
          <p className="text-sm text-text-secondary mt-2">Extract the web. Own the data.</p>
          <div className="flex items-center gap-3 mt-3 text-text-secondary">
            <a href="#" className="hover:text-text-primary" aria-label="GitHub"><Github size={16} /></a>
            <a href="#" className="hover:text-text-primary" aria-label="Twitter"><Twitter size={16} /></a>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-text-primary font-medium mb-2">Product</p>
          <div className="flex flex-col gap-2 text-text-secondary">
            <Link to="/" className="hover:text-text-primary">Home</Link>
            <Link to="/about" className="hover:text-text-primary">About</Link>
            <Link to="/pricing" className="hover:text-text-primary">Pricing</Link>
            <Link to="/workspace" className="hover:text-text-primary">Open Workspace</Link>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-text-primary font-medium mb-2">Legal</p>
          <div className="flex flex-col gap-2 text-text-secondary">
            <a href="#" className="hover:text-text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-6 py-4 text-center text-xs text-text-secondary">
        © 2025 Harvester. Built on Scrapy 2.14.2 (BSD-3).
      </div>
    </footer>
  )
}
