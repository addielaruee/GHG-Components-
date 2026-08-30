import { MetaList } from '@/components/primitives/MetaList'
import { cn } from '@/lib/cn'

/**
 * BulkActionBar
 *
 * The strip above the device tables:
 *
 *   2 selected  [Rename] [Remove]   23 devices · latest record
 *
 * Measured from the wireframe: 40px tall, and tinted a very pale blue
 * (#f8fbff) rather than left white. That tint is the point. Bulk actions are
 * the one place in this dashboard where a click changes several devices at
 * once, and the bar changing colour is what stops "Remove" being pressed
 * without noticing that six rows are ticked rather than one.
 *
 * The bar itself is always present, because it carries the collection's count
 * whether or not anything is selected. Only the tint and the actions come and
 * go, so the table below never shifts up and down as rows are ticked.
 *
 * Everything is left-aligned, following the wireframe. The count, the actions
 * and the meta read as one sentence about the current state, and pushing the
 * meta to the right edge would break that reading.
 */

export interface BulkActionBarProps {
  /** How many rows are ticked. Zero hides the tint and the actions. */
  selectedCount: number
  /** Shown only while something is selected. Usually small Buttons. */
  actions?: React.ReactNode
  /** Always shown, e.g. `['23 devices', 'latest record']`. */
  meta?: React.ReactNode[]
  className?: string
}

export function BulkActionBar({
  selectedCount,
  actions,
  meta,
  className,
}: BulkActionBarProps) {
  const hasSelection = selectedCount > 0

  return (
    <div
      className={cn(
        'flex min-h-10 flex-wrap items-center gap-x-3 gap-y-2 border-y px-5 py-1.5',
        'transition-colors duration-150',
        hasSelection ? 'border-line bg-accent/[0.04]' : 'border-line bg-surface',
        className,
      )}
    >
      {hasSelection && (
        // Announced when it changes, so a screen-reader user ticking rows hears
        // the count without having to go looking for it.
        <span aria-live="polite" className="text-[13px] font-medium text-ink">
          {selectedCount} selected
        </span>
      )}

      {hasSelection && actions != null && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}

      {meta && <MetaList items={meta} className="text-[13px]" />}
    </div>
  )
}
