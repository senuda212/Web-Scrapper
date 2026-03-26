import React, { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Database, Eye, Table2 } from "lucide-react"
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
  const [compactMode, setCompactMode] = useState(false)
  const [hiddenColumns, setHiddenColumns] = useState({})
  const [sortBy, setSortBy] = useState("scraped_at")
  const [sortDirection, setSortDirection] = useState("desc")

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const dataColumns = useMemo(() => {
    const set = new Set()
    for (const row of items) {
      Object.keys(row?.data || {}).forEach((k) => set.add(k))
    }
    return [...set]
  }, [items])

  const columns = useMemo(() => ["url", ...dataColumns, "scraped_at"], [dataColumns])

  const visibleColumns = useMemo(
    () => columns.filter((k) => !hiddenColumns[k]),
    [columns, hiddenColumns]
  )

  const sortedItems = useMemo(() => {
    const getValue = (row, key) => {
      if (key === "url") return row.url || ""
      if (key === "scraped_at") return row.scraped_at || ""
      return row.data?.[key] ?? ""
    }
    const copied = [...items]
    copied.sort((a, b) => {
      const av = getValue(a, sortBy)
      const bv = getValue(b, sortBy)
      if (sortBy === "scraped_at") {
        const at = av ? new Date(av).getTime() : 0
        const bt = bv ? new Date(bv).getTime() : 0
        return sortDirection === "asc" ? at - bt : bt - at
      }
      const left = String(av).toLowerCase()
      const right = String(bv).toLowerCase()
      if (left < right) return sortDirection === "asc" ? -1 : 1
      if (left > right) return sortDirection === "asc" ? 1 : -1
      return 0
    })
    return copied
  }, [items, sortBy, sortDirection])

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

  const toggleColumn = (key) => {
    setHiddenColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSort = (key) => {
    if (sortBy !== key) {
      setSortBy(key)
      setSortDirection("asc")
      return
    }
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <Card className="p-3">
          <p className="text-xs text-text-muted">Total Rows</p>
          <p className="text-xl font-display">{total}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-text-muted">Visible Columns</p>
          <p className="text-xl font-display">{visibleColumns.length}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-text-muted">Current Page Rows</p>
          <p className="text-xl font-display">{items.length}</p>
        </Card>
      </div>

      <Card className="p-4 grid lg:grid-cols-5 gap-3 items-end">
        <Select label="Spider" value={spiderId} onChange={(e) => setSpiderId(e.target.value)} options={[{ label: "All", value: "" }, ...spiders.map((s) => ({ label: s.name, value: s.id }))]} />
        <Select label="Crawl" value={crawlJobId} onChange={(e) => setCrawlJobId(e.target.value)} options={[{ label: "All", value: "" }, ...crawls.map((c) => ({ label: c.id.slice(0, 8), value: c.id }))]} />
        <Input label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find in JSON payload" />
        <Select label="Page Size" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} options={[25, 50, 100]} />
        <Button variant="red" onClick={() => setConfirmClear(true)}>Clear Data</Button>
      </Card>

      {items.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <Eye size={15} />
              Choose visible columns and sort order
            </div>
            <Button
              variant="surface"
              size="sm"
              icon={<Table2 size={14} />}
              onClick={() => setCompactMode((v) => !v)}
            >
              {compactMode ? "Comfortable View" : "Spreadsheet View"}
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <Select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={columns.map((c) => ({ label: c.replace(/_/g, " "), value: c }))}
            />
            <Select
              label="Sort Direction"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              options={[
                { label: "Ascending", value: "asc" },
                { label: "Descending", value: "desc" },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-text-secondary">
            {columns.map((key) => (
              <label key={key} className="inline-flex items-center gap-2 px-2 py-1 rounded border border-border bg-surface/70">
                <input
                  type="checkbox"
                  checked={!hiddenColumns[key]}
                  onChange={() => toggleColumn(key)}
                />
                {key.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </Card>
      )}

      {items.length === 0 ? (
        <Card className="py-16 px-6 text-center">
          <Database size={28} className="mx-auto text-text-muted" />
          <p className="mt-3 text-text-secondary">No data yet. Create your first spider to get started.</p>
          <Button className="mt-5" variant="green" onClick={() => nav("/workspace/spiders/new")}>Create First Spider</Button>
        </Card>
      ) : (
        <DataTable
          items={sortedItems}
          columns={visibleColumns}
          compact={compactMode}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
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
