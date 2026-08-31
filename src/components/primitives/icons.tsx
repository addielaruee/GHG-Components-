/**
 * Icons
 *
 * Hand-drawn rather than pulled from a library. The whole dashboard needs about
 * a dozen glyphs, and it deploys to a Raspberry Pi where every kilobyte of
 * bundle is real. An icon package would be more weight and less control than
 * this.
 *
 * All of them are 16x16, stroked with `currentColor`, so they inherit the
 * colour and size of whatever they sit in. The 1.75 stroke is chosen to sit
 * alongside medium-weight text. A lighter stroke looks weak next to it, which
 * is the usual reason hand-rolled icon sets look amateur. Switch to `lucide-react` if the set
 * ever grows past roughly fifteen.
 */

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="7.2" cy="7.2" r="4.2" />
      <path d="M10.4 10.4 13.5 13.5" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m4 6.2 4 4 4-4" />
    </svg>
  )
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m6.2 4 4 4-4 4" />
    </svg>
  )
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9.8 4-4 4 4 4" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  )
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 8h9" />
    </svg>
  )
}

/** Thicker than the rest, because it renders inside a 16px checkbox. */
export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={2.2} className={className}>
      <path d="m3.5 8.4 3 3 6-6.8" />
    </svg>
  )
}

export function DashIcon({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={2.2} className={className}>
      <path d="M4 8h8" />
    </svg>
  )
}

/** Sidebar: Dashboards. A panel split into one tall tile and two stacked ones. */
export function DashboardIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="2.5" width="4.5" height="11" rx="1.2" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1.2" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1.2" />
    </svg>
  )
}

/** Sidebar: Devices. A hub with leads running off it, which is what a chamber is. */
export function DeviceIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="8" cy="8" r="2.6" />
      <path d="M8 2v2.6M8 11.4V14M2 8h2.6M11.4 8H14" />
    </svg>
  )
}

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 12.5v-9M4.5 7 8 3.5 11.5 7" />
    </svg>
  )
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 3.5v9M4.5 9 8 12.5 11.5 9" />
    </svg>
  )
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" />
    </svg>
  )
}

/** Reset filters. A circle broken at the top with an arrowhead, drawn open so
 *  it reads as "back to the start" rather than "loading". */
export function ResetIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M13.5 8a5.5 5.5 0 1 1-1.7-3.97" />
      <path d="M13.2 2.4v2.6h-2.6" />
    </svg>
  )
}

/** The Analyser nav section. A trace with one tall peak: the instrument's own
 *  signal, and distinct at 16px from the chamber crosshair. */
export function AnalyserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M1.5 9.5h2.2L6 4l2.4 8L10.6 9.5h3.9" />
    </svg>
  )
}
