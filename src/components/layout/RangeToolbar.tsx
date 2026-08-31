import { Button } from '@/components/primitives/Button'
import { ResetIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'

/**
 * RangeToolbar
 *
 * The filter strip under a page header. The 31 Aug wireframe puts the same one
 * on the dashboard, the analyser and both chamber pages, which makes it the
 * most repeated control in the design.
 *
 *   MPVPosition [1][2]..[8]   Range [Last 24 h ▾]  20 Aug 15:00 - 21 Aug 15:00  [↺ Reset filters]
 *
 * **It replaced two controls that are now gone**: the `Live | History` toggle
 * and the `1 min / 5 min / 30 min` averaging presets. That is a real change of
 * model, not a reshuffle. The old pair said "show me the present, or the past,
 * at this resolution"; this one says "show me exactly this window", and
 * averaging became a fixed property of each chart instead of a thing the reader
 * chooses. Anything written against the old model is stale.
 *
 * **The resolved window is printed as plain text beside the picker**, and that
 * is the part worth keeping. "Last 24 h" is a rule, not a window: without the
 * dates spelled out, two people reading the same screen an hour apart are
 * looking at different data and cannot tell.
 *
 * This owns the strip, not the picker. `RangePicker` goes in the `picker` slot
 * once the client has confirmed the retention, since the Absolute tab has to
 * say what has aged off.
 */

export interface RangeToolbarProps {
  /** Before the range control, e.g. the analyser's `MPVPositionRow`. */
  leading?: React.ReactNode
  /** The range control itself. `RangePicker`, when it exists. */
  picker?: React.ReactNode
  /** The window the picker resolved to, spelled out. */
  window?: React.ReactNode
  /** Omit to hide the reset button. */
  onReset?: () => void
  resetLabel?: React.ReactNode
  /** Pushed to the far right, e.g. the analyser's legend note. */
  trailing?: React.ReactNode
  className?: string
}

export function RangeToolbar({
  leading,
  picker,
  window,
  onReset,
  resetLabel = 'Reset filters',
  trailing,
  className,
}: RangeToolbarProps) {
  return (
    <div
      // Not `overflow-hidden`, whatever the temptation on a strip that can
      // wrap: the picker opens a panel downward out of this element.
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2',
        'border-b border-line bg-surface px-5 py-2.5',
        className,
      )}
    >
      {leading}

      {picker != null && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink/55">Range</span>
          {picker}
        </div>
      )}

      {window != null && (
        <p className="text-xs tabular-nums text-ink/55">{window}</p>
      )}

      {onReset && (
        <Button size="sm" onClick={onReset}>
          <ResetIcon />
          {resetLabel}
        </Button>
      )}

      {trailing != null && <div className="ml-auto">{trailing}</div>}
    </div>
  )
}
