import React from "react"
import { Toaster } from "react-hot-toast"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"

export default function AppLayout({ children }) {
  const content = children ?? <Outlet />

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <TopBar />
      <main className="ml-60 pt-14 min-h-screen">
        <div className="p-6 animate-fade-in">{content}</div>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-overlay)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#00d084", secondary: "#0a0e1a" } },
          error: { iconTheme: { primary: "#ff3b5c", secondary: "#0a0e1a" } },
        }}
      />
    </div>
  )
}
