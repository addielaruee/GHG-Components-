import { StatusDot, type Status } from '@/components/primitives/StatusDot'
import { cn } from '@/lib/cn'

/**
 * Badge
 *
 * A small static label stating a fact about the thing beside it. Not
 * clickable. If it does something, it is a Button.
 *
 * In the wireframe:
 *   soft     Standalone chamber · Array chamber · Array mode · 8 chambers
 *   outline  read-only · No response
 *
 * Both are 18px pills at the default size, taken from the wireframe.
 *
 * The wireframe renders every badge in grey, including "No response". Tones
 * are offered anyway because the data has real fault states, the analyser's
 * ALARM_STATUS among them, and the alternative is the team reaching for
 * className overrides the first time a screen needs a red one.
 */

/** Health. These are the tones that can carry a status bead. */
export type StatusTone = 'neutral' | 'ok' | 'warn' | 'error'

/**
 * Which source a number came from. A taxonomy, not a health state, which is why
 * these carry no bead: a green dot beside `STANDALONE` would claim the chamber
 * is reporting, and the tag says nothing of the sort.
 */
export type DeviceTone = 'analyser' | 'array' | 'standalone'

export type BadgeTone = StatusTone | DeviceTone

export interface BadgeProps {
  /** Defaults to `neutral`, which is every badge the wireframe actually shows. */
  tone?: BadgeTone
  /** `soft` is a tinted fill; `outline` is a hairline on transparent. */
  variant?: 'soft' | 'outline'
  size?: 'sm' | 'md'
  /**
   * Show a status bead before the label. Worth using on the coloured tones: it
   * gives the badge a second, non-colour signal, which matters because
   * red-green colour blindness makes `ok` and `error` hard to separate.
   *
   * Ignored on the device tones, which describe a source rather than a state.
   */
  dot?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Each tone carries its own border colour rather than overriding a shared one.
 * Two border-color utilities in a single class list are resolved by Tailwind's
 * ordering, not by the order cn() joins them, so the base sets width only.
 *
 * The soft fills are a fine vertical gradient with a border a step deeper in
 * the same tone, rather than a flat wash on a transparent edge. At 18px neither
 * is loud, but a flat tint with no edge is exactly what makes a badge look
 * unfinished beside controls that have a surface.
 */
const tones: Record<BadgeTone, { soft: string; outline: string; dot?: Status }> = {
  neutral: {
    soft: 'border-ink/12 bg-linear-to-b from-ink/[0.035] to-ink/[0.085] text-ink',
    outline: 'border-line-strong text-ink/70',
    dot: 'unknown',
  },
  ok: {
    soft: 'border-status-ok/30 bg-linear-to-b from-status-ok/8 to-status-ok/16 text-status-ok-deep',
    outline: 'border-status-ok/40 text-status-ok-deep',
    dot: 'ok',
  },
  warn: {
    soft: 'border-status-warn/35 bg-linear-to-b from-status-warn/10 to-status-warn/20 text-status-warn-deep',
    outline: 'border-status-warn/45 text-status-warn-deep',
    dot: 'warn',
  },
  error: {
    soft: 'border-status-error/30 bg-linear-to-b from-status-error/8 to-status-error/16 text-status-error-deep',
    outline: 'border-status-error/40 text-status-error-deep',
    dot: 'error',
  },

  // Device type. Same recipe as above, so a type tag and a status tag sitting
  // together read as one family rather than two.
  analyser: {
    soft: 'border-device-analyser/25 bg-linear-to-b from-device-analyser/8 to-device-analyser/14 text-device-analyser-deep',
    outline: 'border-device-analyser/40 text-device-analyser-deep',
  },
  array: {
    soft: 'border-device-array/25 bg-linear-to-b from-device-array/8 to-device-array/14 text-device-array-deep',
    outline: 'border-device-array/40 text-device-array-deep',
  },
  standalone: {
    soft: 'border-device-standalone/25 bg-linear-to-b from-device-standalone/8 to-device-standalone/14 text-device-standalone-deep',
    outline: 'border-device-standalone/40 text-device-standalone-deep',
  },
}

// Heights include the 1px border top and bottom: md is 14 + 2 + 2 = 18px,
// matching the wireframe.
const sizes = {
  sm: 'gap-1 px-2 py-px text-[11px]/[12px]', // 16px
  md: 'gap-1.5 px-2.5 py-px text-xs/[14px]', //  18px
}

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  children,
  className,
}: BadgeProps) {
  const style = tones[tone]

  return (
    <span
      className={cn(
        // Every variant carries a border width so soft and outline badges sit
        // at the same height side by side, which they do on the array-chamber
        // header.
        'inline-flex shrink-0 items-center rounded-full border',
        'font-medium tracking-[-0.005em] whitespace-nowrap',
        sizes[size],
        variant === 'soft' ? style.soft : style.outline,
        className,
      )}
    >
      {/* Decorative: the badge's own text already names the state. */}
      {dot && style.dot && <StatusDot status={style.dot} size="sm" label={null} />}
      {children}
    </span>
  )
}
