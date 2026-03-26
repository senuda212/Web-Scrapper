import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Activity, Bug, Database, Waves } from "lucide-react"
import { crawlsApi, dataApi, proxyApi, spidersApi } from "../lib/api"
import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import CountUp from "../components/ui/CountUp"

function StatCard({ icon, label, value, color }) {
  return (
    <Card className="p-4 glass-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md flex items-center justify-center" style={{ background: color }}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-text-muted uppercase">{label}</p>
          <p className="text-2xl font-display"><CountUp end={value} /></p>
        </div>
      </div>
    </Card>
  )
}

export default function Overview() {
  const nav = useNavigate()
  const [spiders, setSpiders] = useState([])
  const [crawls, setCrawls] = useState([])
  const [dataTotal, setDataTotal] = useState(0)

  const spiderById = useMemo(() => Object.fromEntries(spiders.map((s) => [s.id, s])), [spiders])

  useEffect(() => {
    ;(async () => {
      try {
        const [s, c, d] = await Promise.all([
          spidersApi.list(),
          crawlsApi.list(),
          dataApi.query({ page: 1, page_size: 1 }),
        ])
        setSpiders(s.data)
        setCrawls(c.data)
        setDataTotal(d.data.total || 0)
      } catch {
        toast.error("Failed to load overview")
      }
    })()
  }, [])

  const activeCount = crawls.filter((c) => c.status === "running").length
  const recent = crawls.slice(0, 10)

  const importProxies = async () => {
    try {
      const res = await proxyApi.importFree()
      toast.success(`Added ${res.data.added} proxies`)
    } catch {
      toast.error("Failed to import free proxies")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Bug size={18} />} label="Total Spiders" value={spiders.length} color="linear-gradient(135deg, #1a1f24, #0f151b)" />
        <StatCard icon={<Activity size={18} />} label="Crawl Jobs" value={crawls.length} color="linear-gradient(135deg, #172129, #11181f)" />
        <StatCard icon={<Database size={18} />} label="Items Scraped" value={dataTotal} color="linear-gradient(135deg, #2a3540, #1a1f24)" />
        <StatCard icon={<Waves size={18} />} label="Active Crawls" value={activeCount} color="linear-gradient(135deg, #0d5c4a, #0a3d35)" />
      </div>

      <Card className="p-4 glass-card">
        <h2 className="font-display text-lg mb-3">Recent Crawls</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-text-secondary">
              <tr>
                <th className="text-left py-2">Spider</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Items</th>
                <th className="text-left py-2">Started</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2">{spiderById[r.spider_id]?.name || r.spider_id}</td>
                  <td className="py-2"><Badge status={r.status}>{r.status}</Badge></td>
                  <td className="py-2">{r.items_scraped}</td>
                  <td className="py-2">{r.started_at || "-"}</td>
                  <td className="py-2"><Button size="sm" variant="blue" onClick={() => nav("/workspace/crawls")}>View</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 cursor-pointer hover:border-[#365064] border-border" onClick={() => nav("/workspace/spiders/new")}>
          <p className="text-text-primary font-display text-lg">Create Spider</p>
          <p className="text-text-secondary mt-1">Launch the visual builder</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:border-[#365064] border-border" onClick={importProxies}>
          <p className="text-text-primary font-display text-lg">Import Free Proxies</p>
          <p className="text-text-secondary mt-1">Load public HTTP proxies</p>
        </Card>
        <Card className="p-4 cursor-pointer hover:border-green border-border" onClick={() => nav("/workspace/data")}>
          <p className="text-green font-display text-lg">View Data</p>
          <p className="text-text-secondary mt-1">Explore scraped datasets</p>
        </Card>
      </div>
    </div>
  )
}
