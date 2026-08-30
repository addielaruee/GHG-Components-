import { cn } from '@/lib/cn'

/**
 * MetaList
 *
 * A run of unrelated facts joined by a middot, which the wireframe uses in two
 * places:
 *
 *   DetailHeader        IP: 192.168.1.51 · Location: 54.315, −2.100 · last row 2 s ago
 *   TableSectionHeader  8 chambers · gas is measured by the analyser · CO₂ 438 ppm
 *
 * Extracted rather than written twice. The separator is exactly the kind of
 * detail that drifts: one caller writes `" · "`, another `" · "` with a
 * non-breaking space, a third forgets the spaces, and three screens end up
 * subtly different. Owning it here means there is one answer.
 *
 * The middots are `aria-hidden`, because a screen reader reading "middot"
 * between every fact is noise. The facts are separate children, so they are
 * still announced as distinct.
 */

export interface MetaListProps {
  items: React.ReactNode[]
  className?: string
}

export function MetaList({ items, className }: MetaListProps) {
  const shown = items.filter((item) => item != null && item !== false)
  if (shown.length === 0) return null

  return (
    <span className={cn('text-ink/55', className)}>
      {shown.map((item, index) => (
        <span key={index}>
          {index > 0 && <span aria-hidden> · </span>}
          {item}
        </span>
      ))}
    </span>
  )
}
