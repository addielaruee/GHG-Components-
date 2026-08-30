import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Button
 *
 * The clickable action used across the whole dashboard.
 *
 * The wireframe uses exactly two treatments, so this component offers exactly
 * two and no more:
 *
 *   primary:   solid dark. The single most important action on a screen.
 *               "Export raw data", "+ Add chamber", "Save layout", "Apply".
 *   secondary: white with a hairline border. Everything else.
 *               "Rename", "Edit device", "Discard", "Cancel", "Test connection".
 *
 * Structure and colour follow the wireframe. The finish does not: a fine
 * top-to-bottom gradient, an inset highlight along the top edge, soft
 * elevation, and a spring on press. Those four things are what separate a
 * control that looks default from one that looks designed.
 */

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Defaults to `secondary`. See the note below. */
  variant?: Variant
  /** `md` for page and dialog actions, `sm` for dense rows like the bulk-action bar. */
  size?: Size
}

const base = [
  'inline-flex items-center justify-center gap-1.5',
  'rounded-control border font-medium whitespace-nowrap tracking-[-0.006em]',
  'cursor-pointer select-none',

  // Colour and elevation ease; the press scale is quicker so it feels snappy
  // rather than sluggish.
  'transition-[background-color,box-shadow,border-color,transform] duration-150 ease-out',
  'active:duration-75',

  // Focus ring: a soft accent glow rather than a hard outline. Researchers tab
  // through long device tables, so this has to stay clearly visible.
  'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
  'focus-visible:border-accent',

  'disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none',
].join(' ')

const variants: Record<Variant, string> = {
  primary: [
    'border-transparent text-white',
    'bg-linear-to-b from-ink-hi to-ink',
    'shadow-control-solid',
    'hover:from-ink-hover-hi hover:to-ink-hover',
    // Pressed: flatten the gradient and drop the lift, as if the surface has
    // been pushed in.
    'active:from-ink active:to-ink active:shadow-none active:scale-[0.97]',
  ].join(' '),

  secondary: [
    'border-line-strong text-ink',
    'bg-linear-to-b from-surface to-surface-hi',
    'shadow-control',
    'hover:from-surface-hi hover:to-surface-lo',
    'active:from-surface-lo active:to-surface-lo active:shadow-none active:scale-[0.97]',
  ].join(' '),
}

// Height comes from the shared control tokens, not from padding, so every
// control in a row lines up exactly.
const sizes: Record<Size, string> = {
  sm: 'h-control-sm px-3 text-[13px]',
  md: 'h-control-md px-3.5 text-sm',
}

/**
 * Note on the default variant.
 *
 * It is `secondary`, not `primary`, which is the opposite of most component
 * libraries. That is on purpose: the wireframe gives each screen one dark
 * button and makes everything else outlined. Defaulting to secondary means
 * reaching for emphasis is a deliberate act, so screens do not drift into a row
 * of competing dark buttons.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      // Buttons inside a <form> default to type="submit", which submits the form
      // on any click. Defaulting to "button" avoids that; pass type="submit"
      // explicitly on the one button that should submit.
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
