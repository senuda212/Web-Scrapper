import React, { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Database } from "lucide-react"
import { useNavigate } from "react-router-dom"
import DataTable from "../components/Data/DataTable"
import ExportPanel from "../components/Data/ExportPanel"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Modal from "../components/ui/Modal"
import Select from "../components/ui/Select"
import { crawlsApi, dataApi, exportApi, spidersApi } from "../lib/api"

export default function DataExplorer() {
  const nav = useNavigate()
  const [spiders, setSpiders] = useState([])
  const [crawls, setCrawls] = useState([])
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [spiderId, setSpiderId] = useState("")
  const [crawlJobId, setCrawlJobId] = useState("")
  const [search, setSearch] = useState("")
  const [confirmClear, setConfirmClear] = useState(false)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const load = async () => {
    try {
      const [s, c, d] = await Promise.all([
        spidersApi.list(),
        crawlsApi.list(),
        dataApi.query({ spider_id: spiderId || undefined, crawl_job_id: crawlJobId || undefined, page, page_size: pageSize, search: search || undefined }),
      ])
      setSpiders(s.data)
      setCrawls(c.data)
      setItems(d.data.items || [])
      setTotal(d.data.total || 0)
    } catch {
      toast.error("Failed to load data")
    }
  }

  useEffect(() => {
    load()
  }, [page, pageSize, spiderId, crawlJobId, search])

  const clearData = async () => {
    try {
      if (crawlJobId) {
        await dataApi.deleteCrawl(crawlJobId)
      } else {
        await dataApi.deleteAll()
      }
      toast.success("Data cleared")
      setConfirmClear(false)
      load()
    } catch {
      toast.error("Failed to clear data")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 grid lg:grid-cols-5 gap-3 items-end">
        <Select label="Spider" value={spiderId} onChange={(e) => setSpiderId(e.target.value)} options={[{ label: "All", value: "" }, ...spiders.map((s) => ({ label: s.name, value: s.id }))]} />
        <Select label="Crawl" value={crawlJobId} onChange={(e) => setCrawlJobId(e.target.value)} options={[{ label: "All", value: "" }, ...crawls.map((c) => ({ label: c.id.slice(0, 8), value: c.id }))]} />
        <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find in JSON payload" />
        <Select label="Page Size" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} options={[25, 50, 100]} />
        <Button variant="red" onClick={() => setConfirmClear(true)}>Clear Data</Button>
      </Card>

      {items.length === 0 ? (
        <Card className="py-16 px-6 text-center">
          <Database size={28} className="mx-auto text-text-muted" />
          <p className="mt-3 text-text-secondary">No data yet. Create your first spider to get started.</p>
          <Button className="mt-5" variant="green" onClick={() => nav("/workspace/spiders/new")}>Create First Spider</Button>
        </Card>
      ) : (
        <DataTable items={items} />
      )}

      <div className="flex items-center justify-between">
        <ExportPanel
          onJson={() => window.open(exportApi.json({ spider_id: spiderId, crawl_job_id: crawlJobId }), "_blank")}
          onCsv={() => window.open(exportApi.csv({ spider_id: spiderId, crawl_job_id: crawlJobId }), "_blank")}
          onXlsx={() => window.open(exportApi.xlsx({ spider_id: spiderId, crawl_job_id: crawlJobId }), "_blank")}
        />
        <div className="flex items-center gap-2">
          <Button variant="surface" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span className="text-sm text-text-secondary">Page {page} / {totalPages}</span>
          <Button variant="surface" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="Clear data?" width="max-w-md">
        <p className="text-sm text-text-secondary mb-3">This will remove scraped items {crawlJobId ? "for selected crawl" : "from all crawls"}.</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmClear(false)}>Cancel</Button>
          <Button variant="red" onClick={clearData}>Confirm</Button>
        </div>
      </Modal>
    </div>
  )
}
