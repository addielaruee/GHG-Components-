import { EmptyValue } from '@/components/primitives/EmptyValue'
import { cn } from '@/lib/cn'

/**
 * SummaryTable
 *
 * The "Period means" panel under the legend on the flux summary:
 *
 *   Period means
 *   GAS      MEAN     SD
 *   CO₂      3.24   0.91
 *   CH₄      0.86   0.34
 *
 * Two things the wireframe does that are worth keeping.
 *
 * **The standard deviation is quieter than the mean.** Both are numbers in the
 * same row, but the mean is what a reader came for and the SD is how much to
 * trust it, so they are not weighted equally. Giving both the same emphasis
 * would make the panel harder to scan for no gain.
 *
 * **The label column is left, both numbers right.** Same rule as DataTable: a
 * column of right-aligned figures can be scanned for an outlier, a ragged one
 * cannot.
 *
 * Deliberately not built on DataTable. This has four fixed rows, no sorting, no
 * selection and no truncation, and running it through a generic table would
 * cost more in configuration than it saves.
 */

export interface SummaryRow {
  label: React.ReactNode
  /** `null` renders an em dash rather than a zero. */
  mean: number | null
  sd?: number | null
  precision?: number
}

export interface SummaryTableProps {
  title?: React.ReactNode
  /** Column headings. Defaults to the wireframe's. */
  headings?: [React.ReactNode, React.ReactNode, React.ReactNode?]
  rows: SummaryRow[]
  className?: string
}

export function SummaryTable({
  title = 'Period means',
  headings = ['Gas', 'Mean', 'SD'],
  rows,
  className,
}: SummaryTableProps) {
  const showSd = headings[2] != null

  return (
    <div className={cn('w-full', className)}>
      <div className="border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold tracking-[-0.006em] text-ink">{title}</h3>
      </div>

      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th scope="col" className="px-4 py-2 text-left text-[11px] tracking-wide text-ink/45 uppercase">
              {headings[0]}
            </th>
            <th scope="col" className="px-4 py-2 text-right text-[11px] tracking-wide text-ink/45 uppercase">
              {headings[1]}
            </th>
            {showSd && (
              <th scope="col" className="px-4 py-2 text-right text-[11px] tracking-wide text-ink/45 uppercase">
                {headings[2]}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-line-soft">
              <th scope="row" className="px-4 py-2 text-left font-normal text-ink">
                {row.label}
              </th>
              <td className="px-4 py-2 text-right font-medium text-ink tabular-nums">
                {row.mean === null ? <EmptyValue /> : row.mean.toFixed(row.precision ?? 2)}
              </td>
              {showSd && (
                // Quieter than the mean: it qualifies the number rather than
                // being the number.
                <td className="px-4 py-2 text-right text-ink/45 tabular-nums">
                  {row.sd == null ? <EmptyValue /> : row.sd.toFixed(row.precision ?? 2)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
