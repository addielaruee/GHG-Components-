import { MetaList } from '@/components/primitives/MetaList'
import { StatusDot, type Status } from '@/components/primitives/StatusDot'
import { cn } from '@/lib/cn'

/**
 * DetailHeader
 *
 * The top block of a device page, on all three detail screens. Taken straight
 * from the wireframe, which lays it out in three bands:
 *
 *   Devices / Analyser / CH-01
 *   ● CH-01  [Array chamber] [read-only]      Rename  Open analyser  Export
 *   Reported by Analyser · array position 1 of 8 · Location: inherits analyser
 *
 * `meta` takes an array rather than a string, and MetaList joins it with the
 * middot. Every one of those lines is a list of unrelated facts, and having
 * callers hand-write the separator is how three pages end up with three
 * spacings around it. TableSectionHeader needs the same thing, which is why the
 * joining lives in its own component rather than here.
 *
 * The status dot here keeps its accessible label, unlike in the card and table
 * views. There the surrounding text already says "unreachable since 09:14", so
 * the dot is decorative. Here it is the only thing on the page stating whether
 * the device is alive, so it has to speak.
 */

export interface DetailHeaderProps {
  /** Usually `<Breadcrumb>`. Sits above everything else. */
  breadcrumb?: React.ReactNode
  /** Renders the status bead beside the name. */
  status?: Status
  title: React.ReactNode
  /** Usually `<Badge>`s: "Array chamber", "read-only", "Array mode · 8 chambers". */
  badges?: React.ReactNode
  /** Facts about the device, joined with a middot. */
  meta?: React.ReactNode[]
  actions?: React.ReactNode
  className?: string
}

export function DetailHeader({
  breadcrumb,
  status,
  title,
  badges,
  meta,
  actions,
  className,
}: DetailHeaderProps) {
  return (
    <div className={cn('px-5 py-4', className)}>
      {breadcrumb != null && <div className="mb-2">{breadcrumb}</div>}

      {/* items-start so the action group sits level with the name, not centred
          against the meta line beneath it. */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            {status && <StatusDot status={status} size="lg" />}
            <h1 className="truncate text-xl font-semibold tracking-[-0.015em] text-ink">{title}</h1>
            {badges}
          </div>

          {meta && meta.length > 0 && (
            <p className="mt-1.5">
              <MetaList items={meta} className="text-[13px]" />
            </p>
          )}
        </div>

        {actions != null && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
