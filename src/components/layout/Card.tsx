import { cn } from '@/lib/cn'

/**
 * Card
 *
 * The bordered white box most things sit in: a device in the card view, a chart
 * on the flux summary and the chamber pages, the analyser with its nested
 * chamber table.
 *
 * Measured from the wireframe: a 1px border, white fill, sitting on a 20px
 * gutter. The radius is raised from the wireframe's 6px to the panel token's
 * 12px, and a short-range shadow is added, which is the same finish applied
 * everywhere else in the library.
 *
 * `header` and `footer` exist because the wireframe's cards are consistently
 * three bands: a title row, the body, and a summary line. Drawing those
 * hairlines here keeps every card's internal rhythm identical instead of each
 * caller inventing its own.
 *
 * **Do not add `overflow-hidden` to this component.** It would clip an open
 * Select menu, which is positioned in flow rather than portalled. A card
 * holding a form is exactly where that would happen.
 */

export interface CardProps {
  /** Title row. Gets a hairline beneath it. */
  header?: React.ReactNode
  /** Summary row. Gets a hairline above it. */
  footer?: React.ReactNode
  /**
   * Drop the body padding, for content that should reach the card's edges:
   * the analyser's chamber table, and full-bleed charts.
   */
  flush?: boolean
  children: React.ReactNode
  className?: string
}

export function Card({ header, footer, flush, children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-panel border border-line bg-surface shadow-panel',
        className,
      )}
    >
      {header != null && <div className="border-b border-line px-4 py-3">{header}</div>}
      <div className={cn(!flush && 'p-4')}>{children}</div>
      {footer != null && <div className="border-t border-line px-4 py-2.5">{footer}</div>}
    </div>
  )
}
