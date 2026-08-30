import { cn } from '@/lib/cn'

/**
 * StatusDot
 *
 * Whether a device is alive. It appears beside every chamber name in the card
 * view, every row in the table, every pin on the map, and at the head of each
 * detail page.
 *
 * Worth being deliberate about: the client commissioned this project because a
 * chamber can fail in a paddock and nobody finds out until they drive there.
 * One of their Tailscale devices had already been offline for days unnoticed.
 * This dot is the smallest component in the library and the one carrying that
 * requirement, so it is built to read instantly at 8px.
 *
 * Three things make it a bead rather than a printed circle: a vertical
 * gradient, a hairline darker rim, and a lit top edge. All three are in the
 * `shadow-status-dot` token.
 */

export type Status = 'ok' | 'warn' | 'error' | 'unknown'

export interface StatusDotProps {
  status: Status
  size?: 'sm' | 'md' | 'lg'
  /**
   * Emit a slow halo, for a device currently reporting. Opt-in: a table of
   * twenty pulsing dots is unreadable, so use it on detail headers and live
   * cards, not in lists.
   */
  pulse?: boolean
  /**
   * Accessible name. Defaults to a sensible phrase per status. Pass `null`
   * when adjacent text already says it — "unreachable since 09:14" beside a
   * dot labelled "Not responding" is noise in a screen reader.
   */
  label?: string | null
  className?: string
}

const styles: Record<Status, { fill: string; pulse: string; label: string }> = {
  ok: {
    fill: 'from-status-ok-hi to-status-ok',
    pulse: 'bg-status-ok',
    label: 'Reporting',
  },
  warn: {
    fill: 'from-status-warn-hi to-status-warn',
    pulse: 'bg-status-warn',
    label: 'Not responding',
  },
  error: {
    fill: 'from-status-error-hi to-status-error',
    pulse: 'bg-status-error',
    label: 'Fault',
  },
  unknown: {
    fill: 'from-status-unknown-hi to-status-unknown',
    pulse: 'bg-status-unknown',
    label: 'No data yet',
  },
}

const sizes = {
  sm: 'size-1.5', // 6px — dense table rows
  md: 'size-2', //   8px — the wireframe's size, the default everywhere
  lg: 'size-2.5', // 10px — detail page headers
}

export function StatusDot({
  status,
  size = 'md',
  pulse = false,
  label,
  className,
}: StatusDotProps) {
  const style = styles[status]
  const decorative = label === null
  const name = label ?? style.label

  return (
    <span
      // `inline-flex` keeps the dot on the text baseline of whatever it sits
      // beside without needing a magic margin.
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
    >
      {pulse && (
        <span
          aria-hidden
          className={cn(
            'absolute rounded-full',
            sizes[size],
            style.pulse,
            'animate-status-pulse motion-reduce:hidden',
          )}
        />
      )}
      <span
        aria-hidden
        className={cn(
          'relative rounded-full bg-linear-to-b shadow-status-dot',
          sizes[size],
          style.fill,
        )}
      />
    </span>
  )
}
