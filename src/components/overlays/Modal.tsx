import { useEffect, useId, useRef } from 'react'
import { IconButton } from '@/components/primitives/IconButton'
import { CloseIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'

/**
 * Modal
 *
 * The dialog shell. `AddChamberDialog` is the one the wireframe draws; anything
 * destructive enough to need confirming will want it too.
 *
 * **Built on the native `<dialog>` element**, which is the whole reason this is
 * short. The browser gives us the focus trap, the initial focus, Escape to
 * close, inertness for everything behind it and a top-layer backdrop that no
 * `z-index` on the page can beat. A hand-rolled version of that is a few
 * hundred lines and is usually subtly wrong, most often by letting Tab escape
 * into the page underneath.
 *
 * `open` is a prop rather than internal state: whether the dialog is showing is
 * a fact about the screen, not about this component, and the screen is what
 * knows whether the form behind it is dirty.
 *
 * **Clicking the backdrop closes it**, which needs care: a click on the
 * backdrop reports the `<dialog>` itself as its target, because the backdrop is
 * not a node you can listen to. Comparing the target against the dialog is what
 * separates it from a click on the panel inside.
 */

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  /** A line under the title, for what the dialog needs from the reader. */
  description?: React.ReactNode
  /** The actions row. Put the primary action last, as the wireframe does. */
  footer?: React.ReactNode
  /** Set false for a dialog the reader must answer rather than dismiss. */
  dismissible?: boolean
  size?: 'sm' | 'md'
  children: React.ReactNode
  className?: string
}

const sizes = { sm: 'max-w-sm', md: 'max-w-md' }

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  dismissible = true,
  size = 'md',
  children,
  className,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    // showModal on an already-open dialog throws, and so does close on a
    // closed one, so both are guarded rather than called blind.
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        // Escape. Cancelled when the dialog must be answered, otherwise the
        // browser closes it behind the caller's back and `open` goes stale.
        event.preventDefault()
        if (dismissible) onClose()
      }}
      onClick={(event) => {
        if (dismissible && event.target === ref.current) onClose()
      }}
      className={cn(
        'm-auto w-[calc(100vw-2rem)] rounded-panel border border-line-strong bg-surface p-0',
        'text-ink shadow-overlay backdrop:bg-ink/25',
        sizes[size],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <h2 id={titleId} className="text-[15px] leading-tight font-semibold text-ink">
            {title}
          </h2>
          {description != null && <p className="mt-1 text-xs text-ink/55">{description}</p>}
        </div>
        {dismissible && (
          <IconButton label="Close" onClick={onClose} className="-mt-1 -mr-1.5 shrink-0">
            <CloseIcon />
          </IconButton>
        )}
      </div>

      <div className="px-5 pb-4">{children}</div>

      {footer != null && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">
          {footer}
        </div>
      )}
    </dialog>
  )
}
