import React, { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Modal from "../components/ui/Modal"
import Select from "../components/ui/Select"
import Toggle from "../components/ui/Toggle"
import { schedulerApi, spidersApi } from "../lib/api"

export default function Scheduler() {
  const [spiders, setSpiders] = useState([])
  const [jobs, setJobs] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ spider_id: "", cron_expression: "0 * * * *", enabled: true })

  const spiderById = useMemo(() => Object.fromEntries(spiders.map((s) => [s.id, s.name])), [spiders])

  const load = async () => {
    try {
      const [s, j] = await Promise.all([spidersApi.list(), schedulerApi.list()])
      setSpiders(s.data)
      setJobs(j.data)
    } catch {
      toast.error("Failed to load scheduler")
    }
  }

  useEffect(() => {
    load()
  }, [])

  const add = async () => {
    try {
      await schedulerApi.create(form)
      toast.success("Schedule created")
      setOpen(false)
      setForm({ spider_id: "", cron_expression: "0 * * * *", enabled: true })
      load()
    } catch {
      toast.error("Failed to create schedule")
    }
  }

  const remove = async (id) => {
    try {
      await schedulerApi.delete(id)
      toast.success("Schedule removed")
      load()
    } catch {
      toast.error("Failed to remove schedule")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="green" onClick={() => setOpen(true)}>Add Schedule</Button>
      </div>
      <Card className="p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-text-secondary">
            <tr>
              <th className="text-left py-2">Spider</th>
              <th className="text-left py-2">Cron</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Last Run</th>
              <th className="text-left py-2">Next Run</th>
              <th className="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-border">
                <td className="py-2">{spiderById[j.spider_id] || j.spider_id}</td>
                <td className="py-2 mono">{j.cron_expression}</td>
                <td className="py-2">{j.enabled ? "enabled" : "disabled"}</td>
                <td className="py-2">{j.last_run || "-"}</td>
                <td className="py-2">{j.next_run || "-"}</td>
                <td className="py-2"><Button variant="red" size="sm" onClick={() => remove(j.id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Schedule" width="max-w-lg">
        <div className="space-y-3">
          <Select
            label="Spider"
            value={form.spider_id}
            onChange={(e) => setForm((s) => ({ ...s, spider_id: e.target.value }))}
            options={[{ label: "Select spider", value: "" }, ...spiders.map((s) => ({ label: s.name, value: s.id }))]}
          />
          <Input label="Cron expression" value={form.cron_expression} onChange={(e) => setForm((s) => ({ ...s, cron_expression: e.target.value }))} />
          <p className="text-xs text-text-muted">Examples: 0 * * * * = every hour</p>
          <Toggle checked={form.enabled} onChange={(v) => setForm((s) => ({ ...s, enabled: v }))} label="Enabled" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="green" onClick={add}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
