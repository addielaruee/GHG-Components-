import { MetaList } from '@/components/primitives/MetaList'
import { cn } from '@/lib/cn'

/**
 * InlineChartPanel
 *
 * A chart opened inside an expanded table row, on the array-chamber list.
 *
 * The same three bands as `ChartCard` and deliberately not the same component:
 * this one has no card of its own. It is already inside a row that has a
 * border, a tint and a left edge, and nesting a second bordered panel inside
 * that is how a table starts to look like a stack of boxes. What it puts a
 * border around instead is the **plot**, which `ChartCard` leaves open, because
 * without the card frame the chart has nothing else holding it.
 *
 * The footer exists to say what is *not* here. The wireframe's line reads
 * "Chamber_RH_%, Chamber_Pressure_Pa, SoilM_Raw, avSD and the rest of the
 * channels plot full size on the chamber page", which is the panel admitting it
 * is a preview and pointing at the page that is not. Worth keeping: a row that
 * expands to one chart and says nothing else looks broken rather than brief.
 */

export interface InlineChartPanelProps {
  title: React.ReactNode
  /** Sits after the title in grey: `°C`. */
  unit?: React.ReactNode
  /** What qualifies the window: `last 180 s`. Middot-joined after the unit. */
  meta?: React.ReactNode[]
  /** Figures on the right: `now 15.1 °C`, `range 14.7-15.3`. */
  stats?: React.ReactNode[]
  /** A control on the far right, e.g. the CSV export button. */
  action?: React.ReactNode
  /** What this panel is leaving out. */
  footer?: React.ReactNode
  /** The way out, e.g. "Open CH-01 chamber page". */
  footerAction?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function InlineChartPanel({
  title,
  unit,
  meta,
  stats,
  action,
  footer,
  footerAction,
  children,
  className,
}: InlineChartPanelProps) {
  const qualifiers = [unit, ...(meta ?? [])].filter((item) => item != null && item !== false)

  return (
    <div className={cn('flex flex-col gap-2 px-4 py-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="text-[13px] leading-tight">
          <span className="font-semibold text-ink">{title}</span>
          {qualifiers.length > 0 && <MetaList className="ml-1.5" items={qualifiers} />}
        </p>

        {(stats?.length || action) && (
          <div className="flex items-center gap-3">
            {stats && stats.length > 0 && (
              <MetaList className="text-[11px] tabular-nums" items={stats} />
            )}
            {action}
          </div>
        )}
      </div>

      {/* The border the card would otherwise have given it. */}
      <div className="rounded-control border border-line bg-surface px-2 pt-2 pb-1">{children}</div>

      {(footer || footerAction) && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          {footer != null && <p className="text-xs text-ink/55">{footer}</p>}
          {footerAction}
        </div>
      )}
    </div>
  )
}
