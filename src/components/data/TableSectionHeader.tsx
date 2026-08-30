import { MetaList } from '@/components/primitives/MetaList'
import { cn } from '@/lib/cn'

/**
 * TableSectionHeader
 *
 * The line that introduces a table on the Table view:
 *
 *   Analyser array · ARR-1   8 chambers · gas is measured by the analyser, not
 *                            the chamber · CO₂ 438 ppm
 *   Standalone chambers      14 devices · own analyser and soil probe · 6 shown
 *
 * It exists because that screen shows two tables, and without a label the split
 * looks arbitrary. It is not: the two device kinds report different columns, so
 * they cannot share one table. The meta line is where that gets said, and
 * "gas is measured by the analyser, not the chamber" is the sentence doing the
 * most work in the whole screen. A researcher scanning the array table would
 * otherwise wonder why there is no CO2 column.
 *
 * Measured from the wireframe: 15px semibold title, 13px muted meta, on the
 * same 20px gutter as the table beneath it.
 */

export interface TableSectionHeaderProps {
  title: React.ReactNode
  /** Facts about the group, joined with a middot. */
  meta?: React.ReactNode[]
  className?: string
}

export function TableSectionHeader({ title, meta, className }: TableSectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2.5 gap-y-1 px-5 py-2', className)}>
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
      {meta && <MetaList items={meta} className="text-[13px]" />}
    </div>
  )
}
