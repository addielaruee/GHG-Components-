import { cn } from '@/lib/cn'

/**
 * StatStrip
 *
 * A device's latest record, read field by field. It appears four times in the
 * wireframe and the cell count varies wildly:
 *
 *   Analyser card      4 gas concentrations
 *   Standalone card    5 mixed readings
 *   Analyser detail    4 gases, plus active chamber and array position
 *   Chamber detail     12 fields, the full record
 *
 * So it takes a list and divides the width evenly, rather than assuming a
 * layout. Measured from the wireframe: 50px tall, label above value, hairline
 * dividers between cells, a faint fill so the strip reads as one band.
 *
 * The label sits above the value rather than beside it because these are read
 * by scanning down a column of values, not across pairs. A researcher checking
 * a rig looks at the numbers first and only reads a label when one looks wrong.
 *
 * Pass `<EmptyValue />` as the value where there is no reading. The strip will
 * not do it for you, because only the caller knows why a field is missing: an
 * unfitted sensor and an unreachable device deserve different words.
 */

export interface Stat {
  label: React.ReactNode
  value: React.ReactNode
}

export interface StatStripProps {
  stats: Stat[]
  /** `sm` for the strip inside a device card, `md` for a detail page. */
  size?: 'sm' | 'md'
  className?: string
}

// Line heights are set explicitly rather than inherited. This strip carries up
// to twelve fields and is meant to read as a dense band; default leading pushed
// it to 59px against the wireframe's 50.
const sizes = {
  sm: { cell: 'px-3 py-1.5', label: 'text-[10px]/[13px]', value: 'text-[13px]/[17px]', min: 'min-w-20' },
  md: { cell: 'px-4 py-2', label: 'text-[11px]/[14px]', value: 'text-sm/[18px]', min: 'min-w-24' },
}

export function StatStrip({ stats, size = 'md', className }: StatStripProps) {
  const s = sizes[size]

  return (
    // Scrolls rather than wraps. Twelve fields folding onto a second line stops
    // being a strip and starts being a table with no headings.
    <div className={cn('w-full overflow-x-auto border-y border-line bg-surface-hi', className)}>
      <dl className="flex min-w-full">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-1 flex-col gap-0.5',
              s.cell,
              s.min,
              // Dividers between cells, not around the strip: the band's own
              // edges are the border-y above.
              index > 0 && 'border-l border-line',
            )}
          >
            <dt className={cn('truncate text-ink/55', s.label)}>{stat.label}</dt>
            <dd className={cn('truncate font-semibold text-ink tabular-nums', s.value)}>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
