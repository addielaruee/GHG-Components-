import { cn } from '@/lib/cn'

/**
 * EmptyValue
 *
 * The em dash shown where a reading should be. The smallest component in the
 * library and one of the more important ones.
 *
 * The client's files are full of holes: columns for sensors that were never
 * fitted, hours lost when a Raspberry Pi lost power mid-write, whole devices
 * that stop answering. A table of 23 devices will always have gaps in it.
 *
 * The rule this component exists to enforce: **a missing reading is never a
 * zero**. Rendering `0` where there is no measurement is not a cosmetic
 * mistake, it is a false data point in a scientific instrument, and it would be
 * indistinguishable from a real reading of zero flux. Use this instead, every
 * time.
 */

export interface EmptyValueProps {
  /**
   * Why the value is missing, when the screen knows. Announced to screen
   * readers in place of the dash, which would otherwise be read as punctuation
   * or skipped entirely.
   */
  reason?: string
  className?: string
}

export function EmptyValue({ reason = 'No reading', className }: EmptyValueProps) {
  return (
    <span role="img" aria-label={reason} title={reason} className={cn('text-ink/30', className)}>
      {/* An em dash rather than a hyphen: it reads as "absent", not "minus". */}
      —
    </span>
  )
}
