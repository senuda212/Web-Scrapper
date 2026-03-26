import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Toggle from "../components/ui/Toggle"
import { dataApi, exportApi, settingsApi } from "../lib/api"

export default function Settings() {
  const [state, setState] = useState({
    anthropic_api_key: "",
    model: "claude-sonnet-4-20250514",
    default_download_delay: "1.0",
    default_max_pages: "100",
    default_rotate_user_agents: "true",
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await settingsApi.getAll()
        setState((s) => ({ ...s, ...res.data }))
      } catch {
        toast.error("Failed to load settings")
      }
    })()
  }, [])

  const save = async (key) => {
    try {
      await settingsApi.set(key, String(state[key] ?? ""))
      toast.success("Saved")
    } catch {
      toast.error("Save failed")
    }
  }

  const clearAllData = async () => {
    try {
      await dataApi.deleteAll()
      toast.success("All scraped data cleared")
    } catch {
      toast.error("Failed to clear data")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <h3 className="font-display text-lg">AI Configuration</h3>
        <Input label="Anthropic API Key" type="password" value={state.anthropic_api_key} onChange={(e) => setState((s) => ({ ...s, anthropic_api_key: e.target.value }))} />
        <Button variant="green" onClick={() => save("anthropic_api_key")}>Save API Key</Button>
        <p className="text-xs text-text-secondary">Your API key enables AI-powered spider generation. Get one free at console.anthropic.com</p>
        <Input label="Model" value={state.model} onChange={(e) => setState((s) => ({ ...s, model: e.target.value }))} />
        <Button variant="blue" onClick={() => save("model")}>Save Model</Button>
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-display text-lg">Scraping Defaults</h3>
        <Input label="Default download delay" value={state.default_download_delay} onChange={(e) => setState((s) => ({ ...s, default_download_delay: e.target.value }))} />
        <Button variant="blue" onClick={() => save("default_download_delay")}>Save Delay</Button>
        <Input label="Default max pages" value={state.default_max_pages} onChange={(e) => setState((s) => ({ ...s, default_max_pages: e.target.value }))} />
        <Button variant="blue" onClick={() => save("default_max_pages")}>Save Max Pages</Button>
        <Toggle
          checked={String(state.default_rotate_user_agents) === "true"}
          onChange={(v) => setState((s) => ({ ...s, default_rotate_user_agents: String(v) }))}
          label="Default rotate user agents"
        />
        <Button variant="blue" onClick={() => save("default_rotate_user_agents")}>Save Toggle</Button>
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-display text-lg">Data Management</h3>
        <div className="flex gap-2">
          <Button variant="red" onClick={clearAllData}>Clear All Scraped Data</Button>
          <Button variant="blue" onClick={() => window.open(exportApi.json({}), "_blank")}>Export All JSON</Button>
          <Button variant="blue" onClick={() => window.open(exportApi.csv({}), "_blank")}>Export All CSV</Button>
        </div>
        <Input label="SQLite DB path" readOnly value="harvester/backend/harvester.db" />
      </Card>

      <Card className="p-4 space-y-1">
        <h3 className="font-display text-lg">About</h3>
        <p className="text-sm text-text-secondary">Harvester version: 1.0.0</p>
        <p className="text-sm text-text-secondary">Scrapy version: 2.14.2</p>
        <p className="text-sm text-text-secondary">Licenses: BSD-3 (Scrapy), MIT (Harvester UI)</p>
      </Card>
    </div>
  )
}
