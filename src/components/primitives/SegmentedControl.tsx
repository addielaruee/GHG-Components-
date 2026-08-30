import { useId, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * SegmentedControl
 *
 * A row of mutually exclusive choices. The most reused control in the
 * wireframe, appearing on seven screens:
 *
 *   Average over    1 min | 5 min | 30 min       Flux summary, Chamber detail
 *   View            Cards | Table | Map          every Devices screen
 *   Feed            Live | History               Chamber detail
 *   Device type     Analyser array | Standalone  Edit dashboard
 *   Line style      solid | dashed | dotted      Edit dashboard
 *
 * Built on native radio inputs rather than buttons. That is not incidental: it
 * gives correct semantics, arrow-key navigation and "2 of 3" screen-reader
 * announcements for free, none of which we would get right by hand.
 *
 * Two departures from the wireframe, both deliberate:
 *   - the selected segment is inset inside the track rather than flush to its
 *     edges, so it reads as a pill resting on a recessed well;
 *   - it slides between positions instead of jumping.
 * Same structure, same colours, better finish.
 */

export interface SegmentedOption<T extends string> {
  value: T
  /** Usually text, but any node — the line-style control renders rules. */
  label: React.ReactNode
  /** Required when `label` is not readable text, e.g. a rendered line. */
  ariaLabel?: string
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** `md` for page-level controls, `sm` for dense rows. */
  size?: 'sm' | 'md'
  /** Stretch to fill the container, splitting segments equally. */
  fullWidth?: boolean
  /** Describes the group as a whole, e.g. "Averaging interval". */
  ariaLabel?: string
  className?: string
}

const sizes = {
  sm: {
    pad: 'p-[2px]',
    pill: 'top-[2px] bottom-[2px]',
    seg: 'px-2.5 py-[3px] text-[13px]/[18px]',
    radius: 'rounded-[6px]',
  },
  md: {
    pad: 'p-[3px]',
    pill: 'top-[3px] bottom-[3px]',
    seg: 'px-3.5 py-1 text-sm/5',
    radius: 'rounded-[6px]',
  },
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = false,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const name = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const segmentRefs = useRef<Array<HTMLLabelElement | null>>([])

  // Geometry of the sliding pill, measured from the selected segment.
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const activeIndex = options.findIndex((o) => o.value === value)

  useLayoutEffect(() => {
    const track = trackRef.current
    const segment = segmentRefs.current[activeIndex]
    if (!track || !segment) return

    const measure = () => setPill({ left: segment.offsetLeft, width: segment.offsetWidth })
    measure()

    // Labels reflow when the container resizes or a webfont lands, and the pill
    // has to follow. Observing the track covers both.
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [activeIndex, options])

  return (
    <div
      ref={trackRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        'relative isolate inline-flex rounded-control border border-line-strong',
        'bg-surface-lo shadow-track',
        fullWidth && 'flex w-full',
        sizes[size].pad,
        className,
      )}
    >
      {/* The pill. Rendered only once measured, so it never slides in from the
          left on first paint. */}
      {pill && (
        <span
          aria-hidden
          className={cn(
            'absolute left-0 -z-10',
            sizes[size].pill,
            sizes[size].radius,
            'bg-linear-to-b from-accent-hi to-accent shadow-control-accent',
            'transition-[transform,width] duration-200 ease-out',
            'motion-reduce:transition-none',
          )}
          style={{ transform: `translateX(${pill.left}px)`, width: pill.width }}
        />
      )}

      {options.map((option, index) => {
        const selected = option.value === value
        // Apple hides the divider on either side of the selected segment, so
        // the pill never butts against a line.
        const showDivider = index > 0 && index !== activeIndex && index !== activeIndex + 1

        return (
          <label
            key={option.value}
            ref={(el) => {
              segmentRefs.current[index] = el
            }}
            className={cn(
              'relative flex cursor-pointer items-center justify-center font-medium',
              'tracking-[-0.006em] whitespace-nowrap select-none',
              'transition-colors duration-150',
              sizes[size].seg,
              sizes[size].radius,
              fullWidth && 'flex-1',
              selected ? 'text-white' : 'text-ink/65 hover:text-ink',
              option.disabled && 'pointer-events-none opacity-40',
              // Focus ring sits on the label, driven by the hidden input.
              'has-focus-visible:ring-[3px] has-focus-visible:ring-accent/35',
              !selected && 'active:scale-[0.96] active:duration-75',
            )}
          >
            {showDivider && (
              <span aria-hidden className="absolute -left-px h-3.5 w-px bg-line" />
            )}
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              className="sr-only"
              aria-label={option.ariaLabel}
            />
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
