import { Button } from '@/components/primitives/Button'

/**
 * Component gallery.
 *
 * This repo holds the P24 dashboard's React components, built and reviewed in
 * isolation before they are assembled into screens. This page is where they get
 * rendered so they can be looked at.
 *
 * Add a <Section> per component as it lands.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface/80 px-8 py-5 backdrop-blur-xl">
        <h1 className="text-[15px] font-semibold tracking-[-0.01em]">GHG Components</h1>
        <p className="mt-0.5 text-[13px] text-gray-500">
          P24 — GHG chamber monitoring dashboard. Component gallery.
        </p>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 p-8">
        <Section title="Button" note="Two variants, two sizes. Defaults to secondary.">
          <Row label="primary">
            <Button variant="primary">Export raw data</Button>
            <Button variant="primary">+ Add chamber</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </Row>
          <Row label="secondary">
            <Button>Rename</Button>
            <Button>Edit device</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Row label="small">
            <Button size="sm">Rename</Button>
            <Button size="sm">Remove</Button>
            <Button size="sm" variant="primary">
              Apply
            </Button>
          </Row>
          <Row label="in context">
            {/* The detail-page action group, as it appears on Chamber detail. */}
            <Button>Rename</Button>
            <Button>Edit device</Button>
            <Button variant="primary">Export raw data</Button>
          </Row>
        </Section>
      </main>
    </div>
  )
}

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
      <div className="border-b border-line px-5 py-3.5">
        <h2 className="text-[13px] font-semibold tracking-[-0.006em]">{title}</h2>
        {note && <p className="mt-0.5 text-xs text-gray-500">{note}</p>}
      </div>
      <div className="divide-y divide-line">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6 px-5 py-4">
      <span className="w-24 shrink-0 text-[11px] tracking-wide text-gray-400 uppercase">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}
