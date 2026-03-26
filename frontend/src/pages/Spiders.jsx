import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Bug } from "lucide-react"
import Modal from "../components/ui/Modal"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import SpiderCard from "../components/Spider/SpiderCard"
import { crawlsApi, spidersApi } from "../lib/api"

export default function Spiders() {
  const nav = useNavigate()
  const [spiders, setSpiders] = useState([])
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    try {
      const res = await spidersApi.list()
      setSpiders(res.data)
    } catch {
      toast.error("Failed to load spiders")
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(
    () => spiders.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())),
    [spiders, search]
  )

  const runSpider = async (id) => {
    try {
      await crawlsApi.start(id)
      toast.success("Crawl started")
      nav("/workspace/crawls")
    } catch {
      toast.error("Failed to start crawl")
    }
  }

  const deleteSpider = async () => {
    if (!deleting) return
    try {
      await spidersApi.delete(deleting.id)
      toast.success("Spider deleted")
      setDeleting(null)
      load()
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="w-full max-w-md">
          <Input label="Search" placeholder="Filter by spider name" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="green" onClick={() => nav("/workspace/spiders/new")}>New Spider</Button>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-border rounded-lg bg-elevated py-16 px-6 text-center">
          <Bug size={28} className="mx-auto text-text-muted" />
          <p className="mt-3 text-text-secondary">No spiders yet. Create your first one to get started.</p>
          <Button className="mt-5" variant="green" onClick={() => nav("/workspace/spiders/new")}>Create First Spider</Button>
        </div>
      ) : (
        <div className="grid xl:grid-cols-2 gap-4">
          {filtered.map((spider) => (
            <SpiderCard
              key={spider.id}
              spider={spider}
              onRun={() => runSpider(spider.id)}
              onEdit={() => nav(`/workspace/spiders/${spider.id}/edit`)}
              onDelete={() => setDeleting(spider)}
            />
          ))}
        </div>
      )}

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete spider?" width="max-w-md">
        <p className="text-text-secondary mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="red" onClick={deleteSpider}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
