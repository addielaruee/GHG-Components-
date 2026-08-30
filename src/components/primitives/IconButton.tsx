import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * IconButton
 *
 * A square button holding a single glyph. In the wireframe: the chevron that
 * collapses a device card, the close on the add-chamber dialog, the map's zoom
 * controls, and the table's pagination arrows.
 *
 * Two variants because the wireframe uses two: `ghost` for controls that sit
 * inside a surface and should stay quiet until hovered, `outline` for ones
 * floating over the map or anchoring a table footer.
 *
 * `label` is required, not optional. An icon-only control with no accessible
 * name is invisible to a screen reader, and making it a required prop is the
 * cheapest way to stop that shipping.
 */

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible name, e.g. "Collapse card", "Close", "Zoom in". */
  label: string
  children: React.ReactNode
  variant?: 'ghost' | 'outline'
  size?: 'sm' | 'md'
}

const variants = {
  // Quiet, but not so faint it reads as disabled.
  ghost: 'border-transparent text-ink/70 hover:bg-ink/[0.07] hover:text-ink active:bg-ink/[0.11]',
  outline: [
    'border-line-strong text-ink/70 shadow-control',
    'bg-linear-to-b from-surface to-surface-hi',
    'hover:from-surface-hi hover:to-surface-lo hover:text-ink',
    'active:from-surface-lo active:to-surface-lo active:shadow-none',
  ].join(' '),
}

// Square, and exactly as tall as a Button of the same size.
const sizes = {
  sm: 'size-control-sm [&_svg]:size-3.5',
  md: 'size-control-md [&_svg]:size-4',
}

export function IconButton({
  label,
  children,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center',
        'rounded-control border transition-colors duration-150',
        'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
        'active:scale-[0.94] active:duration-75',
        'disabled:pointer-events-none disabled:opacity-40',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
