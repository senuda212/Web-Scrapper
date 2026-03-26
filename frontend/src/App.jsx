import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppLayout from "./components/Layout/AppLayout"
import PublicLayout from "./components/Layout/PublicLayout"
import CrawlMonitor from "./pages/CrawlMonitor"
import DataExplorer from "./pages/DataExplorer"
import NewSpider from "./pages/NewSpider"
import Overview from "./pages/Overview"
import Proxies from "./pages/Proxies"
import Scheduler from "./pages/Scheduler"
import Settings from "./pages/Settings"
import Spiders from "./pages/Spiders"
import About from "./pages/public/About"
import Home from "./pages/public/Home"
import Pricing from "./pages/public/Pricing"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/workspace" element={<Overview />} />
          <Route path="/workspace/spiders" element={<Spiders />} />
          <Route path="/workspace/spiders/new" element={<NewSpider />} />
          <Route path="/workspace/spiders/:id/edit" element={<NewSpider />} />
          <Route path="/workspace/crawls" element={<CrawlMonitor />} />
          <Route path="/workspace/data" element={<DataExplorer />} />
          <Route path="/workspace/scheduler" element={<Scheduler />} />
          <Route path="/workspace/proxies" element={<Proxies />} />
          <Route path="/workspace/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
