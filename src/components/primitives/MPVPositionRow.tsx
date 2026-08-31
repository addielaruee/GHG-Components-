import { cn } from '@/lib/cn'

/**
 * MPVPositionRow
 *
 * The valve position picker on the analyser page: one button per chamber the
 * manifold can select, drawn as a joined row with the current one filled.
 *
 * Not `SegmentedControl`, which is a pill with a sliding thumb over a recessed
 * track. This is a row of squares sharing their edges, which is what the
 * wireframe draws and the right shape for eight of them: a thumb sliding across
 * eight positions is a lot of motion for picking a number.
 *
 * **Positions are chamber numbers, and the range matters.** `MPVPosition` in
 * the analyser file runs past 8, but 9 and above are calibration gas and
 * background air rather than chambers, confirmed by the client on 26 Aug. This
 * component takes the positions it should offer instead of generating 1..n, so
 * a caller that knows the array skips a position can leave it out rather than
 * offering a button for a chamber that is not there.
 *
 * The selected fill is the library's accent, not the wireframe's lighter blue.
 * Every other selected control here is that accent, and one control using a
 * different blue reads as a mistake. Worth mentioning at a design review.
 */

export interface MPVPositionRowProps {
  /** The positions to offer, in order. Chambers only, never 9 or above. */
  positions: number[]
  value: number | null
  onChange: (position: number) => void
  /** Positions the array has but that are not reporting. Shown, not hidden. */
  unavailable?: ReadonlySet<number>
  /** The label before the row. Pass null to drop it. */
  label?: React.ReactNode
  className?: string
}

export function MPVPositionRow({
  positions,
  value,
  onChange,
  unavailable,
  label = 'MPVPosition',
  className,
}: MPVPositionRowProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {label != null && <span className="text-xs text-ink/55">{label}</span>}

      {/* One group, so a screen reader announces eight related buttons rather
          than eight loose numbers. */}
      <div role="group" aria-label="Valve position" className="flex">
        {positions.map((position, index) => {
          const selected = position === value
          const off = unavailable?.has(position) ?? false

          return (
            <button
              key={position}
              type="button"
              aria-pressed={selected}
              disabled={off}
              title={off ? `Position ${position} is not reporting` : undefined}
              onClick={() => onChange(position)}
              className={cn(
                'h-control-md w-8 cursor-pointer border text-[13px] font-medium tabular-nums',
                'transition-[background-color,border-color,color] duration-150 ease-out',
                'outline-none focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-accent/30',
                // Shared edges: only the first draws a left border, and the
                // outer corners are the only rounded ones.
                index > 0 && '-ml-px',
                index === 0 && 'rounded-l-control',
                index === positions.length - 1 && 'rounded-r-control',
                // Never set a colour here that a state below has to change.
                selected
                  ? 'z-10 border-accent bg-accent text-white shadow-control-accent'
                  : off
                    ? 'border-line-strong bg-surface-lo text-ink/25'
                    : 'border-line-strong bg-surface text-ink/75 hover:bg-surface-lo hover:text-ink',
              )}
            >
              {position}
            </button>
          )
        })}
      </div>
    </div>
  )
}
