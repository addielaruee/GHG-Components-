import { IconButton } from '@/components/primitives/IconButton'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'

/**
 * Pagination
 *
 * The footer under a device table: `Rows 1–15 of 23` with a previous and next
 * control, right-aligned.
 *
 * It states a range rather than a page number, which is the wireframe's choice
 * and the right one here. The client has about twenty standalone chambers and
 * eight to twelve per analyser, so the list is short enough that "which rows am
 * I looking at" is a more useful question than "which page am I on". Page
 * numbers would imply more paging than this data ever needs.
 *
 * The range is computed rather than passed in, so a caller cannot state a total
 * that disagrees with the arithmetic.
 */

export interface PaginationProps {
  /** 1-based. */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, pageSize, total, onPageChange, className }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(page, 1), pageCount)
  const first = total === 0 ? 0 : (current - 1) * pageSize + 1
  const last = Math.min(current * pageSize, total)

  return (
    <div
      className={cn(
        'flex min-h-10 flex-wrap items-center justify-end gap-x-3 gap-y-2',
        'border-t border-line px-5 py-1.5',
        className,
      )}
    >
      {/* An en dash, because this is a numeric range and not a break in a sentence.
          "Rows 0-0 of 0" is arithmetically true and reads like a fault, so an
          empty table says so in words instead. */}
      <span className="text-[13px] text-ink/55 tabular-nums">
        {total === 0 ? 'No rows' : `Rows ${first}–${last} of ${total}`}
      </span>

      <div className="flex items-center gap-1.5">
        <IconButton
          label="Previous page"
          variant="outline"
          size="sm"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          label="Next page"
          variant="outline"
          size="sm"
          disabled={current >= pageCount}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  )
}
