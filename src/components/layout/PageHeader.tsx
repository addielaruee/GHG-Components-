import { cn } from '@/lib/cn'

/**
 * PageHeader
 *
 * The title bar at the top of a screen. Six of the ten wireframe screens have
 * one, and between them they use every slot here:
 *
 *   Devices        title, then the view toggle and "+ Add chamber"
 *   Add chamber    title, the device search inline, then toggle and button
 *   Dashboard      title, then "Export"
 *   Edit dashboard title, "unsaved changes" beside it, then Discard and Save
 *
 * Measured from the wireframe: 52px tall, 20px of horizontal padding.
 *
 * It deliberately draws no bottom border of its own. In the wireframe that
 * hairline stops at the sidebar rather than crossing the window, which only
 * AppShell is in a position to know, so AppShell owns it. Using PageHeader
 * outside AppShell means supplying the border with it.
 */

export interface PageHeaderProps {
  title: React.ReactNode
  /**
   * Quiet text beside the title, for state rather than description. The
   * wireframe's only use is "unsaved changes" on the dashboard editor.
   */
  meta?: React.ReactNode
  /**
   * Sits with the title in the left cluster. The Add-chamber screen puts the
   * device search here, which reads as part of the page rather than as an
   * action.
   */
  children?: React.ReactNode
  /** Right-aligned controls: view toggles, primary actions. */
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, meta, children, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        // min-h rather than a fixed height: an action group that wraps on a
        // narrow window should push the bar taller, not spill out of it.
        'flex min-h-13 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-2',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="truncate text-base font-semibold tracking-[-0.012em] text-ink">{title}</h1>
        {meta != null && <span className="shrink-0 text-[13px] text-ink/50">{meta}</span>}
        {children}
      </div>

      {actions != null && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
