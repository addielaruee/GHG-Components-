import { useState } from 'react'
import { DataTable, type Column } from '@/components/data/DataTable'
import { DeviceCardHeader } from '@/components/data/DeviceCardHeader'
import { ShowMoreRow } from '@/components/data/ShowMoreRow'
import { StatStrip, type Stat } from '@/components/data/StatStrip'
import { cn } from '@/lib/cn'
import type { Analyser, ArrayChamber } from '@/types/device'

/**
 * AnalyserCard
 *
 * The analyser in the card view, and always the first card on the screen.
 *
 *   ● Analyser · array mode                                   ⌄
 *     last row 12 s ago · 8 chambers in array
 *   ┌ CO₂ 438 ppm   CH₄ 2.11 ppm   N₂O 338 ppb   H₂O 14.2 mmol ┐
 *   │ CHAMBERID  LID  FAN  MODE  AVSD  TOTALSD  CO₂ FLUX        │
 *   │ CH-01      closed on   Mode2 1.84  4.20     3.41 ↑        │
 *   Show 4 more array chambers
 *
 * The nesting is the point, and it is the `MPVPosition` relationship drawn as
 * layout. The gas strip belongs to the analyser because the analyser is what
 * measures gas; the chambers listed underneath have no gas sensor of their own
 * and appear *inside* the analyser's card because that is literally where their
 * readings come from. Putting them in a sibling card would imply they measure
 * independently, which is the single most important thing about this rig to get
 * right.
 *
 * The flux column is the exception: it is per chamber, computed from the
 * analyser's gas during that chamber's closure.
 */

export interface AnalyserCardProps {
  analyser: Analyser
  /** The gas strip. Four cells in the wireframe. */
  stats: Stat[]
  /** Chambers on the manifold, in position order. */
  chambers: ArrayChamber[]
  columns: Column<ArrayChamber>[]
  /** How many rows to show before truncating. The wireframe shows three. */
  visibleCount?: number
  className?: string
}

export function AnalyserCard({
  analyser,
  stats,
  chambers,
  columns,
  visibleCount = 3,
  className,
}: AnalyserCardProps) {
  const [expanded, setExpanded] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const shown = showAll ? chambers : chambers.slice(0, visibleCount)
  const hidden = chambers.length - shown.length

  return (
    <div
      className={cn(
        'overflow-hidden rounded-panel border border-line-strong bg-surface shadow-panel',
        className,
      )}
    >
      <div className="px-4 py-3">
        <DeviceCardHeader
          status={analyser.status}
          name={analyser.name}
          kind="array mode"
          meta={['last row 12 s ago', `${chambers.length} chambers in array`]}
          expanded={expanded}
          onToggle={() => setExpanded((e) => !e)}
        />
      </div>

      {expanded && (
        <>
          <StatStrip size="sm" stats={stats} />
          <DataTable rows={shown} rowKey={(c) => c.id} columns={columns} />
          {hidden > 0 && (
            <div className="border-t border-line">
              <ShowMoreRow onClick={() => setShowAll(true)}>
                Show {hidden} more array chamber{hidden === 1 ? '' : 's'}
              </ShowMoreRow>
            </div>
          )}
        </>
      )}
    </div>
  )
}
