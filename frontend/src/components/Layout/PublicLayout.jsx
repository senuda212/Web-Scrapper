import React from "react"
import { Outlet } from "react-router-dom"
import PublicFooter from "./PublicFooter"
import PublicNav from "./PublicNav"

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-base text-text-primary">
      <PublicNav />
      <main className="pt-16">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
