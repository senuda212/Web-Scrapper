import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { Zap } from "lucide-react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import Textarea from "../components/ui/Textarea"
import Toggle from "../components/ui/Toggle"
import FieldRow from "../components/Visual/FieldRow"
import { aiApi, spidersApi } from "../lib/api"

const steps = ["Basic Info", "Visual + AI", "Settings", "Review"]

function buildPreviewCode(form) {
  const lines = form.fields.map((f) => {
    if (f.type === "xpath") {
      return `        item["${f.name}"] = response.xpath("${f.selector}/${f.attr === "text" ? "text()" : "@" + f.attr}").get(default="")`
    }
    if (f.attr === "text") return `        item["${f.name}"] = response.css("${f.selector}::text").get(default="").strip()`
    if (f.attr === "html") return `        item["${f.name}"] = response.css("${f.selector}").get(default="")`
    return `        item["${f.name}"] = response.css("${f.selector}::attr(${f.attr})").get(default="")`
  })
  return `import scrapy

class PreviewSpider(scrapy.Spider):
    name = "${(form.name || "preview").toLowerCase().replace(/\s+/g, "_")}"
    start_urls = ${JSON.stringify(form.start_urls, null, 2)}

    def parse(self, response):
        item = {}
${lines.join("\n") || '        item["raw_text"] = response.text[:500]'}
        yield item`
}

export default function NewSpider() {
  const nav = useNavigate()
  const { id } = useParams()
  const iframeRef = useRef(null)
  const [step, setStep] = useState(0)
  const [activeTab, setActiveTab] = useState("visual")
  const [enableSelect, setEnableSelect] = useState(false)
  const [pageUrl, setPageUrl] = useState("")
  const [html, setHtml] = useState("")
  const [aiKey, setAiKey] = useState("")
  const [aiDescription, setAiDescription] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_urls: [],
    fields: [],
    custom_code: "",
    use_playwright: false,
    follow_links: false,
    follow_link_selector: "",
    max_pages: 100,
    download_delay: 1.0,
    randomize_delay: true,
    rotate_user_agent: true,
    use_proxies: false,
    respect_robots: true,
  })
  const [newUrl, setNewUrl] = useState("")

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const res = await spidersApi.get(id)
        setForm((s) => ({ ...s, ...res.data }))
      } catch {
        toast.error("Failed to load spider")
      }
    })()
  }, [id])

  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type !== "element") return
      setForm((s) => ({
        ...s,
        fields: [...s.fields, { name: `field_${s.fields.length + 1}`, selector: e.data.selector, type: "css", attr: "text" }],
      }))
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  useEffect(() => {
    const frame = iframeRef.current
    if (!frame) return
    const inject = () => {
      if (!enableSelect) return
      try {
        const doc = frame.contentWindow.document
        const previous = doc.__harvesterClickHandler
        if (previous) doc.removeEventListener("click", previous)
        const handler = (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
          const el = ev.target
          if (!el) return
          const tag = (el.tagName || "").toLowerCase()
          const idPart = el.id ? `#${el.id}` : ""
          const classPart = el.classList?.[0] ? `.${el.classList[0]}` : ""
          const selector = `${tag}${idPart}${classPart}` || tag
          window.parent.postMessage({ type: "element", selector }, "*")
        }
        doc.__harvesterClickHandler = handler
        doc.addEventListener("click", handler)
      } catch {
        // Cross-origin should not happen with srcDoc
      }
    }
    frame.addEventListener("load", inject)
    return () => frame.removeEventListener("load", inject)
  }, [enableSelect, html])

  const codePreview = useMemo(() => buildPreviewCode(form), [form])

  const loadPage = async () => {
    if (!pageUrl) return
    try {
      const res = await aiApi.fetchPage(pageUrl)
      setHtml(res.data.html || "")
      toast.success("Page loaded")
    } catch {
      toast.error("Failed to load page")
    }
  }

  const generateSelectors = async () => {
    const url = pageUrl || form.start_urls[0]
    if (!url) {
      toast.error("Provide a URL first")
      return
    }
    try {
      let currentHtml = html
      if (!currentHtml) {
        const fetched = await aiApi.fetchPage(url)
        currentHtml = fetched.data.html || ""
        setHtml(currentHtml)
      }
      const res = await aiApi.generateSelectors({
        url,
        html: currentHtml,
        description: aiDescription || "extract key fields",
        api_key: aiKey || undefined,
      })
      setForm((s) => ({ ...s, fields: res.data.fields || s.fields }))
      toast.success("Selectors suggested")
    } catch {
      toast.error("Selector generation failed")
    }
  }

  const save = async () => {
    try {
      if (id) {
        await spidersApi.update(id, form)
        toast.success("Spider updated")
      } else {
        const res = await spidersApi.create(form)
        toast.success("Spider created")
        nav(`/workspace/spiders/${res.data.id}/edit`)
        return
      }
      nav("/workspace/spiders")
    } catch {
      toast.error("Failed to save spider")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-3 flex items-center gap-2 overflow-auto">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(i)} className={`px-3 py-1.5 rounded-md text-sm ${i === step ? "bg-blue text-white" : "bg-surface text-text-secondary"}`}>
            {i + 1}. {s}
          </button>
        ))}
      </Card>

      {step === 0 && (
        <Card className="p-4 space-y-4">
          <Input label="Spider Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="space-y-2">
            <p className="text-xs uppercase text-text-secondary">Start URLs</p>
            <div className="flex gap-2">
              <Input className="flex-1" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://example.com" />
              <Button variant="green" onClick={() => {
                if (!newUrl) return
                setForm({ ...form, start_urls: [...form.start_urls, newUrl] })
                if (!pageUrl) setPageUrl(newUrl)
                setNewUrl("")
              }}>Add</Button>
            </div>
            <div className="space-y-1">
              {form.start_urls.map((u, idx) => (
                <div key={`${u}-${idx}`} className="flex items-center justify-between bg-surface rounded-md px-3 py-2 border border-border">
                  <span className="text-sm text-text-secondary">{u}</span>
                  <Button variant="red" size="sm" onClick={() => setForm({ ...form, start_urls: form.start_urls.filter((_, i) => i !== idx) })}>X</Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button variant={activeTab === "visual" ? "blue" : "surface"} onClick={() => setActiveTab("visual")}>Visual Builder</Button>
            <Button variant={activeTab === "ai" ? "blue" : "surface"} onClick={() => setActiveTab("ai")}>AI Assistant</Button>
          </div>

          {activeTab === "visual" && (
            <div className="space-y-3">
              <div className="flex gap-2 items-end">
                <Input label="URL" className="flex-1" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} />
                <Button variant="blue" onClick={loadPage}>Load Page</Button>
                <Button variant={enableSelect ? "green" : "surface"} onClick={() => setEnableSelect((v) => !v)}>
                  Select Elements
                </Button>
              </div>
              <iframe
                ref={iframeRef}
                title="preview"
                srcDoc={html}
                className="w-full h-[500px] rounded-lg border border-border bg-white"
                style={{ pointerEvents: enableSelect ? "auto" : "none" }}
              />
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-3">
              <Input label="API Key (optional)" type="password" value={aiKey} onChange={(e) => setAiKey(e.target.value)} placeholder="sk-ant-..." />
              <Textarea label="Describe what to extract" value={aiDescription} onChange={(e) => setAiDescription(e.target.value)} />
              <Input label="URL" value={pageUrl || form.start_urls[0] || ""} onChange={(e) => setPageUrl(e.target.value)} />
              <Button variant="blue" icon={<Zap size={16} />} onClick={generateSelectors}>Generate with AI</Button>
              <p className="text-xs text-text-muted">Current build uses free heuristic generation when no paid AI provider is configured.</p>
            </div>
          )}

          <div className="space-y-2">
            {form.fields.map((f, idx) => (
              <FieldRow
                key={idx}
                field={f}
                onChange={(next) =>
                  setForm((s) => ({ ...s, fields: s.fields.map((row, i) => (i === idx ? next : row)) }))
                }
                onDelete={() => setForm((s) => ({ ...s, fields: s.fields.filter((_, i) => i !== idx) }))}
              />
            ))}
            <Button variant="surface" onClick={() => setForm((s) => ({ ...s, fields: [...s.fields, { name: "", selector: "", type: "css", attr: "text" }] }))}>
              Add Field Manually
            </Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-4 space-y-4">
          <Toggle checked={form.use_playwright} onChange={(v) => setForm({ ...form, use_playwright: v })} label="Use Playwright" description="Required for JavaScript-heavy sites" />
          <Toggle checked={form.follow_links} onChange={(v) => setForm({ ...form, follow_links: v })} label="Follow links" description="Crawl linked pages automatically" />
          {form.follow_links && <Input label="Link selector" value={form.follow_link_selector} onChange={(e) => setForm({ ...form, follow_link_selector: e.target.value })} />}
          <Toggle checked={form.rotate_user_agent} onChange={(v) => setForm({ ...form, rotate_user_agent: v })} label="Rotate User Agents" />
          <Toggle checked={form.randomize_delay} onChange={(v) => setForm({ ...form, randomize_delay: v })} label="Randomize delays" />
          <Toggle checked={form.respect_robots} onChange={(v) => setForm({ ...form, respect_robots: v })} label="Respect robots.txt" />
          <Toggle checked={form.use_proxies} onChange={(v) => setForm({ ...form, use_proxies: v })} label="Use proxies" />
          <div>
            <label className="text-xs text-text-secondary uppercase">Download Delay ({form.download_delay}s)</label>
            <input type="range" min="0.5" max="5" step="0.5" value={form.download_delay} onChange={(e) => setForm({ ...form, download_delay: Number(e.target.value) })} className="w-full" />
          </div>
          <Input type="number" label="Max pages" value={form.max_pages} onChange={(e) => setForm({ ...form, max_pages: Number(e.target.value) })} />
        </Card>
      )}

      {step === 3 && (
        <Card className="p-4 space-y-4">
          <div>
            <h3 className="font-display text-lg">Review Fields</h3>
            <pre className="text-xs text-text-secondary mt-2 whitespace-pre-wrap">{JSON.stringify(form.fields, null, 2)}</pre>
          </div>
          <CodeMirror value={codePreview} extensions={[python()]} theme="dark" editable={false} height="300px" />
          <Button variant="green" onClick={save}>Save Spider</Button>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>Back</Button>
        <Button variant="blue" disabled={step === 3} onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</Button>
      </div>
    </div>
  )
}
