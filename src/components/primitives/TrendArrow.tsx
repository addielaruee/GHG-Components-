import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'

/**
 * TrendArrow
 *
 * The small arrow beside a flux value in the card and table views: "3.41 ↑",
 * "2.87 ↓", "4.62 →".
 *
 * Deliberately not coloured. It is tempting to make rising green and falling
 * red, but that would be wrong here: a rising CO₂ flux is not good news or bad
 * news, it is a measurement. Soil emits more when it is warm and wet. Colouring
 * it would assert a judgement the science does not make, so the arrow stays the
 * same weight as the number it follows.
 */

export interface TrendArrowProps {
  direction: 'up' | 'down' | 'flat'
  className?: string
  /** Override the spoken description if the surrounding text needs different wording. */
  label?: string
}

const arrows = {
  up: { Icon: ArrowUpIcon, label: 'rising' },
  down: { Icon: ArrowDownIcon, label: 'falling' },
  flat: { Icon: ArrowRightIcon, label: 'steady' },
}

export function TrendArrow({ direction, className, label }: TrendArrowProps) {
  const { Icon, label: defaultLabel } = arrows[direction]

  return (
    <span
      role="img"
      aria-label={label ?? defaultLabel}
      className={cn('inline-flex shrink-0 text-ink/70', className)}
    >
      <Icon className="size-3.5" />
    </span>
  )
}
