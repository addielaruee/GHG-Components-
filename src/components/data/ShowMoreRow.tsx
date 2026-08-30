import { TextLink } from '@/components/primitives/TextLink'
import { cn } from '@/lib/cn'

/**
 * ShowMoreRow
 *
 * Reveals the rest of a truncated list. The wireframe gives it two treatments
 * and they are not interchangeable:
 *
 *   link   inside a container, as the last band of the analyser's card:
 *          "Show 4 more array chambers"
 *   panel  standing between cards in the grid, dashed and centred:
 *          "8 more standalone chambers"
 *
 * The dashed panel is the better one and worth understanding. It occupies the
 * space the hidden cards would have filled, so the grid does not silently look
 * complete when a third of the fleet is missing from it. A researcher counting
 * chambers on screen needs to see that the list is cut short, not infer it.
 */

export interface ShowMoreRowProps {
  children: React.ReactNode
  onClick?: () => void
  /** `link` sits inside a card; `panel` stands in the grid where cards would be. */
  variant?: 'link' | 'panel'
  className?: string
}

export function ShowMoreRow({ children, onClick, variant = 'link', className }: ShowMoreRowProps) {
  if (variant === 'panel') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full cursor-pointer items-center justify-center',
          'rounded-panel border border-dashed border-line-strong px-4 py-5',
          'text-[13px] text-ink/45 transition-colors duration-150',
          'hover:border-accent/40 hover:bg-accent/[0.03] hover:text-accent',
          'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
          className,
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <div className={cn('px-4 py-2.5', className)}>
      <TextLink onClick={onClick}>{children}</TextLink>
    </div>
  )
}
