import React, { useMemo, useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import { Link } from "react-router-dom"

const faqs = [
  ["Is it really free?", "Yes. The free tier is genuinely free - no credit card required, no trial period. You get 500 pages/month forever."],
  ["What counts as a 'page'?", "One HTTP request to one URL counts as one page. If your spider crawls 50 product pages, that's 50 pages."],
  ["Can I use my own Anthropic API key?", "Yes. In Settings, you can add your own Claude API key. Doing so removes the daily AI selector limit on all plans."],
  ["Is Harvester open source?", "The scraping engine is built on Scrapy (BSD-3 open source). The Harvester platform layer is source-available - you can read the code."],
  ["What happens if I go over my page limit?", "Crawls that would exceed your limit are paused, not deleted. You can upgrade or wait for the next billing cycle."],
  ["Do you offer refunds?", "Yes - full refund within 14 days, no questions asked."],
  ["Can I run Harvester on my own server?", "Enterprise plan includes on-premise deployment with Docker. Contact us for details."],
  ["What's your data privacy policy?", "Your scraped data is yours. We don't read it, sell it, or share it. See our Privacy Policy for full details."],
]

function Feature({ enabled, children }) {
  return (
    <li className="flex items-start gap-2 text-sm text-text-secondary">
      {enabled ? <Check size={14} className="text-green mt-0.5" /> : <X size={14} className="text-text-muted mt-0.5" />}
      <span>{children}</span>
    </li>
  )
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const price = useMemo(() => (annual ? 23 : 29), [annual])

  return (
    <div className="py-14">
      <section className="text-center px-6">
        <h1 className="font-display text-5xl">Simple, honest pricing.</h1>
        <p className="text-text-secondary mt-3">Start free. Upgrade when you need more.</p>
        <div className="inline-flex items-center gap-2 mt-6 border border-border rounded-full p-1 bg-surface">
          <button onClick={() => setAnnual(false)} className={`px-4 py-1.5 rounded-full text-sm ${!annual ? "bg-elevated text-text-primary" : "text-text-secondary"}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-4 py-1.5 rounded-full text-sm ${annual ? "bg-elevated text-text-primary" : "text-text-secondary"}`}>Annual</button>
          <span className="text-xs bg-green-muted text-green px-2 py-1 rounded-full">Save 20%</span>
        </div>
      </section>

      <section className="mt-12 px-6">
        <div className="mx-auto max-w-7xl grid gap-5 lg:grid-cols-3">
          <Card className="p-8 flex flex-col">
            <h3 className="font-display text-2xl">FREE</h3>
            <p className="text-4xl font-display mt-2">$0<span className="text-base text-text-secondary">/month</span></p>
            <p className="text-text-secondary mt-2">Perfect for personal projects</p>
            <ul className="mt-6 space-y-2 flex-1">
              <Feature enabled>500 pages/month</Feature>
              <Feature enabled>3 active spiders</Feature>
              <Feature enabled>Visual builder</Feature>
              <Feature enabled>AI selector (5 uses/day)</Feature>
              <Feature enabled>CSV + JSON export</Feature>
              <Feature enabled={false}>Scheduled crawls</Feature>
              <Feature enabled={false}>Proxy rotation</Feature>
              <Feature enabled={false}>XLSX export</Feature>
              <Feature enabled={false}>API access</Feature>
            </ul>
            <Button variant="ghost" className="mt-6 border-green text-green hover:bg-green-muted">Get started free</Button>
          </Card>

          <Card className="p-8 flex flex-col bg-overlay border-green/40 shadow-green relative">
            <span className="absolute top-4 right-4 text-xs rounded-full px-2 py-1 bg-green-muted text-green">Most popular</span>
            <h3 className="font-display text-2xl">PRO</h3>
            <p className="text-4xl font-display mt-2">${price}<span className="text-base text-text-secondary">/month</span></p>
            <p className="text-text-secondary mt-2">For professionals and small teams</p>
            <ul className="mt-6 space-y-2 flex-1">
              <Feature enabled>50,000 pages/month</Feature>
              <Feature enabled>Unlimited spiders</Feature>
              <Feature enabled>Visual builder</Feature>
              <Feature enabled>AI selector (unlimited)</Feature>
              <Feature enabled>All export formats</Feature>
              <Feature enabled>Scheduled crawls</Feature>
              <Feature enabled>Proxy rotation</Feature>
              <Feature enabled>Priority support</Feature>
              <Feature enabled={false}>Team workspaces</Feature>
              <Feature enabled={false}>API access</Feature>
            </ul>
            <Button variant="green" className="mt-6">Start Pro free trial</Button>
          </Card>

          <Card className="p-8 flex flex-col">
            <h3 className="font-display text-2xl">ENTERPRISE</h3>
            <p className="text-4xl font-display mt-2">Custom</p>
            <p className="text-text-secondary mt-2">For teams and large organisations</p>
            <ul className="mt-6 space-y-2 flex-1">
              <Feature enabled>Unlimited pages</Feature>
              <Feature enabled>Unlimited spiders</Feature>
              <Feature enabled>Everything in Pro</Feature>
              <Feature enabled>Team workspaces</Feature>
              <Feature enabled>API access</Feature>
              <Feature enabled>SSO / SAML</Feature>
              <Feature enabled>Audit logs</Feature>
              <Feature enabled>On-premise option</Feature>
              <Feature enabled>Dedicated support</Feature>
            </ul>
            <Button variant="surface" className="mt-6 border-accent-blue text-accent-blue hover:bg-accent-blue/10">Contact us</Button>
          </Card>
        </div>
      </section>

      <section className="mt-16 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-4xl text-center mb-8">Common questions.</h2>
          <div className="space-y-3">
            {faqs.map(([q, a], idx) => {
              const isOpen = openFaq === idx
              return (
                <Card key={q} className="p-0 overflow-hidden">
                  <button className="w-full text-left p-4 flex items-center justify-between" onClick={() => setOpenFaq(isOpen ? -1 : idx)}>
                    <span className="font-medium">{q}</span>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`transition-all duration-300 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                    <p className="px-4 pb-4 text-text-secondary">{a}</p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-16 bg-surface border-t border-border py-20">
        <div className="mx-auto max-w-3xl text-center px-6">
          <h2 className="font-display text-4xl">Start free. No credit card needed.</h2>
          <p className="text-text-secondary mt-2">Get your first scraper live in minutes.</p>
          <Link to="/workspace" className="inline-block mt-6"><Button size="lg" variant="green">Open Workspace &rarr;</Button></Link>
        </div>
      </section>
    </div>
  )
}
