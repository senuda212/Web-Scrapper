import React, { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Activity } from "lucide-react"
import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import CrawlCard from "../components/Crawl/CrawlCard"
import CrawlStats from "../components/Crawl/CrawlStats"
import LiveLog from "../components/Crawl/LiveLog"
import { crawlsApi, spidersApi } from "../lib/api"
import { createCrawlWebSocket } from "../lib/ws"

export default function CrawlMonitor() {
  const [spiders, setSpiders] = useState([])
  const [crawls, setCrawls] = useState([])
  const [selected, setSelected] = useState(null)
  const [logs, setLogs] = useState([])
  const wsRef = useRef(null)

  const spiderById = useMemo(() => Object.fromEntries(spiders.map((s) => [s.id, s])), [spiders])

  const load = async () => {
    try {
      const [s, c] = await Promise.all([spidersApi.list(), crawlsApi.list()])
      setSpiders(s.data)
      setCrawls(c.data)
      if (!selected && c.data[0]) {
        setSelected(c.data[0])
      } else if (selected) {
        const fresh = c.data.find((job) => job.id === selected.id)
        if (fresh) setSelected(fresh)
      }
    } catch {
      // Keep UI usable if a periodic poll fails once.
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      load()
    }, 2500)
    return () => clearInterval(timer)
  }, [selected?.id])

  useEffect(() => {
    if (!selected?.id) return
    setLogs(selected.log ? selected.log.split("\n") : [])
    if (wsRef.current) wsRef.current.close()
    wsRef.current = createCrawlWebSocket(selected.id, {
      onLog: (line) => setLogs((s) => [...s.slice(-500), line]),
      onStatus: (status) => {
        setSelected((s) => (s ? { ...s, status } : s))
        setCrawls((rows) => rows.map((row) => (row.id === selected.id ? { ...row, status } : row)))
        if (status !== "running") {
          setTimeout(() => {
            load()
          }, 600)
        }
      },
      onError: () => {
        // Polling fallback handles transient socket failures.
      },
    })
    return () => wsRef.current?.close()
  }, [selected?.id])

  const startNew = async (spiderId) => {
    try {
      await crawlsApi.start(spiderId)
      toast.success("Crawl started")
      load()
    } catch {
      toast.error("Failed to start crawl")
    }
  }

  const stop = async () => {
    if (!selected) return
    try {
      await crawlsApi.stop(selected.id)
      toast.success("Stop signal sent")
      setSelected({ ...selected, status: "stopped" })
    } catch {
      toast.error("Failed to stop")
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl">Crawl Monitor</h2>
      <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-4 h-[calc(100vh-160px)]">
      <Card className="p-3 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center gap-2">
          <select className="bg-surface border border-border rounded-md px-2 py-1 flex-1" onChange={(e) => e.target.value && startNew(e.target.value)} defaultValue="">
            <option value="">Start New Crawl</option>
            {spiders.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="overflow-auto space-y-2 pr-1">
          {crawls.length === 0 ? (
            <div className="h-full min-h-40 flex flex-col items-center justify-center text-center px-4">
              <Activity size={26} className="text-text-muted" />
              <p className="text-text-secondary mt-3">No crawls yet. Start your first crawl to get started.</p>
            </div>
          ) : (
            crawls.map((crawl) => (
              <CrawlCard
                key={crawl.id}
                crawl={crawl}
                spiderName={spiderById[crawl.spider_id]?.name}
                active={selected?.id === crawl.id}
                onClick={() => setSelected(crawl)}
              />
            ))
          )}
        </div>
      </Card>

      <Card className="p-4 flex flex-col gap-4 overflow-hidden">
        {selected ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl">{spiderById[selected.spider_id]?.name || selected.spider_id}</h2>
                <Badge status={selected.status}>{selected.status}</Badge>
              </div>
              {selected.status === "running" ? (
                <Button variant="red" onClick={stop}>Stop</Button>
              ) : (
                <Button variant="green" onClick={() => startNew(selected.spider_id)}>Re-run</Button>
              )}
            </div>
            <CrawlStats job={selected} />
            <LiveLog lines={logs} />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Activity size={28} className="text-text-muted" />
            <p className="text-text-secondary mt-3">No crawls yet. Start your first one to get started.</p>
            <Button className="mt-4" variant="green" onClick={() => document.querySelector("select")?.focus()}>Start a Crawl</Button>
          </div>
        )}
      </Card>
      </div>
    </div>
  )
}
