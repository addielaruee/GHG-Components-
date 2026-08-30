import { Checkbox } from '@/components/primitives/Checkbox'
import { EmptyValue } from '@/components/primitives/EmptyValue'
import { TextLink } from '@/components/primitives/TextLink'
import { cn } from '@/lib/cn'

/**
 * LegendPanel
 *
 * The right rail of the flux summary: which chambers are drawn, in which
 * colour, and what each is reading now.
 *
 *   Chambers shown
 *   ARRAY · ANALYSER
 *   ☑ ── CH-01                                   3.41
 *   ☐ ── CH-04                                   (none)
 *   4 more
 *   STANDALONE
 *   ☑ ── CH-S21                                  5.10
 *
 * Grouped by device kind, which is not tidiness. CO₂ covers every chamber,
 * while CH₄ and N₂O exist only on the array, so a reader deciding what a line
 * means has to know which group it came from. The wireframe's own note says the
 * split "is the split that matters when reading the lines".
 *
 * The swatch is a line, not a square, because it stands for a line on the
 * chart, and it carries dash style as well as colour so the legend stays
 * readable in greyscale and for a colour-blind reader.
 *
 * An unchecked row goes grey and its value becomes an em dash. A chamber that
 * is hidden has no current value *on this chart*, and showing one would invite
 * reading a number off a line that is not drawn.
 */

export interface LegendSeries {
  id: string
  label: React.ReactNode
  /** A CSS colour. Use the `--color-series-*` tokens. */
  colour: string
  dash?: 'solid' | 'dashed' | 'dotted'
  /** Current reading. `null` renders an em dash. */
  value?: number | null
  /** Decimal places. Flux is quoted to two. */
  precision?: number
}

export interface LegendGroup {
  /** e.g. "Array · analyser". Rendered upper case. */
  label: React.ReactNode
  series: LegendSeries[]
  /** Count hidden behind a "N more" link. */
  hiddenCount?: number
  onShowMore?: () => void
}

export interface LegendPanelProps {
  title?: React.ReactNode
  groups: LegendGroup[]
  selected: ReadonlySet<string>
  onToggle: (id: string) => void
  className?: string
}

const dashes: Record<string, string> = {
  solid: '',
  dashed: '4 3',
  dotted: '1 3',
}

export function LegendPanel({
  title = 'Chambers shown',
  groups,
  selected,
  onToggle,
  className,
}: LegendPanelProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold tracking-[-0.006em] text-ink">{title}</h3>
      </div>

      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="px-4 py-3">
          <p className="mb-1.5 text-[11px] tracking-wide text-ink/45 uppercase">{group.label}</p>

          {group.series.map((series) => {
            const on = selected.has(series.id)
            return (
              <label
                key={series.id}
                className="flex cursor-pointer items-center gap-2.5 py-1 text-[13px]"
              >
                <Checkbox
                  size="sm"
                  checked={on}
                  onChange={() => onToggle(series.id)}
                  aria-label={`Show ${typeof series.label === 'string' ? series.label : series.id}`}
                />
                <svg width="18" height="8" aria-hidden className="shrink-0">
                  <line
                    x1="0"
                    y1="4"
                    x2="18"
                    y2="4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    stroke={on ? series.colour : 'var(--color-line-strong)'}
                    strokeDasharray={dashes[series.dash ?? 'solid'] || undefined}
                  />
                </svg>
                <span className={cn('flex-1 truncate', on ? 'text-ink' : 'text-ink/40')}>
                  {series.label}
                </span>
                <span className={cn('tabular-nums', on ? 'text-ink/70' : 'text-ink/30')}>
                  {on && series.value != null ? (
                    series.value.toFixed(series.precision ?? 2)
                  ) : (
                    <EmptyValue reason={on ? 'No reading' : 'Hidden from the chart'} />
                  )}
                </span>
              </label>
            )
          })}

          {group.hiddenCount ? (
            <TextLink size="sm" className="mt-1" onClick={group.onShowMore}>
              {group.hiddenCount} more
            </TextLink>
          ) : null}
        </div>
      ))}
    </div>
  )
}
