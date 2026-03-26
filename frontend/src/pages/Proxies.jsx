import React, { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import Badge from "../components/ui/Badge"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Modal from "../components/ui/Modal"
import Select from "../components/ui/Select"
import CountUp from "../components/ui/CountUp"
import { proxyApi } from "../lib/api"

export default function Proxies() {
  const [proxies, setProxies] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ url: "", protocol: "http", country: "" })
  const [importing, setImporting] = useState(false)

  const load = async () => {
    try {
      const res = await proxyApi.list()
      setProxies(res.data)
    } catch {
      toast.error("Failed to load proxies")
    }
  }

  useEffect(() => {
    load()
  }, [])

  const stats = useMemo(() => {
    const active = proxies.filter((p) => p.is_active).length
    const failed = proxies.filter((p) => !p.is_active).length
    return { total: proxies.length, active, failed }
  }, [proxies])

  const importFree = async () => {
    setImporting(true)
    try {
      const res = await proxyApi.importFree()
      toast.success(`Added ${res.data.added} proxies`)
      load()
    } catch {
      toast.error("Import failed")
    } finally {
      setImporting(false)
    }
  }

  const addManual = async () => {
    try {
      await proxyApi.add(form)
      toast.success("Proxy added")
      setOpen(false)
      setForm({ url: "", protocol: "http", country: "" })
      load()
    } catch {
      toast.error("Failed to add proxy")
    }
  }

  const testOne = async (id) => {
    try {
      await proxyApi.test(id)
      toast.success("Proxy tested")
      load()
    } catch {
      toast.error("Test failed")
    }
  }

  const testAll = async () => {
    for (const p of proxies) {
      try {
        await proxyApi.test(p.id)
      } catch {
        // Continue with next
      }
    }
    toast.success("Finished testing proxies")
    load()
  }

  const remove = async (id) => {
    try {
      await proxyApi.delete(id)
      toast.success("Deleted")
      load()
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-3">
        <Card className="p-3"><p className="text-xs text-text-muted">Total</p><p className="text-xl font-display"><CountUp end={stats.total} /></p></Card>
        <Card className="p-3"><p className="text-xs text-text-muted">Active</p><p className="text-xl font-display text-green"><CountUp end={stats.active} /></p></Card>
        <Card className="p-3"><p className="text-xs text-text-muted">Failed</p><p className="text-xl font-display text-red"><CountUp end={stats.failed} /></p></Card>
      </div>

      <div className="flex gap-2">
        <Button variant="green" loading={importing} onClick={importFree}>Import Free Proxies</Button>
        <Button variant="surface" onClick={() => setOpen(true)}>Add Proxy Manually</Button>
        <Button variant="blue" onClick={testAll}>Test All</Button>
      </div>

      <Card className="p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-text-secondary">
            <tr>
              <th className="text-left py-2">URL</th>
              <th className="text-left py-2">Protocol</th>
              <th className="text-left py-2">Country</th>
              <th className="text-left py-2">Success/Fail</th>
              <th className="text-left py-2">Last Checked</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proxies.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="py-2 mono">{p.url}</td>
                <td className="py-2">{p.protocol}</td>
                <td className="py-2">{p.country || "-"}</td>
                <td className="py-2">{p.success_count}/{p.fail_count}</td>
                <td className="py-2">{p.last_checked || "-"}</td>
                <td className="py-2"><Badge status={p.is_active ? "running" : "error"}>{p.is_active ? "active" : "failed"}</Badge></td>
                <td className="py-2 flex gap-2">
                  <Button size="sm" variant="blue" onClick={() => testOne(p.id)}>Test</Button>
                  <Button size="sm" variant="red" onClick={() => remove(p.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Proxy" width="max-w-lg">
        <div className="space-y-3">
          <Input label="URL" placeholder="http://host:port" value={form.url} onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))} />
          <Select label="Protocol" value={form.protocol} onChange={(e) => setForm((s) => ({ ...s, protocol: e.target.value }))} options={["http", "https", "socks5"]} />
          <Input label="Country" value={form.country} onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="green" onClick={addManual}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
