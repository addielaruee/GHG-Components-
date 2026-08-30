import { cn } from '@/lib/cn'

/**
 * AppShell
 *
 * The frame every screen sits inside: a sidebar down the left, page content to
 * the right of it. Present on all ten wireframe screens.
 *
 * Measured from the wireframe: a 196px sidebar on the canvas tint, a single
 * hairline separating it, and white content. That is the macOS arrangement
 * rather than the web default, and it is the right way round: the sidebar is
 * furniture and recedes, the data is the white page you actually read.
 *
 * Three structural decisions:
 *
 * 1. **Only the content scrolls.** The shell owns the viewport height and the
 *    two columns scroll independently, so navigation never scrolls away from a
 *    researcher part-way down a 23-row device table.
 * 2. **The header is a slot, not part of the scroll.** In the wireframe the
 *    page title and its controls sit above the content with their own hairline.
 *    Pinning them means the Cards/Table/Map toggle and "+ Add chamber" stay
 *    reachable at any scroll position.
 * 3. **The header's hairline stops at the sidebar**, exactly as the wireframe
 *    draws it. It belongs to the content column, not the window.
 */

export interface AppShellProps {
  /** The left column. Normally `SidebarNav`. */
  sidebar: React.ReactNode
  /** Pinned above the scrolling content. Normally `PageHeader`. */
  header?: React.ReactNode
  children: React.ReactNode
  /**
   * Fill the parent instead of the viewport. For embedding the shell in a
   * preview or a test; the real app wants the default.
   */
  bounded?: boolean
  className?: string
}

export function AppShell({ sidebar, header, children, bounded, className }: AppShellProps) {
  return (
    <div
      className={cn(
        'relative flex overflow-hidden bg-surface',
        bounded ? 'h-full' : 'h-dvh',
        className,
      )}
    >
      {/* Keyboard users should not have to tab through navigation on every
          screen to reach the data.

          Parked above the frame and slid in on focus, rather than toggled with
          sr-only. `sr-only` and `focus:not-sr-only` both set position, width and
          height, and which one wins is decided by Tailwind's ordering rather
          than ours, so the link stayed 1x1 and invisible even while focused.
          Reveals on plain `:focus`, not `:focus-visible`. A skip link is only
          ever reached by keyboard, and `:focus-visible` does not match a
          programmatic focus() call, which makes it untestable for no gain. */}
      <a
        href="#main"
        className={cn(
          'absolute left-3 z-50 -top-12 focus:top-3',
          'rounded-control border border-accent bg-surface shadow-panel',
          'px-3 py-1.5 text-sm font-medium text-accent',
          'transition-[top] duration-150 outline-none',
        )}
      >
        Skip to content
      </a>

      <aside
        className={cn(
          'flex w-sidebar shrink-0 flex-col overflow-y-auto',
          'border-r border-line bg-canvas',
        )}
      >
        {sidebar}
      </aside>

      {/* min-w-0 so a wide table inside can scroll itself rather than pushing
          the whole layout sideways. */}
      <div className="flex min-w-0 flex-1 flex-col">
        {header && <div className="shrink-0 border-b border-line bg-surface">{header}</div>}
        <main id="main" className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
