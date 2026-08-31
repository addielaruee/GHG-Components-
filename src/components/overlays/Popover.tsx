import { useEffect, useId, useRef } from 'react'
import { IconButton } from '@/components/primitives/IconButton'
import { CloseIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'

/**
 * Popover
 *
 * A small panel anchored to the thing that opened it: the line-colour picker in
 * the dashboard editor, the device card on a map pin, the range dropdown.
 *
 * **Positioned in flow, not portalled**, which is the same choice `Select`
 * made, for the same reason: a portal needs the anchor measured and the result
 * re-measured on every scroll and resize, and the wireframe never opens one of
 * these anywhere that a normal absolutely-positioned panel cannot reach.
 *
 * ⚠️ **A container holding a Popover must not clip.** `overflow-hidden` or
 * `overflow-auto` anywhere up the tree will cut the panel off. This is the
 * single most likely way to break it, and it is why `Card` carries a note
 * telling you not to add `overflow-hidden` to it.
 *
 * Unlike `Modal` this does not trap focus. A popover is not modal: the page
 * behind it stays live and tabbing out of it should simply move on. It does
 * close on Escape and on a click outside, because both are what a reader
 * expects and neither is what the browser does for free here.
 */

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

export interface PopoverProps {
  open: boolean
  onClose: () => void
  /** Optional heading. Gets the close button and a hairline beneath. */
  title?: React.ReactNode
  /** The actions row, e.g. Cancel and Apply. */
  footer?: React.ReactNode
  placement?: PopoverPlacement
  /** Widths in the wireframe run 200-260px. */
  width?: number
  children: React.ReactNode
  className?: string
}

const placements: Record<PopoverPlacement, string> = {
  'bottom-start': 'top-full left-0 mt-1.5',
  'bottom-end': 'top-full right-0 mt-1.5',
  'top-start': 'bottom-full left-0 mb-1.5',
  'top-end': 'bottom-full right-0 mb-1.5',
}

export function Popover({
  open,
  onClose,
  title,
  footer,
  placement = 'bottom-start',
  width = 220,
  children,
  className,
}: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const onPointerDown = (event: PointerEvent) => {
      const panel = ref.current
      // `composedPath` rather than `contains`, so a click that lands on a node
      // React has already unmounted still counts as inside.
      if (panel && !event.composedPath().includes(panel)) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    // Capture, so this still runs when a child stops propagation.
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      role="dialog"
      aria-labelledby={title == null ? undefined : titleId}
      style={{ width }}
      className={cn(
        'absolute z-20 rounded-panel border border-line-strong bg-surface shadow-overlay',
        placements[placement],
        className,
      )}
    >
      {title != null && (
        <div className="flex items-start justify-between gap-3 border-b border-line px-3 py-2">
          <p id={titleId} className="text-[13px] leading-tight font-semibold text-ink">
            {title}
          </p>
          <IconButton label="Close" size="sm" onClick={onClose} className="-mt-1 -mr-1.5 shrink-0">
            <CloseIcon />
          </IconButton>
        </div>
      )}

      <div className="p-3">{children}</div>

      {footer != null && (
        <div className="flex justify-end gap-2 border-t border-line px-3 py-2.5">{footer}</div>
      )}
    </div>
  )
}
