import React from "react"
import { Link } from "react-router-dom"
import { CheckCircle2, Eye, Scale, Users } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"

const commitment = [
  {
    icon: Scale,
    title: "BSD-3 Licensed",
    desc: "Scrapy's BSD-3 licence means you can fork, modify, and build commercial products. Harvester inherits this spirit.",
  },
  {
    icon: Eye,
    title: "Transparent by default",
    desc: "The scraping engine, pipeline, and data storage are all open. No black-box magic, no hidden charges for basic features.",
  },
  {
    icon: Users,
    title: "Community first",
    desc: "Bug reports, PRs, and feature requests welcome. The best scraping tool is built by the people who use it.",
  },
]

const stack = [
  ["S", "Scrapy 2.14.2", "Python web crawling engine"],
  ["F", "FastAPI", "async Python API"],
  ["R", "React + Vite", "frontend"],
  ["D", "SQLite / PostgreSQL", "data storage"],
  ["A", "Anthropic Claude", "AI selector generation"],
  ["J", "APScheduler", "job scheduling"],
  ["W", "WebSockets", "live monitoring"],
]

export default function About() {
  return (
    <div>
      <section className="h-[50vh] min-h-[380px] grid place-items-center text-center px-6 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,208,132,0.08)_0%,transparent_70%)]">
        <div>
          <h1 className="font-display text-5xl">Built by scrapers, for scrapers.</h1>
          <p className="mt-4 text-text-secondary max-w-3xl">
            Harvester is an open-source web scraping platform built on top of Scrapy - the most battle-tested scraping engine on the planet.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-8 lg:grid-cols-2 items-start">
          <div>
            <h2 className="font-display text-4xl">Why we built Harvester.</h2>
            <div className="space-y-4 mt-5 text-text-secondary leading-relaxed">
              <p>Scrapy is an incredible piece of engineering. 60,000 GitHub stars and 500+ contributors don't lie. But it's a framework - you still need to write Python, configure environments, manage deployments, and build tooling around it yourself.</p>
              <p>We built Harvester to put Scrapy's power into a product anyone can use. Visual builder for non-developers. Full code access for engineers. Real-time monitoring, scheduling, and export for everyone.</p>
              <p>It's not a replacement for Scrapy. It's the product layer Scrapy always deserved.</p>
            </div>
          </div>
          <Card className="p-6 bg-base border-border font-mono text-sm">
            <p className="text-red line-through">$ pip install scrapy</p>
            <p className="text-red line-through mt-2">$ git clone harvester</p>
            <p className="text-green mt-3 cursor-blink">Open harvester.io &rarr; <CheckCircle2 size={14} className="inline" /></p>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-6 grid gap-4 md:grid-cols-3">
          {commitment.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="p-6">
                <Icon size={18} className="text-green" />
                <h3 className="font-display text-xl mt-3">{item.title}</h3>
                <p className="text-text-secondary mt-2">{item.desc}</p>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-4xl mb-8">What's under the hood.</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stack.map(([letter, name, desc]) => (
              <Card key={name} className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-muted border border-green/35 text-green grid place-items-center font-display">{letter}</div>
                <div>
                  <p className="font-medium text-text-primary">{name}</p>
                  <p className="text-sm text-text-secondary">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface border-t border-border">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl">Ready to harvest?</h2>
          <p className="text-text-secondary mt-2">Launch your first production spider in minutes.</p>
          <Link to="/workspace" className="inline-block mt-6"><Button variant="green" size="lg">Start for free &rarr;</Button></Link>
        </div>
      </section>
    </div>
  )
}
