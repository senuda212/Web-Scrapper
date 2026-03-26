import React from "react"
import { Link } from "react-router-dom"
import {
  Activity,
  Calendar,
  Check,
  ChevronRight,
  CircleCheck,
  Download,
  MousePointerClick,
  Shield,
  Sparkles,
} from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import CountUp from "../../components/ui/CountUp"

const features = [
  {
    icon: MousePointerClick,
    title: "Click to select",
    desc: "Point and click on any element. Harvester generates the selector automatically.",
    accent: "border-l-2 border-l-green",
  },
  {
    icon: Sparkles,
    title: "AI writes your spider",
    desc: "Paste a URL and describe what you want. Claude generates a complete scraper.",
    accent: "border-l-2 border-l-accent-blue",
  },
  {
    icon: Shield,
    title: "Bypass detection",
    desc: "Rotating user agents, randomised delays, and browser fingerprint spoofing built in.",
    accent: "border-l-2 border-l-yellow",
  },
  {
    icon: Activity,
    title: "Watch it live",
    desc: "WebSocket-powered live logs. See every request, item, and error as it happens.",
    accent: "border-l-2 border-l-green",
  },
  {
    icon: Calendar,
    title: "Set and forget",
    desc: "Full cron expression scheduling. Run daily, hourly, or on any custom interval.",
    accent: "border-l-2 border-l-accent-blue",
  },
  {
    icon: Download,
    title: "Your data, your format",
    desc: "Export to JSON, CSV, or XLSX. Webhooks coming soon for direct pipeline integration.",
    accent: "border-l-2 border-l-yellow",
  },
]

const checks = ["No credit card", "Free forever tier", "Open source"]

export default function Home() {
  return (
    <div>
      <section className="min-h-[100vh] relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,208,132,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,45,80,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,45,80,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_48%,transparent_88%)]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center rounded-full bg-surface border border-border px-4 py-1.5 text-xs text-text-secondary border-l-4 border-l-green">
            Powered by Scrapy 2.14.2
          </div>

          <h1 className="mt-6 font-display text-[40px] md:text-[72px] leading-[1.1] font-bold">
            <span className="animate-fade-in-up stagger-1 inline-block">Extract </span>
            <span className="animate-fade-in-up stagger-2 inline-block text-green">any </span>
            <span className="animate-fade-in-up stagger-3 inline-block">data.</span>
            <br />
            <span className="animate-fade-in-up stagger-2 inline-block">From </span>
            <span className="animate-fade-in-up stagger-3 inline-block text-green">any </span>
            <span className="animate-fade-in-up stagger-4 inline-block">website.</span>
            <br />
            <span className="animate-fade-in-up stagger-4 inline-block">Instantly.</span>
          </h1>

          <p className="mx-auto max-w-2xl mt-6 text-lg md:text-xl text-text-secondary">
            Harvester is the most powerful open-source web scraping platform. Visual builder, AI selectors, real-time monitoring - no code required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/workspace">
              <Button size="lg" variant="green" className="shadow-green">Start Scraping Free &rarr;</Button>
            </Link>
            <a href="#demo">
              <Button size="lg" variant="ghost">See how it works ↓</Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-text-muted">
            {checks.map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><Check size={14} /> {item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs tracking-[0.15em] uppercase text-text-muted">SEE IT IN ACTION</p>
          <h2 className="font-display text-4xl mt-2">From URL to structured data in seconds.</h2>

          <div className="mt-10 grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-center">
            <Card className="p-5 hover:shadow-green transition-shadow">
              <p className="text-sm text-text-secondary mb-3">Paste your URL</p>
              <div className="rounded-md bg-base border border-border px-3 py-2 text-sm text-text-secondary">https://example-shop.com/products</div>
              <Button variant="green" className="mt-4">Generate with AI</Button>
            </Card>

            <ChevronRight className="mx-auto text-text-muted hidden lg:block" />

            <Card className="p-5 hover:shadow-green transition-shadow">
              <p className="text-sm text-text-secondary mb-3">AI maps the data</p>
              <div className="space-y-2 text-sm font-mono">
                {["product_name   [h1.product-title]", "price          [.price-tag]", "rating         [.stars-count]", "in_stock       [.availability]"].map((line, i) => (
                  <p key={line} className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: `${300 * i}ms` }}>
                    <CircleCheck size={14} className="text-green" /> {line}
                  </p>
                ))}
              </div>
            </Card>

            <ChevronRight className="mx-auto text-text-muted hidden lg:block" />

            <Card className="p-5 hover:shadow-green transition-shadow">
              <p className="text-sm text-text-secondary mb-3">Download your data</p>
              <table className="w-full text-xs">
                <tbody>
                  <tr><td>Widget A</td><td>$19.00</td></tr>
                  <tr><td>Widget B</td><td>$24.00</td></tr>
                  <tr><td>Widget C</td><td>$17.00</td></tr>
                </tbody>
              </table>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="surface">JSON</Button>
                <Button size="sm" variant="surface">CSV</Button>
                <Button size="sm" variant="surface">XLSX</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-4xl text-center">Everything a scraper needs. Nothing it doesn't.</h2>
          <p className="text-text-secondary text-center mt-2">Built for developers and non-developers alike.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title} className={`p-6 hover:-translate-y-0.5 transition-all hover:border-border-active ${f.accent}`}>
                  <Icon size={18} className="text-text-primary" />
                  <h3 className="font-display text-xl mt-3">{f.title}</h3>
                  <p className="text-text-secondary mt-2">{f.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface border-y border-border py-12">
        <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-4 text-center">
          <div><p className="font-display text-4xl"><CountUp end={60000} suffix="+" /></p><p className="text-sm text-text-muted">Stars on GitHub</p></div>
          <div><p className="font-display text-4xl"><CountUp end={500} suffix="+" /></p><p className="text-sm text-text-muted">Contributors</p></div>
          <div><p className="font-display text-4xl">2.14.2</p><p className="text-sm text-text-muted">Latest version</p></div>
          <div><p className="font-display text-4xl">100%</p><p className="text-sm text-text-muted">Open source</p></div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-4xl text-center">Three steps to your data.</h2>
          <div className="mt-10 space-y-8">
            {[
              ["01", "Define what you want", "Enter your target URL. Use the visual builder to click elements, let AI generate selectors, or write custom XPath/CSS yourself."],
              ["02", "Harvester does the work", "Our Scrapy-powered engine handles requests, retries, rate limiting, anti-bot evasion, and pagination - automatically."],
              ["03", "Own your data", "Download as JSON, CSV, or XLSX. Pipe into your database, feed your AI model, or drop into a spreadsheet."],
            ].map(([num, title, body], idx) => (
              <div key={num} className="relative pl-20">
                {idx < 2 && <div className="absolute left-[23px] top-12 bottom-[-28px] border-l border-dashed border-border" />}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-full border-2 border-green bg-green-muted text-green font-display grid place-items-center">{num}</div>
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="text-text-secondary mt-2">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Card className="p-10 text-center rounded-[20px] border-border-active bg-[linear-gradient(135deg,var(--bg-elevated),var(--bg-overlay))] shadow-[0_0_60px_rgba(0,208,132,0.08)]">
            <h2 className="font-display text-4xl">Start extracting data today.</h2>
            <p className="text-text-secondary mt-3">Free forever. No credit card required. Open source.</p>
            <Link to="/workspace" className="inline-block mt-6"><Button variant="green" size="lg">Open Workspace &rarr;</Button></Link>
            <p className="text-text-muted text-sm mt-4">or <a className="text-green hover:underline" href="#">star us on GitHub</a></p>
          </Card>
        </div>
      </section>
    </div>
  )
}
