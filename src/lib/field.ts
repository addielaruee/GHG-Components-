/**
 * Shared styling for text-entry surfaces: TextInput, SearchInput and Select.
 *
 * These have to be indistinguishable when stacked in a form: the add-chamber
 * dialog puts a text field, a field with a trailing button and a coordinate
 * pair in one column, and any drift in height or border weight shows
 * immediately. Keeping the classes in one place is cheaper than keeping three
 * copies honest.
 */

/**
 * The recessed white surface every field sits on.
 *
 * Note what is NOT here: the border *colour*. Only its width. Two border-color
 * utilities in one class list are resolved by Tailwind's own ordering, not by
 * the order cn() joins them, so a colour set here would silently beat the one a
 * component needs when it is open or invalid. Callers pick exactly one of
 * `fieldBorder` / `fieldInvalid` / their own.
 */
export const fieldSurface = [
  'w-full rounded-control border bg-surface text-ink shadow-track',
  'transition-[border-color,box-shadow] duration-150',
  'placeholder:text-ink/30',
  'disabled:pointer-events-none disabled:opacity-50',
].join(' ')

/** The resting border, and a hover that acknowledges the pointer. */
export const fieldBorder = 'border-line-strong hover:border-ink/25'

/** Focus treatment, matching the accent ring used by Button and Chip. */
export const fieldFocus = [
  'outline-none',
  'focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/25',
].join(' ')

/** Replaces `fieldBorder` when the field is holding an invalid value. */
export const fieldInvalid =
  'border-status-error/60 hover:border-status-error/80 focus-visible:border-status-error focus-visible:ring-status-error/20'

/** Height and type scale, sharing the control tokens with Button. */
export const fieldSizes = {
  sm: 'h-control-sm px-2.5 text-[13px]',
  md: 'h-control-md px-3 text-sm',
}

export type FieldSize = keyof typeof fieldSizes
