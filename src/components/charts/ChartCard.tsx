import { Card } from '@/components/layout/Card'
import { MetaList } from '@/components/primitives/MetaList'
import { cn } from '@/lib/cn'

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
 */

export interface ChartStat {
  /** Omit for a freeform fragment, e.g. `→ 5.10 µmol m⁻² s⁻¹`. */
  label?: React.ReactNode
  value: React.ReactNode
}

export interface ChartCardProps {
  title: React.ReactNode
  /** Sits directly after the title in grey: `µmol m⁻² s⁻¹`. */
  unit?: React.ReactNode
  /** What qualifies the window: `30 min mean`, `last 24 h`. Middot-joined. */
  meta?: React.ReactNode[]
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
  stats,
  action,
  flush,
  footer,
  children,
  className,
}: ChartCardProps) {
  const qualifiers = [unit, ...(meta ?? [])].filter((item) => item != null && item !== false)

  return (
    <Card flush footer={footer} className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 pt-3">
        <p className="text-[13px] leading-tight">
          <span className="font-semibold text-ink">{title}</span>
          {qualifiers.length > 0 && <MetaList className="ml-1.5" items={qualifiers} />}
        </p>

        {(stats?.length || action) && (
          <div className="flex items-baseline gap-3">
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
  )
}
