import { cn } from '@/lib/cn'

/**
 * Breadcrumb
 *
 * The trail above a device's name on the three detail pages:
 *
 *   Devices / CH-S21              a standalone chamber
 *   Devices / Analyser            the analyser
 *   Devices / Analyser / CH-01    a chamber inside the array
 *
 * That third one is the reason this component matters more than a back link
 * would. An array chamber genuinely belongs to the analyser: it has no gas
 * sensor of its own, its readings come from the analyser's feed, and it is
 * read-only for that reason. The trail is where that relationship is visible,
 * so a researcher can see at a glance which kind of chamber they are looking
 * at.
 *
 * Ancestors are buttons rather than links, for the same reason as SidebarNav:
 * there is no router yet and no URLs to point at. Both change together when the
 * team picks one.
 */

export interface BreadcrumbItem {
  id: string
  label: string
}

export interface BreadcrumbProps {
  /** Root first. The last entry is the current page and is never interactive. */
  items: BreadcrumbItem[]
  /** Omit to render a plain, non-interactive trail. */
  onNavigate?: (id: string) => void
  className?: string
}

export function Breadcrumb({ items, onNavigate, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 text-[13px] tracking-[-0.006em]">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={item.id} className="flex items-center gap-x-1.5">
              {/* Decorative. A screen reader announcing "slash" between every
                  step is noise; the list structure already conveys the nesting. */}
              {index > 0 && (
                <span aria-hidden className="text-ink/30 select-none">
                  /
                </span>
              )}

              {isCurrent ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.label}
                </span>
              ) : onNavigate ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'cursor-pointer rounded-[3px] text-ink/55 underline-offset-2',
                    'transition-colors duration-150 hover:text-ink hover:underline',
                    'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
                  )}
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-ink/55">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
