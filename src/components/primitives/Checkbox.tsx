import { useEffect, useRef, type InputHTMLAttributes } from 'react'
import { CheckIcon, DashIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'

/**
 * Checkbox
 *
 * Used in three places in the wireframe: choosing which chambers a chart shows
 * (Flux summary legend and the dashboard editor), selecting table rows for
 * bulk rename or removal, and the select-all header on those tables.
 *
 * That last one is why `indeterminate` matters. With 23 devices and a few
 * selected, the header has to say "some" rather than lying in either
 * direction.
 */

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * The "some but not all" state, for a select-all header. Visual only: the
   * underlying input stays unchecked, which is what the HTML spec says an
   * indeterminate box is.
   */
  indeterminate?: boolean
  /** Text beside the box. Omit for a bare box in a table cell. */
  label?: React.ReactNode
  size?: 'sm' | 'md'
}

const sizes = {
  sm: { box: 'size-3.5', icon: 'size-3', text: 'text-[13px]' },
  md: { box: 'size-4', icon: 'size-3.5', text: 'text-sm' },
}

export function Checkbox({
  indeterminate = false,
  label,
  size = 'md',
  className,
  disabled,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)

  // `indeterminate` exists only as a DOM property. There is no attribute for
  // it, so React cannot set it from JSX and it has to be written by hand.
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  const s = sizes[size]

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 select-none',
        disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer',
        className,
      )}
    >
      <span className="relative inline-flex shrink-0">
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'peer appearance-none rounded-[5px] border transition-colors duration-150',
            'border-line-strong bg-linear-to-b from-surface to-surface-hi shadow-control',
            'checked:border-accent checked:from-accent-hi checked:to-accent checked:shadow-control-accent',
            'indeterminate:border-accent indeterminate:from-accent-hi indeterminate:to-accent',
            'indeterminate:shadow-control-accent',
            'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
            'disabled:pointer-events-none',
            s.box,
          )}
          {...props}
        />
        {/* Indeterminate wins over checked, matching how the browser treats it. */}
        <CheckIcon
          className={cn(
            'pointer-events-none absolute inset-0 m-auto text-white opacity-0',
            'peer-checked:opacity-100 peer-indeterminate:opacity-0',
            s.icon,
          )}
        />
        <DashIcon
          className={cn(
            'pointer-events-none absolute inset-0 m-auto text-white opacity-0',
            'peer-indeterminate:opacity-100',
            s.icon,
          )}
        />
      </span>
      {label != null && <span className={cn('text-ink', s.text)}>{label}</span>}
    </label>
  )
}
