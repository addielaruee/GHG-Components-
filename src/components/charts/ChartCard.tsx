import { Badge, type DeviceTone } from '@/components/primitives/Badge'
import { Card } from '@/components/layout/Card'
import { MetaList } from '@/components/primitives/MetaList'
import { cn } from '@/lib/cn'
import { sourceEdge, sourceLabels } from '@/lib/deviceSource'
import { dashArrays } from '@/lib/scale'
import type { SeriesDash } from '@/lib/seriesPalette'

/**
 * ChartCard
 *
 * The frame every chart on a detail page sits in. One title row, then the
 * chart.
 *
 * The wireframe uses it three times and the row is the same shape each time:
 * the chart's name in ink on the left, then the unit and whatever qualifies the
 * window in grey beside it, then the figures that summarise what is drawn,
 * pushed to the right.
 *
 *   Current closure · CO2_ppm  since Lid Func = closed · 0-180 s
 *                                   slope 0.58 ppm s⁻¹ · R² 0.99 → 5.10 µmol m⁻² s⁻¹
 *   CO₂ flux · one value per closure  µmol m⁻² s⁻¹ · 30 min mean · last 24 h
 *                                                mean 4.62 · min 2.90 · max 6.11
 *
 * Worth saying what this deliberately does *not* do: it never computes a
 * summary. Whether the right-hand figures are a mean over the window, a fit
 * quality or the last value is a question about the science, and a frame that
 * guessed would put a confident number next to a chart that disagreed with it.
 * The caller passes figures it has actually derived from the same points it
 * passed as children.
 *
 * No hairline under the header, unlike `Card`'s own `header` slot. The
 * wireframe runs the title straight into the plot, and on a page stacking three
 * of these a rule per card reads as clutter.
 *
 * **`source` is meaning, not decoration.** It draws a coloured edge down the
 * card and a matching tag beside the title, and the wireframe's own note says
 * why: "so a graph is never read against the wrong source". A CO2 number off
 * the analyser and a CO2 number off a standalone chamber's own sensor are
 * different measurements, and the dashboard stacks them.
 */

export interface ChartStat {
  /** Omit for a freeform fragment, e.g. `→ 5.10 µmol m⁻² s⁻¹`. */
  label?: React.ReactNode
  value: React.ReactNode
}

/** One line drawn on the chart, named in the header beside it. */
export interface ChartLegendEntry {
  id: string
  label: React.ReactNode
  /** Take this from `seriesPalette`, never from a literal, or it will drift. */
  colour: string
  dash?: SeriesDash
}

export interface ChartCardProps {
  title: React.ReactNode
  /** Sits directly after the title in grey: `µmol m⁻² s⁻¹`. */
  unit?: React.ReactNode
  /** What qualifies the window: `30 min mean`, `last 24 h`. Middot-joined. */
  meta?: React.ReactNode[]
  /**
   * Which device the numbers came from. Draws a coloured edge down the card and
   * the matching tag beside the title.
   */
  source?: DeviceTone
  /** Overrides the tag text. Defaults to `sourceLabels[source]`. */
  sourceLabel?: React.ReactNode
  /**
   * The lines drawn, named with a swatch each. For a chart carrying more than
   * one series; a single-series chart names itself in the title.
   */
  legend?: ChartLegendEntry[]
  /** Figures summarising what is drawn, right-aligned. */
  stats?: ChartStat[]
  /** A control for the right of the header, e.g. an export link. */
  action?: React.ReactNode
  /**
   * The chart reaches the card's edges. For a child drawing its own full-width
   * dividers, which `StackedChannelChart` does.
   */
  flush?: boolean
  /** A summary row below the chart, with a hairline above it. */
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ChartCard({
  title,
  unit,
  meta,
  source,
  sourceLabel,
  legend,
  stats,
  action,
  flush,
  footer,
  children,
  className,
}: ChartCardProps) {
  const qualifiers = [unit, ...(meta ?? [])].filter((item) => item != null && item !== false)
  const hasAside = Boolean(legend?.length || stats?.length || action)

  return (
    <div className={cn('relative', className)}>
      <Card flush footer={footer}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3">
          <p className="text-[13px] leading-tight">
            <span className="font-semibold text-ink">{title}</span>
            {source && (
              <Badge tone={source} size="sm" className="mx-1.5 tracking-[0.04em] uppercase">
                {sourceLabel ?? sourceLabels[source]}
              </Badge>
            )}
            {qualifiers.length > 0 && (
              <MetaList className={cn(!source && 'ml-1.5')} items={qualifiers} />
            )}
          </p>

          {hasAside && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {legend && legend.length > 0 && <ChartLegend entries={legend} />}
              {stats && stats.length > 0 && (
                <MetaList
                  className="text-[11px] tabular-nums"
                  items={stats.map((stat) =>
                    stat.label == null ? (
                      stat.value
                    ) : (
                      <>
                        {stat.label} {stat.value}
                      </>
                    ),
                  )}
                />
              )}
              {action}
            </div>
          )}
        </div>

        <div className={cn('pt-1.5 pb-3', !flush && 'px-4')}>{children}</div>
      </Card>

      {source && (
        // Over the card's own left border rather than beside it, which is what
        // the wireframe draws. Not focusable and not announced: the tag next to
        // the title already says this in words.
        <span
          aria-hidden
          className={cn('absolute inset-y-0 left-0 w-[3px] rounded-l-panel', sourceEdge[source])}
        />
      )}
    </div>
  )
}

/** Swatch and name per line, drawn with the pattern the chart draws. */
function ChartLegend({ entries }: { entries: ChartLegendEntry[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink/70">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center gap-1.5">
          <svg width="20" height="8" aria-hidden className="shrink-0 overflow-visible">
            <line
              x1="0"
              y1="4"
              x2="20"
              y2="4"
              stroke={entry.colour}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={dashArrays[entry.dash ?? 'solid']}
            />
          </svg>
          {entry.label}
        </li>
      ))}
    </ul>
  )
}
