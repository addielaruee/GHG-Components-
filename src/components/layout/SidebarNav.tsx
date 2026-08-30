import { cn } from '@/lib/cn'

/**
 * SidebarNav
 *
 * The contents of AppShell's left column: the product name, then the two
 * sections the whole app has. Present on all ten wireframe screens.
 *
 * **Only two items, and it should stay that way.** Everything else in the
 * wireframe is a toggle, a tab or a drill-down. That flatness is the best thing
 * about the information architecture, and a sidebar is where apps go to grow a
 * dozen links they did not need.
 *
 * The selected row is taken from the wireframe: a 3px accent rail down the left
 * edge and a full-bleed tinted row, rather than an inset rounded pill. That is
 * the macOS source-list treatment. The rail matters more than it looks: it
 * reads as the row being attached to the content beside it, and it survives
 * being seen out of the corner of the eye, which a subtle background alone
 * does not.
 *
 * Items are buttons, not links, because there is no router yet and no URLs to
 * point at. `<a href>` would trigger a full page load and break the app. When
 * the team picks a router, this component is the one place that changes.
 */

export interface SidebarNavItem {
  /** Matches the value passed as `value`. */
  id: string
  label: string
  /** 16px glyph. See `DashboardIcon` and `DeviceIcon`. */
  icon?: React.ReactNode
}

export interface SidebarNavProps {
  items: SidebarNavItem[]
  /** Id of the current section. */
  value: string
  onChange: (id: string) => void
  /** Product name at the top. Defaults to the client's. */
  brand?: React.ReactNode
  /** Describes the group for screen readers. */
  ariaLabel?: string
  className?: string
}

export function SidebarNav({
  items,
  value,
  onChange,
  brand = 'GHG Monitor',
  ariaLabel = 'Sections',
  className,
}: SidebarNavProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="px-4 py-3.5 text-[13px] font-semibold tracking-[-0.01em] text-ink">
        {brand}
      </div>

      <nav aria-label={ariaLabel}>
        {items.map((item) => {
          const selected = item.id === value
          return (
            <button
              key={item.id}
              type="button"
              // `page` rather than `true`: this is the section currently shown,
              // which is what a screen reader should announce.
              aria-current={selected ? 'page' : undefined}
              onClick={() => onChange(item.id)}
              className={cn(
                'relative flex h-control-md w-full cursor-pointer items-center gap-2.5',
                'px-4 text-left text-[13px] tracking-[-0.006em]',
                'transition-colors duration-150',
                'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/35 focus-visible:ring-inset',
                selected
                  ? 'bg-ink/[0.08] font-medium text-ink'
                  : 'text-ink/65 hover:bg-ink/[0.04] hover:text-ink',
              )}
            >
              {/* The rail. Drawn on the row rather than as a border so the row
                  itself stays flush with the sidebar's edges. */}
              {selected && (
                <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
              )}
              {item.icon && (
                <span
                  aria-hidden
                  className={cn('flex shrink-0 [&_svg]:size-4', selected ? 'text-ink' : 'text-ink/45')}
                >
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
