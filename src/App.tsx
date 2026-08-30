import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/layout/PageHeader'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { Badge } from '@/components/primitives/Badge'
import { Button } from '@/components/primitives/Button'
import { Checkbox } from '@/components/primitives/Checkbox'
import { Chip } from '@/components/primitives/Chip'
import { EmptyValue } from '@/components/primitives/EmptyValue'
import { IconButton } from '@/components/primitives/IconButton'
import { SearchInput } from '@/components/primitives/SearchInput'
import { Select } from '@/components/primitives/Select'
import { TextInput } from '@/components/primitives/TextInput'
import { TextLink } from '@/components/primitives/TextLink'
import { TrendArrow } from '@/components/primitives/TrendArrow'
import {
  ChevronDownIcon,
  DashboardIcon,
  DeviceIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
} from '@/components/primitives/icons'
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
  const [shellView, setShellView] = useState('cards')
  const [shellSection, setShellSection] = useState('devices')
  const [navDemo, setNavDemo] = useState('devices')
  const [feed, setFeed] = useState('live')
  const [feedPartial, setFeedPartial] = useState('live')
  const [deviceType, setDeviceType] = useState('array')
  const [lineStyle, setLineStyle] = useState('solid')
  const [rows, setRows] = useState({ a: true, b: false, c: false })
  const [channels, setChannels] = useState<Record<string, boolean>>({
    Chamber_Temp_C: true,
    'Chamber_RH_%': true,
    Chamber_Pressure_Pa: true,
    SoilM_Raw: false,
    avSD: false,
  })
  const selectedCount = Object.values(rows).filter(Boolean).length

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface/80 px-8 py-5 backdrop-blur-xl">
        <h1 className="text-[15px] font-semibold tracking-[-0.01em]">GHG Components</h1>
        <p className="mt-0.5 text-[13px] text-gray-500">
          P24: GHG chamber monitoring dashboard. Component gallery.
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
              History is disabled, so it cannot be selected. This is the per-option state, not a
              disabled control.
            </p>
          </Row>
        </Section>

        <Section
          title="StatusDot"
          note="Four states, three sizes. Pulse is opt-in, never in a list."
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

        <Section
          title="Badge"
          note="A static label, never clickable. Grey is the wireframe's only tone; the rest are for fault states."
        >
          <Row label="from wireframe">
            <Badge>Standalone chamber</Badge>
            <Badge>Array chamber</Badge>
            <Badge>Array mode · 8 chambers</Badge>
            <Badge variant="outline">read-only</Badge>
            <Badge variant="outline">No response</Badge>
          </Row>
          <Row label="tones · soft">
            <Badge tone="ok">Reporting</Badge>
            <Badge tone="warn">Not responding</Badge>
            <Badge tone="error">Alarm 4</Badge>
            <Badge>Neutral</Badge>
          </Row>
          <Row label="with dot">
            <Badge tone="ok" dot>
              Reporting
            </Badge>
            <Badge tone="warn" dot>
              Not responding
            </Badge>
            <Badge tone="error" dot>
              Alarm 4
            </Badge>
            <Badge tone="error" variant="outline" dot>
              Alarm 4
            </Badge>
          </Row>
          <Row label="tones · outline">
            <Badge tone="ok" variant="outline">
              Reporting
            </Badge>
            <Badge tone="warn" variant="outline">
              Not responding
            </Badge>
            <Badge tone="error" variant="outline">
              Alarm 4
            </Badge>
            <Badge variant="outline">Neutral</Badge>
          </Row>
          <Row label="small">
            <Badge size="sm">Standalone chamber</Badge>
            <Badge size="sm" variant="outline">
              read-only
            </Badge>
            <Badge size="sm" tone="warn">
              no flux yet
            </Badge>
          </Row>
          <Row label="in context">
            {/* The array-chamber detail header, where soft and outline sit together. */}
            <span className="flex items-center gap-2">
              <StatusDot status="ok" label={null} size="lg" />
              <span className="text-lg font-semibold tracking-[-0.01em]">CH-01</span>
              <Badge>Array chamber</Badge>
              <Badge variant="outline">read-only</Badge>
            </span>
          </Row>
        </Section>

        <Section title="Checkbox" note="Chart legends, row selection, and a select-all header that needs the indeterminate state.">
          <Row label="states">
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Disabled" disabled />
          </Row>
          <Row label="select all">
            <div className="flex flex-col gap-2">
              <Checkbox
                label={`Select all (${selectedCount} of 3)`}
                checked={selectedCount === 3}
                indeterminate={selectedCount > 0 && selectedCount < 3}
                onChange={(e) =>
                  setRows({ a: e.target.checked, b: e.target.checked, c: e.target.checked })
                }
              />
              <div className="ml-5 flex flex-col gap-1.5">
                {(['a', 'b', 'c'] as const).map((k, i) => (
                  <Checkbox
                    key={k}
                    size="sm"
                    label={`CH-0${i + 1}`}
                    checked={rows[k]}
                    onChange={(e) => setRows((r) => ({ ...r, [k]: e.target.checked }))}
                  />
                ))}
              </div>
            </div>
          </Row>
        </Section>

        <Section title="TextInput · SearchInput · Select" note="One shared field surface, so a stacked form never drifts.">
          <Row label="text">
            <div className="w-56">
              <TextInput label="ChamberID" defaultValue="CH-S29" />
            </div>
            <div className="w-56">
              <TextInput label="IP address" placeholder="192.168.1.___" hint="On the office tailnet." />
            </div>
          </Row>
          <Row label="error">
            <div className="w-56">
              <TextInput label="Latitude" defaultValue="not-a-number" error="Must be a decimal degree." />
            </div>
          </Row>
          <Row label="trailing">
            <div className="w-72">
              <TextInput
                label="IP address"
                placeholder="192.168.1.___"
                trailing={<Button size="sm">Test connection</Button>}
              />
            </div>
          </Row>
          <Row label="search">
            <div className="w-64">
              <SearchInput />
            </div>
          </Row>
          <Row label="select">
            <div className="w-56">
              <Select
                label="Variable"
                defaultValue="CO2_ppm"
                options={[
                  { value: 'CO2_ppm', label: 'CO2_ppm (ppm)' },
                  { value: 'UsedSD', label: 'UsedSD (GB)' },
                  { value: 'Chamber_Temp_C', label: 'Chamber_Temp_C (°C)' },
                ]}
              />
            </div>
            <div className="w-56">
              <Select
                label="Chamber"
                hint="MPVPosition, the client's own request."
                defaultValue="1"
                options={[1, 2, 3, 4, 6, 7, 8].map((n) => ({
                  value: String(n),
                  label: `CH-0${n}`,
                }))}
              />
            </div>
          </Row>
        </Section>

        <Section title="IconButton · TextLink · TrendArrow · EmptyValue" note="The small pieces that fill tables and card footers.">
          <Row label="icon · ghost">
            <IconButton label="Collapse card">
              <ChevronDownIcon />
            </IconButton>
            <IconButton label="Close">
              <CloseIcon />
            </IconButton>
            <IconButton label="Collapse card" size="sm">
              <ChevronDownIcon />
            </IconButton>
          </Row>
          <Row label="icon · outline">
            <IconButton label="Zoom in" variant="outline">
              <PlusIcon />
            </IconButton>
            <IconButton label="Zoom out" variant="outline">
              <MinusIcon />
            </IconButton>
            <IconButton label="Previous page" variant="outline" size="sm">
              <ChevronLeftIcon />
            </IconButton>
            <IconButton label="Next page" variant="outline" size="sm">
              <ChevronRightIcon />
            </IconButton>
          </Row>
          <Row label="links">
            <TextLink>Show 4 more array chambers</TextLink>
            <TextLink>Select all 8</TextLink>
            <TextLink size="sm">12 more</TextLink>
            <TextLink href="#top">Open CH-01 chamber page →</TextLink>
          </Row>
          <Row label="trend">
            <span className="flex items-center gap-1 text-sm font-medium">
              3.41 <TrendArrow direction="up" />
            </span>
            <span className="flex items-center gap-1 text-sm font-medium">
              2.87 <TrendArrow direction="down" />
            </span>
            <span className="flex items-center gap-1 text-sm font-medium">
              4.62 <TrendArrow direction="flat" />
            </span>
            <span className="text-xs text-gray-400">
              Uncoloured on purpose: a rising flux is not good or bad news.
            </span>
          </Row>
          <Row label="empty">
            <span className="text-sm">
              CH-04 · <EmptyValue reason="Chamber unreachable since 09:14" /> ppm
            </span>
            <span className="text-xs text-gray-400">Never a zero.</span>
          </Row>
        </Section>

        <Section title="Chip" note="Channel toggles. The third state means the sensor was never fitted.">
          <Row label="channels">
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(channels).map(([name, on]) => (
                <Chip
                  key={name}
                  active={on}
                  onClick={() => setChannels((c) => ({ ...c, [name]: !c[name] }))}
                >
                  {name}
                </Chip>
              ))}
              <Chip disabled>SoilT_C · not fitted</Chip>
              <Chip disabled>Soil_EC · not fitted</Chip>
              <Chip disabled>Light_Down · not fitted</Chip>
            </div>
          </Row>
        </Section>

        <Section
          title="SidebarNav"
          note="Two items, and it should stay that way. Selected row gets an accent rail, taken from the wireframe."
        >
          <Row label="on the tint">
            {/* Shown on the canvas tint, because that is the only place it appears. */}
            <div className="w-sidebar overflow-hidden rounded-lg border border-line bg-canvas">
              <SidebarNav value={navDemo} onChange={setNavDemo} items={SECTIONS} />
            </div>
            <span className="text-xs text-gray-400">
              Selected: <span className="font-medium text-ink">{navDemo}</span>
            </span>
          </Row>
        </Section>

        <Section
          title="PageHeader"
          note="Every variant the wireframe uses. No bottom border of its own; AppShell owns that hairline."
        >
          <div className="divide-y divide-line">
            <div className="border-b border-line">
              <PageHeader
                title="Devices"
                actions={
                  <>
                    <SegmentedControl
                      size="sm"
                      ariaLabel="Device view"
                      value={view}
                      onChange={setView}
                      options={[
                        { value: 'cards', label: 'Cards' },
                        { value: 'table', label: 'Table' },
                        { value: 'map', label: 'Map' },
                      ]}
                    />
                    <Button size="sm" variant="primary">
                      + Add chamber
                    </Button>
                  </>
                }
              />
            </div>
            <div className="border-b border-line">
              <PageHeader
                title="Devices"
                actions={<Button size="sm" variant="primary">+ Add chamber</Button>}
              >
                {/* The Add-chamber screen puts the search inline with the title. */}
                <div className="w-56">
                  <SearchInput size="sm" />
                </div>
              </PageHeader>
            </div>
            <div className="border-b border-line">
              <PageHeader title="Dashboard" actions={<Button size="sm">Export</Button>} />
            </div>
            <div>
              <PageHeader
                title="Edit dashboard"
                meta="unsaved changes"
                actions={
                  <>
                    <Button size="sm">Discard</Button>
                    <Button size="sm" variant="primary">
                      Save layout
                    </Button>
                  </>
                }
              />
            </div>
          </div>
        </Section>

        <Section
          title="AppShell"
          note="The frame all ten screens sit in. Only the content column scrolls; the sidebar and header stay put."
        >
          <div className="px-5 py-4">
            {/* `bounded` so the shell fills this preview box rather than the
                viewport. The real app uses the default. */}
            <div className="h-96 overflow-hidden rounded-lg border border-line">
              <AppShell
                bounded
                sidebar={
                  <SidebarNav
                    value={shellSection}
                    onChange={setShellSection}
                    items={SECTIONS}
                  />
                }
                header={
                  <PageHeader
                    title={shellSection === 'devices' ? 'Devices' : 'Dashboard'}
                    actions={
                      <>
                        <SegmentedControl
                          size="sm"
                          ariaLabel="Device view"
                          value={shellView}
                          onChange={setShellView}
                          options={[
                            { value: 'cards', label: 'Cards' },
                            { value: 'table', label: 'Table' },
                            { value: 'map', label: 'Map' },
                          ]}
                        />
                        <Button size="sm" variant="primary">
                          + Add chamber
                        </Button>
                      </>
                    }
                  />
                }
              >
                <div className="space-y-2 p-5">
                  <p className="text-xs text-gray-400">
                    Showing <span className="font-medium text-ink">{shellSection}</span> /{' '}
                    <span className="font-medium text-ink">{shellView}</span>. Scroll this column;
                    the sidebar and header hold their position. The real screens that render per
                    view are Tier 3 and do not exist yet.
                  </p>
                  {Array.from({ length: 14 }, (_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm"
                    >
                      <StatusDot status={i === 3 ? 'warn' : 'ok'} label={null} />
                      <span className="font-medium">CH-S{21 + i}</span>
                      <span className="text-gray-500">
                        {i === 3 ? '· unreachable since 09:14' : '· standalone · last row 2 min ago'}
                      </span>
                    </div>
                  ))}
                </div>
              </AppShell>
            </div>
          </div>
        </Section>
      </main>
    </div>
  )
}

/** The app's two sections. Exactly two, and it should stay that way. */
const SECTIONS = [
  { id: 'dashboards', label: 'Dashboards', icon: <DashboardIcon /> },
  { id: 'devices', label: 'Devices', icon: <DeviceIcon /> },
]

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
    // No overflow-hidden: it would clip an open Select menu.
    <section className="rounded-xl border border-line bg-surface shadow-panel">
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
