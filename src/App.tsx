import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { DataTable, type Column } from '@/components/data/DataTable'
import { StatStrip } from '@/components/data/StatStrip'
import { TableSectionHeader } from '@/components/data/TableSectionHeader'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { Card } from '@/components/layout/Card'
import { DetailHeader } from '@/components/layout/DetailHeader'
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
import { analyser, arrayChambers, standaloneChambers } from '@/mocks/devices'
import type { ArrayChamber, StandaloneChamber } from '@/types/device'

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
  const [crumb, setCrumb] = useState<string | null>(null)
  const [picked, setPicked] = useState<ReadonlySet<string>>(new Set(['ch-s21']))
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
                hint="MPVPosition. Note the gap: the client's rig has no position 5."
                defaultValue="1"
                options={arrayChambers.map((chamber) => ({
                  value: String(chamber.position),
                  label: chamber.name,
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
          title="StatStrip"
          note="The latest record, field by field. Cell count varies from 4 to 12, so it divides the width evenly."
        >
          <div className="space-y-5 px-5 py-4">
            <div>
              <p className="mb-2 text-[13px] font-semibold">Chamber detail · 12 fields</p>
              <StatStrip stats={chamberStats} />
            </div>
            <div>
              <p className="mb-2 text-[13px] font-semibold">Analyser detail · gases and position</p>
              <StatStrip stats={analyserStats} />
            </div>
            <div>
              <p className="mb-2 text-[13px] font-semibold">
                Inside a device card · small, and a chamber that has gone quiet
              </p>
              <div className="w-96 overflow-hidden rounded-panel border border-line">
                <div className="px-3 py-2 text-[13px] font-semibold">CH-04</div>
                <StatStrip size="sm" stats={quietStats} />
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="TableSectionHeader"
          note="Introduces each table on the Table view. Also used in the DataTable section below, in place."
        >
          <div className="divide-y divide-line">
            <TableSectionHeader
              title="Analyser array · ARR-1"
              meta={[
                `${arrayChambers.length} chambers`,
                'gas is measured by the analyser, not the chamber',
                <>CO₂ {analyser.latest?.co2} ppm</>,
              ]}
            />
            <TableSectionHeader
              title="Standalone chambers"
              meta={[
                `${standaloneChambers.length} devices`,
                'own analyser and soil probe',
                `${standaloneChambers.length} shown`,
              ]}
            />
            <TableSectionHeader title="Title only" />
          </div>
          <Row label="why it matters">
            <p className="max-w-2xl text-xs text-gray-400">
              The Table view shows two tables and without labels the split looks arbitrary. It is
              not: the two device kinds report different columns and cannot share one table.
              &ldquo;Gas is measured by the analyser, not the chamber&rdquo; is the sentence doing
              the most work on that screen, because it explains why the array table has no CO₂
              column.
            </p>
          </Row>
        </Section>

        <Section
          title="DataTable"
          note="Column-driven, because it appears five times with different columns. Numbers right-align; nulls sort last."
        >
          <div className="space-y-5 px-5 py-4">
            <div>
              <TableSectionHeader
                className="px-0"
                title="Analyser array · ARR-1"
                meta={[
                  `${arrayChambers.length} chambers`,
                  'gas is measured by the analyser, not the chamber',
                  <>CO₂ {analyser.latest?.co2} ppm</>,
                ]}
              />
              <div className="mt-1 rounded-panel border border-line">
                <DataTable
                  rows={arrayChambers}
                  rowKey={(c) => c.id}
                  columns={ARRAY_COLUMNS}
                  expandable={(c) =>
                    c.latest === null ? null : (
                      <p className="text-[13px] text-ink/70">
                        {c.name} reports through the analyser at position {c.position}. Lid{' '}
                        {c.latest.lidFunc}, fan {c.latest.fanStatus.toLowerCase()}.
                      </p>
                    )
                  }
                />
              </div>
            </div>

            <div>
              <TableSectionHeader
                className="px-0"
                title="Standalone chambers"
                meta={[
                  `${standaloneChambers.length} devices`,
                  'own analyser and soil probe',
                  `${standaloneChambers.length} shown`,
                ]}
              />
              <div className="mt-1 rounded-panel border border-line">
                <DataTable
                  rows={standaloneChambers}
                  rowKey={(c) => c.id}
                  columns={STANDALONE_COLUMNS}
                  selection={{
                    selected: picked,
                    onChange: setPicked,
                    label: (c) => `Select ${c.name}`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                {picked.size} selected. Sort by CO₂ or flux: CH-S23 and CH-S26 have no value and
                stay at the bottom either way.
              </p>
            </div>

            <div>
              <p className="mb-2 text-[13px] font-semibold">Empty</p>
              <div className="rounded-panel border border-line">
                <DataTable
                  rows={[] as StandaloneChamber[]}
                  rowKey={(c) => c.id}
                  columns={STANDALONE_COLUMNS}
                  empty="No standalone chambers are running."
                />
              </div>
            </div>
          </div>
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
          title="Breadcrumb"
          note="All three detail-page trails. The three-step one is where an array chamber's dependence on the analyser shows."
        >
          <Row label="standalone">
            <Breadcrumb
              onNavigate={setCrumb}
              items={[
                { id: 'devices', label: 'Devices' },
                { id: 'ch-s21', label: 'CH-S21' },
              ]}
            />
          </Row>
          <Row label="analyser">
            <Breadcrumb
              onNavigate={setCrumb}
              items={[
                { id: 'devices', label: 'Devices' },
                { id: 'analyser', label: 'Analyser' },
              ]}
            />
          </Row>
          <Row label="array chamber">
            <Breadcrumb
              onNavigate={setCrumb}
              items={[
                { id: 'devices', label: 'Devices' },
                { id: 'analyser', label: 'Analyser' },
                { id: 'ch-01', label: 'CH-01' },
              ]}
            />
            <span className="text-xs text-gray-400">
              Last clicked: <span className="font-medium text-ink">{crumb ?? 'nothing yet'}</span>
            </span>
          </Row>
          <Row label="not clickable">
            {/* Without onNavigate it renders as plain text. */}
            <Breadcrumb
              items={[
                { id: 'devices', label: 'Devices' },
                { id: 'analyser', label: 'Analyser' },
                { id: 'ch-01', label: 'CH-01' },
              ]}
            />
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
          title="DetailHeader"
          note="All three device pages. The array chamber is the interesting one: two badges, and its location inherited from the analyser."
        >
          <div className="divide-y divide-line">
            <DetailHeader
              breadcrumb={
                <Breadcrumb
                  items={[
                    { id: 'devices', label: 'Devices' },
                    { id: 'ch-s21', label: 'CH-S21' },
                  ]}
                  onNavigate={setCrumb}
                />
              }
              status="ok"
              title="CH-S21"
              badges={<Badge>Standalone chamber</Badge>}
              meta={['IP: 192.168.1.51', 'Location: 54.315, −2.100', 'last row 2 s ago']}
              actions={
                <>
                  <Button size="sm">Rename</Button>
                  <Button size="sm">Edit device</Button>
                  <Button size="sm" variant="primary">
                    Export raw data
                  </Button>
                </>
              }
            />
            <DetailHeader
              breadcrumb={
                <Breadcrumb
                  items={[
                    { id: 'devices', label: 'Devices' },
                    { id: 'analyser', label: 'Analyser' },
                    { id: 'ch-01', label: 'CH-01' },
                  ]}
                  onNavigate={setCrumb}
                />
              }
              status="ok"
              title="CH-01"
              badges={
                <>
                  <Badge>Array chamber</Badge>
                  <Badge variant="outline">read-only</Badge>
                </>
              }
              meta={[
                'Reported by Analyser',
                'array position 1 of 8',
                'Location: inherits analyser',
                'last row 12 s ago',
              ]}
              actions={
                <>
                  <Button size="sm">Rename</Button>
                  <Button size="sm">Open analyser</Button>
                  <Button size="sm" variant="primary">
                    Export raw data
                  </Button>
                </>
              }
            />
            <DetailHeader
              breadcrumb={
                <Breadcrumb
                  items={[
                    { id: 'devices', label: 'Devices' },
                    { id: 'ch-s23', label: 'CH-S23' },
                  ]}
                  onNavigate={setCrumb}
                />
              }
              status="warn"
              title="CH-S23"
              badges={
                <>
                  <Badge>Standalone chamber</Badge>
                  <Badge tone="warn" variant="outline" dot>
                    No response
                  </Badge>
                </>
              }
              meta={['IP: 192.168.1.53', 'unreachable since 09:14']}
              actions={<Button size="sm">Rename</Button>}
            />
          </div>
        </Section>

        <Section title="Card" note="Header and footer bands are optional. Use flush for content that should reach the edges.">
          <Row label="plain">
            <div className="w-72">
              <Card>
                <p className="text-sm text-ink/70">Body only.</p>
              </Card>
            </div>
          </Row>
          <Row label="three bands">
            <div className="w-72">
              <Card
                header={
                  <div className="flex items-center gap-2">
                    <StatusDot status="ok" label={null} />
                    <span className="text-sm font-semibold">CH-S21</span>
                    <span className="text-[13px] text-ink/55">· standalone</span>
                  </div>
                }
                footer={
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] text-ink/55">Latest CO₂ flux · cycle 15:02</span>
                    <span className="flex items-center gap-1 text-sm font-medium">
                      5.10 <TrendArrow direction="up" />
                    </span>
                  </div>
                }
              >
                <p className="text-sm text-ink/70">
                  Lid closed · fan on · Mode status 2
                </p>
              </Card>
            </div>
          </Row>
          <Row label="flush">
            <div className="w-72">
              <Card
                flush
                header={<span className="text-sm font-semibold">Array chambers</span>}
              >
                {/* A table would reach the card's edges rather than sitting inside padding. */}
                <div className="divide-y divide-line text-[13px]">
                  {['CH-01', 'CH-02', 'CH-03'].map((id) => (
                    <div key={id} className="flex justify-between px-4 py-2">
                      <span className="font-medium">{id}</span>
                      <span className="text-ink/55">closed · fan on</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Row>
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
                  {/* Real mock devices, so the shapes get exercised rather than
                      a second set of invented rows drifting from them. */}
                  {[...standaloneChambers, ...arrayChambers].map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm"
                    >
                      <StatusDot status={device.status} label={null} />
                      <span className="font-medium">{device.name}</span>
                      <span className="text-gray-500">
                        · {device.kind === 'array' ? 'array' : 'standalone'} ·{' '}
                        {device.latest === null
                          ? 'no reading'
                          : `${device.latest.lidStatus === 'Close' ? 'lid closed' : 'lid open'}, fan ${device.latest.fanStatus.toLowerCase()}`}
                      </span>
                      <span className="ml-auto text-gray-400">
                        {device.latestFlux?.value == null ? (
                          <EmptyValue reason="No flux computed yet" />
                        ) : (
                          `${device.latestFlux.value.toFixed(2)} µmol m⁻² s⁻¹`
                        )}
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

/** The full record from the chamber detail page. */
const ch = standaloneChambers[0].latest!
const chamberStats = [
  { label: 'Lid Func', value: ch.lidStatus === 'Close' ? 'closed' : 'open' },
  { label: 'Fan status', value: ch.fanStatus.toLowerCase() },
  { label: 'Mode status', value: ch.modeStatus },
  { label: 'avSD', value: num(ch.avSd, 2) },
  { label: 'totalSD', value: num(ch.totalSd, 2) },
  { label: 'UsedSD', value: num(ch.usedSd, 2) },
  { label: 'CO2_ppm', value: num(ch.co2Ppm, 1) },
  { label: 'Temp C', value: num(ch.chamberTempC) },
  { label: 'RH %', value: num(ch.chamberRhPct, 0) },
  { label: 'Press Pa', value: num(ch.chamberPressurePa, 0) },
  { label: 'SoilM_Raw', value: num(ch.soilMRaw, 0) },
  { label: 'SoilT_C', value: num(ch.soilTC) },
]

const an = analyser.latest!
const analyserStats = [
  { label: 'CO₂', value: <>{num(an.co2, 0)} ppm</> },
  { label: 'CH₄', value: <>{num(an.ch4, 2)} ppm</> },
  { label: 'N₂O', value: <>{num(an.n2o, 3)} ppm</> },
  { label: 'NH₃', value: num(an.nh3, 2) },
  { label: 'Active chamber', value: 'CH-01' },
  { label: 'Array position', value: '1 of 8' },
]

/** CH-04 stopped answering, so most of its fields have no current value. */
const quiet = arrayChambers.find((c) => c.name === 'CH-04')!.latest!
const quietStats = [
  { label: 'Temp C', value: num(quiet.chamberTempC) },
  { label: 'RH %', value: num(quiet.chamberRhPct, 0) },
  { label: 'SoilM_Raw', value: num(quiet.soilMRaw, 0) },
  { label: 'UsedSD', value: num(quiet.usedSd, 2) },
]

/** A reading, or the em dash. Never a zero. */
function num(value: number | null, digits = 1) {
  return value === null ? <EmptyValue /> : value.toFixed(digits)
}

const ARRAY_COLUMNS: Column<ArrayChamber>[] = [
  {
    key: 'name',
    header: 'ChamberID',
    sortValue: (c) => c.name,
    cell: (c) => (
      <span className="flex items-center gap-2">
        <StatusDot status={c.status} label={null} size="sm" />
        <span className="font-medium">{c.name}</span>
      </span>
    ),
  },
  { key: 'lid', header: 'Lid', sortValue: (c) => c.latest?.lidStatus ?? null,
    cell: (c) => (c.latest ? (c.latest.lidStatus === 'Close' ? 'closed' : 'open') : <EmptyValue />) },
  { key: 'fan', header: 'Fan', sortValue: (c) => c.latest?.fanStatus ?? null,
    cell: (c) => c.latest?.fanStatus.toLowerCase() ?? <EmptyValue /> },
  { key: 'temp', header: 'Temp C', align: 'right', sortValue: (c) => c.latest?.chamberTempC ?? null,
    cell: (c) => num(c.latest?.chamberTempC ?? null) },
  { key: 'rh', header: 'RH %', align: 'right', sortValue: (c) => c.latest?.chamberRhPct ?? null,
    cell: (c) => num(c.latest?.chamberRhPct ?? null, 0) },
  { key: 'soil', header: 'SoilM_Raw', align: 'right', sortValue: (c) => c.latest?.soilMRaw ?? null,
    cell: (c) => num(c.latest?.soilMRaw ?? null, 0) },
  { key: 'flux', header: 'CO₂ flux', align: 'right', sortValue: (c) => c.latestFlux?.value ?? null,
    cell: (c) => num(c.latestFlux?.value ?? null, 2) },
]

const STANDALONE_COLUMNS: Column<StandaloneChamber>[] = [
  {
    key: 'name',
    header: 'ChamberID',
    sortValue: (c) => c.name,
    cell: (c) => (
      <span className="flex items-center gap-2">
        <StatusDot status={c.status} label={null} size="sm" />
        <span className="font-medium">{c.name}</span>
      </span>
    ),
  },
  { key: 'ip', header: 'IP address', sortValue: (c) => c.ipAddress,
    cell: (c) => c.ipAddress ?? <EmptyValue reason="Not reachable" /> },
  { key: 'co2', header: 'CO₂ ppm', align: 'right', sortValue: (c) => c.latest?.co2Ppm ?? null,
    cell: (c) => num(c.latest?.co2Ppm ?? null, 0) },
  { key: 'temp', header: 'Temp C', align: 'right', sortValue: (c) => c.latest?.chamberTempC ?? null,
    cell: (c) => num(c.latest?.chamberTempC ?? null) },
  { key: 'soilt', header: 'SoilT_C', align: 'right', sortValue: (c) => c.latest?.soilTC ?? null,
    cell: (c) => num(c.latest?.soilTC ?? null) },
  { key: 'flux', header: 'CO₂ flux', align: 'right', sortValue: (c) => c.latestFlux?.value ?? null,
    cell: (c) => num(c.latestFlux?.value ?? null, 2) },
]

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
