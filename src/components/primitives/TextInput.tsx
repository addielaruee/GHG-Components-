import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import {
  fieldBorder,
  fieldFocus,
  fieldInvalid,
  fieldSizes,
  fieldSurface,
  type FieldSize,
} from '@/lib/field'

/**
 * TextInput
 *
 * A single-line field with a label. In the wireframe: the tile name in the
 * dashboard editor, and ChamberID, IP address, latitude and longitude in the
 * add-chamber dialog.
 *
 * `leading` and `trailing` take nodes rather than icons specifically, because
 * the add-chamber dialog puts a "Test connection" button inside the IP field's
 * row and a search icon inside the device filter.
 */

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode
  /** Help text under the field. Replaced by `error` when that is set. */
  hint?: React.ReactNode
  /** Message shown in place of the hint, and marks the field invalid. */
  error?: React.ReactNode
  leading?: React.ReactNode
  trailing?: React.ReactNode
  size?: FieldSize
  className?: string
}

export function TextInput({
  label,
  hint,
  error,
  leading,
  trailing,
  size = 'md',
  className,
  id,
  ...props
}: TextInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const describedBy = hint || error ? `${inputId}-desc` : undefined

  return (
    <div className={cn('w-full', className)}>
      {label != null && (
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium text-ink">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leading && (
          <span className="pointer-events-none absolute left-2.5 flex text-ink/40">{leading}</span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            fieldSurface,
            fieldFocus,
            fieldSizes[size],
            // Exactly one border colour, never two competing ones.
            error ? fieldInvalid : fieldBorder,
            // Boolean(): these are ReactNode, so `x && '...'` can yield 0.
            Boolean(leading) && 'pl-8',
            Boolean(trailing) && 'pr-1',
          )}
          {...props}
        />
        {/* Inset by 3px so the control clears the field's own border and focus
            ring rather than sitting on top of them. */}
        {trailing && (
          <span className="absolute right-[3px] flex items-center">{trailing}</span>
        )}
      </div>

      {(hint || error) && (
        <p
          id={describedBy}
          className={cn('mt-1.5 text-xs', error ? 'text-status-error-deep' : 'text-ink/55')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
