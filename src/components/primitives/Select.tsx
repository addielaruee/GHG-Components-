import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'
import { fieldBorder, fieldFocus, fieldSizes, fieldSurface, type FieldSize } from '@/lib/field'

/**
 * Select
 *
 * Picking one option from a list. In the wireframe this is the variable picker
 * in the dashboard editor ("CO2_ppm (ppm)", "UsedSD (GB)"), whose contents
 * change with the chosen device type. It also covers the client's one explicit
 * UI request: a dropdown listing MPVPosition so a researcher can choose which
 * chamber's data is shown.
 *
 * This was a native <select> first, for the keyboard behaviour and type-ahead
 * that come free with it. It was rebuilt as a listbox for one reason: a native
 * popup is drawn by the operating system, and macOS positions it *over* the
 * control so the selected row lands under the pointer. Next to a second field
 * it covers it completely, and no amount of CSS can move it. Placement is
 * simply not ours to set on a native control.
 *
 * The cost of owning it is that we now own the keyboard too, which is what the
 * rest of this file is. The menu opens anchored to its own trigger, matching
 * its width, and flips above only when there is no room below.
 *
 * One constraint that comes with positioning it in flow rather than portalling
 * it: an ancestor with `overflow: hidden` will clip the menu. Cards holding a
 * Select must not clip. That is cheaper to honour than the alternative, which
 * is measuring page coordinates and re-measuring them on every scroll.
 */

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  /** Controlled value. Pair with `onChange`. */
  value?: string
  /** Uncontrolled starting value. */
  defaultValue?: string
  onChange?: (value: string) => void
  label?: React.ReactNode
  hint?: React.ReactNode
  /** Shown when nothing is selected, e.g. "Choose a chamber". */
  placeholder?: string
  size?: FieldSize
  disabled?: boolean
  className?: string
  id?: string
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  label,
  hint,
  placeholder = 'Select…',
  size = 'md',
  disabled,
  className,
  id,
}: SelectProps) {
  const generatedId = useId()
  const triggerId = id ?? generatedId
  const listId = `${triggerId}-list`
  const describedBy = hint ? `${triggerId}-desc` : undefined

  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '')
  const selected = value ?? uncontrolled
  const selectedIndex = options.findIndex((o) => o.value === selected)

  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const [active, setActive] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLLIElement | null>>([])

  const commit = (index: number) => {
    const option = options[index]
    if (!option || option.disabled) return
    if (value === undefined) setUncontrolled(option.value)
    onChange?.(option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  /** Next selectable index in `step` direction, skipping disabled rows. */
  const step = (from: number, direction: 1 | -1) => {
    for (let i = from + direction; i >= 0 && i < options.length; i += direction) {
      if (!options[i].disabled) return i
    }
    return from
  }

  // Decide direction before paint, so the menu never appears low and jump.
  useLayoutEffect(() => {
    if (!open) return
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const below = window.innerHeight - rect.bottom
    setDropUp(below < 260 && rect.top > below)
  }, [open])

  useEffect(() => {
    if (open) optionRefs.current[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      setActive(selectedIndex >= 0 ? selectedIndex : step(-1, 1))
      setOpen(true)
      return
    }
    if (!open) return

    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => step(i, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => step(i, -1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(step(-1, 1))
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(step(options.length, -1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      commit(active)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {label != null && (
        <label htmlFor={triggerId} className="mb-1.5 block text-[13px] font-medium text-ink">
          {label}
        </label>
      )}

      <div ref={wrapRef} className="relative">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open ? `${listId}-${active}` : undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          onClick={() => {
            setActive(selectedIndex >= 0 ? selectedIndex : step(-1, 1))
            setOpen((o) => !o)
          }}
          onKeyDown={onKeyDown}
          className={cn(
            fieldSurface,
            fieldFocus,
            fieldSizes[size],
            'flex cursor-pointer items-center justify-between gap-2 text-left',
            // One border colour or the other, never both in the list at once.
            open ? 'border-accent ring-[3px] ring-accent/25' : fieldBorder,
          )}
        >
          <span className={cn('truncate', selectedIndex < 0 && 'text-ink/40')}>
            {selectedIndex >= 0 ? options[selectedIndex].label : placeholder}
          </span>
          <ChevronDownIcon
            className={cn('size-4 shrink-0 text-ink/45 transition-transform', open && 'rotate-180')}
          />
        </button>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={triggerId}
            // Anchored to this trigger and matching its width, so it can never
            // spread across the field beside it.
            className={cn(
              'absolute inset-x-0 z-50 max-h-64 overflow-auto',
              'rounded-[10px] border border-line-strong bg-surface p-1 shadow-panel',
              'origin-top',
              dropUp ? 'bottom-full mb-1.5 origin-bottom' : 'top-full mt-1.5',
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === selected
              return (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  ref={(el) => {
                    optionRefs.current[index] = el
                  }}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => commit(index)}
                  onMouseEnter={() => !option.disabled && setActive(index)}
                  className={cn(
                    'flex h-7 cursor-pointer items-center justify-between gap-2 rounded-md px-2',
                    'text-sm whitespace-nowrap',
                    option.disabled && 'cursor-not-allowed text-ink/30',
                    !option.disabled && index === active && 'bg-accent text-white',
                    !option.disabled && index !== active && 'text-ink',
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <CheckIcon className="size-3.5 shrink-0" />}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {hint && (
        <p id={describedBy} className="mt-1.5 text-xs text-ink/55">
          {hint}
        </p>
      )}
    </div>
  )
}
