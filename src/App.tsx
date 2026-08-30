import { useState } from 'react'
import { Button } from '@/components/primitives/Button'
import { SegmentedControl } from '@/components/primitives/SegmentedControl'
import { StatusDot } from '@/components/primitives/StatusDot'

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
  const [averaging, setAveraging] = useState('30m')
  const [averagingSmall, setAveragingSmall] = useState('30m')
  const [view, setView] = useState('cards')
  const [feed, setFeed] = useState('live')
  const [feedPartial, setFeedPartial] = useState('live')
  const [deviceType, setDeviceType] = useState('array')
  const [lineStyle, setLineStyle] = useState('solid')

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

        <Section
          title="SegmentedControl"
          note="Every instance found in the wireframe. The pill slides; arrow keys work."
        >
          <Row label="averaging">
            <SegmentedControl
              ariaLabel="Averaging interval"
              value={averaging}
              onChange={setAveraging}
              options={[
                { value: '1m', label: '1 min' },
                { value: '5m', label: '5 min' },
                { value: '30m', label: '30 min' },
              ]}
            />
          </Row>
          <Row label="view">
            <SegmentedControl
              ariaLabel="Device view"
              value={view}
              onChange={setView}
              options={[
                { value: 'cards', label: 'Cards' },
                { value: 'table', label: 'Table' },
                { value: 'map', label: 'Map' },
              ]}
            />
          </Row>
          <Row label="feed">
            <SegmentedControl
              ariaLabel="Feed mode"
              value={feed}
              onChange={setFeed}
              options={[
                { value: 'live', label: 'Live' },
                { value: 'history', label: 'History' },
              ]}
            />
          </Row>
          <Row label="small">
            <SegmentedControl
              size="sm"
              ariaLabel="Averaging interval"
              value={averagingSmall}
              onChange={setAveragingSmall}
              options={[
                { value: '1m', label: '1 min' },
                { value: '5m', label: '5 min' },
                { value: '30m', label: '30 min' },
              ]}
            />
          </Row>
          <Row label="full width">
            <div className="w-96">
              <SegmentedControl
                fullWidth
                ariaLabel="Device type"
                value={deviceType}
                onChange={setDeviceType}
                options={[
                  { value: 'array', label: 'Analyser array' },
                  { value: 'standalone', label: 'Standalone chamber' },
                ]}
              />
            </div>
          </Row>
          <Row label="line style">
            <SegmentedControl
              ariaLabel="Line style"
              value={lineStyle}
              onChange={setLineStyle}
              options={[
                { value: 'solid', label: <Rule dash="none" />, ariaLabel: 'Solid' },
                { value: 'dashed', label: <Rule dash="6 4" />, ariaLabel: 'Dashed' },
                { value: 'dotted', label: <Rule dash="1.5 3" />, ariaLabel: 'Dotted' },
              ]}
            />
          </Row>
          <Row label="one option off">
            <SegmentedControl
              ariaLabel="Feed mode"
              value={feedPartial}
              onChange={setFeedPartial}
              options={[
                { value: 'live', label: 'Live' },
                { value: 'history', label: 'History', disabled: true },
              ]}
            />
            <p className="basis-full text-xs text-gray-400">
              History is disabled, so it cannot be selected — this is the per-option state, not a
              disabled control.
            </p>
          </Row>
        </Section>

        <Section
          title="StatusDot"
          note="Four states, three sizes. Pulse is opt-in — never in a list."
        >
          <Row label="states">
            <Legend status="ok" text="Reporting" />
            <Legend status="warn" text="Not responding" />
            <Legend status="error" text="Fault" />
            <Legend status="unknown" text="No data yet" />
          </Row>
          <Row label="sizes">
            <StatusDot status="ok" size="sm" />
            <StatusDot status="ok" size="md" />
            <StatusDot status="ok" size="lg" />
            <span className="text-xs text-gray-400">6 / 8 / 10 px</span>
          </Row>
          <Row label="pulse">
            <StatusDot status="ok" size="lg" pulse />
            <span className="text-xs text-gray-400">
              A device actively reporting. Suppressed under reduced-motion.
            </span>
          </Row>
          <Row label="in context">
            {/* How it reads in the card view and the detail header. */}
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-sm">
                <StatusDot status="ok" label={null} />
                <span className="font-semibold">CH-S21</span>
                <span className="text-gray-500">· standalone · last row 2 min ago</span>
              </span>
              <span className="flex items-center gap-2 text-sm">
                <StatusDot status="warn" label={null} />
                <span className="font-semibold">CH-S23</span>
                <span className="text-gray-500">· unreachable since 09:14</span>
              </span>
            </div>
          </Row>
        </Section>
      </main>
    </div>
  )
}

/** A dot with its meaning spelled out, for the gallery. */
function Legend({ status, text }: { status: 'ok' | 'warn' | 'error' | 'unknown'; text: string }) {
  return (
    <span className="flex items-center gap-2 text-[13px] text-gray-600">
      <StatusDot status={status} label={null} />
      {text}
    </span>
  )
}

/** A short rule, used to preview a chart line style inside a segment. */
function Rule({ dash }: { dash: string }) {
  return (
    <svg width="40" height="10" viewBox="0 0 40 10" aria-hidden>
      <line
        x1="0"
        y1="5"
        x2="40"
        y2="5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={dash === 'none' ? undefined : dash}
      />
    </svg>
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
    <div className="flex items-start gap-6 px-5 py-4">
      <span className="w-32 shrink-0 pt-1.5 text-[11px] tracking-wide text-gray-400 uppercase">
        {label}
      </span>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}
