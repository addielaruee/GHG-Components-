import { IconButton } from '@/components/primitives/IconButton'
import { MetaList } from '@/components/primitives/MetaList'
import { StatusDot, type Status } from '@/components/primitives/StatusDot'
import { ChevronDownIcon } from '@/components/primitives/icons'

/**
 * DeviceCardHeader
 *
 * The top band shared by every card in the card view, whether it is a
 * standalone chamber, the analyser, or a device collapsed to one row:
 *
 *   ● CH-S21 · standalone                                            ⌄
 *     192.168.1.51 · last row 2 min ago
 *
 * Extracted because all three cards draw it identically and the alternative is
 * three copies drifting apart. It is not in the inventory as its own entry; it
 * is the seam between the ones that are.
 *
 * The status dot is decorative here. The meta line beneath already says
 * "unreachable since 09:14" or "last row 2 min ago", so a screen reader
 * announcing "Not responding" as well is repetition.
 */

export interface DeviceCardHeaderProps {
  status: Status
  name: React.ReactNode
  /** The device kind, shown after the name: "standalone", "array mode". */
  kind?: React.ReactNode
  /** Facts beneath the name, joined with a middot. */
  meta?: React.ReactNode[]
  /** Sits left of the chevron. The wireframe puts a "No response" badge here. */
  aside?: React.ReactNode
  expanded?: boolean
  onToggle?: () => void
}

export function DeviceCardHeader({
  status,
  name,
  kind,
  meta,
  aside,
  expanded,
  onToggle,
}: DeviceCardHeaderProps) {
  return (
    <div className="flex items-start gap-2.5">
      {/* mt-1 rather than items-center: the dot belongs to the name on the
          first line, not to the block as a whole. */}
      <StatusDot status={status} label={null} className="mt-1" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-sm font-semibold tracking-[-0.006em] text-ink">{name}</span>
          {kind != null && <span className="text-sm text-ink/55">· {kind}</span>}
        </div>
        {meta && <MetaList items={meta} className="mt-0.5 block text-[13px]" />}
      </div>

      {aside}

      {onToggle && (
        <IconButton
          label={expanded ? 'Collapse card' : 'Expand card'}
          size="sm"
          onClick={onToggle}
          className="-mt-0.5 -mr-1"
        >
          <ChevronDownIcon className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'} />
        </IconButton>
      )}
    </div>
  )
}
