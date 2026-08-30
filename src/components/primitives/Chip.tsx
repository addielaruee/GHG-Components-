import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Chip
 *
 * A toggle for one measurement channel, used in the "Channels" row on the
 * chamber and array-chamber pages: Chamber_Temp_C, Chamber_RH_%,
 * Chamber_Pressure_Pa, SoilM_Raw, avSD, totalSD, UsedSD and the rest.
 *
 * This is the client's requirement that users can choose which measurements
 * they see, in its smallest form.
 *
 * Three states, and the third is specific to this project. Chambers are built
 * from different sensor kits, so a channel can exist in the schema while that
 * chamber has no sensor for it. The array-chamber page shows
 * "SoilT_C · not fitted" greyed out. That is not the same as a channel being
 * available but switched off, and the UI has to say so rather than hiding it,
 * or a researcher will assume the sensor is broken.
 *
 * It is a toggle button, so it carries `aria-pressed` rather than pretending to
 * be a checkbox.
 */

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Whether this channel is currently plotted. */
  active?: boolean
  children: React.ReactNode
}

export function Chip({ active = false, disabled, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center rounded-full border',
        'h-6 px-2.5 text-xs font-medium tracking-[-0.005em] whitespace-nowrap',
        'transition-colors duration-150',
        'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
        'active:scale-[0.96] active:duration-75',
        active
          ? 'border-accent/55 bg-accent/12 text-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]'
          : 'border-line-strong bg-surface text-ink/65 hover:border-ink/25 hover:text-ink',
        // Not merely off: this chamber has no such sensor. Kept legible rather
        // than faded to nothing, because it is information.
        disabled &&
          'pointer-events-none border-line bg-ink/[0.02] text-ink/30 active:scale-100',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
