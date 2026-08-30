/**
 * Joins class names, dropping anything falsy.
 *
 *   cn('px-2', isActive && 'bg-ink', className)
 *
 * Deliberately tiny. It does NOT resolve conflicting Tailwind classes — if a
 * caller passes `px-8` it lands alongside our `px-3.5` and the later one in the
 * stylesheet wins, not the later one in the string. That has been fine so far
 * because our components put `className` last and callers override rarely. If
 * it starts biting, add `tailwind-merge` and swap the body of this function;
 * nothing else needs to change.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
