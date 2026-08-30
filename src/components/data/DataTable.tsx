import { Fragment, useMemo, useState } from 'react'
import { Checkbox } from '@/components/primitives/Checkbox'
import { ChevronDownIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'

/**
 * DataTable
 *
 * The workhorse. Used five times across four wireframe screens, with different
 * columns every time:
 *
 *   Table view       two tables, array chambers and standalone, with selection
 *   Card view        the chamber table nested inside the analyser's card
 *   Add chamber      the inventory list
 *   Analyser detail  array rows, one expandable to its live trace
 *
 * Because of that it is driven by a column definition rather than shaped around
 * any one screen. The two things it must never lose:
 *
 * **Numbers right-align, text left-aligns.** The wireframe does this and it is
 * not decoration: a column of right-aligned figures can be scanned for an
 * outlier at a glance, and a ragged one cannot. Set `align: 'right'` on every
 * numeric column.
 *
 * **Nulls sort last, in both directions.** A chamber with no reading is not the
 * smallest reading. Sorting ascending by temperature must not park every dead
 * device at the top as though they were cold.
 */

export interface Column<T> {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  /** Right-align. Use for every numeric column. */
  align?: 'left' | 'right'
  /** Omit to make the column unsortable. Return `null` for a missing value. */
  sortValue?: (row: T) => string | number | null
  /** A CSS width, e.g. "8rem". Columns size to content otherwise. */
  width?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  /** Turns on the leading checkbox column. */
  selection?: {
    selected: ReadonlySet<string>
    onChange: (next: Set<string>) => void
    /** Names each row's checkbox for screen readers. */
    label?: (row: T) => string
  }
  /** Return content to render a disclosure row beneath, or null for no toggle. */
  expandable?: (row: T) => React.ReactNode
  /** Shown in place of the body when there are no rows. */
  empty?: React.ReactNode
  className?: string
}

type SortState = { key: string; direction: 'asc' | 'desc' } | null

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selection,
  expandable,
  empty = 'No devices',
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const sorted = useMemo(() => {
    if (!sort) return rows
    const column = columns.find((c) => c.key === sort.key)
    if (!column?.sortValue) return rows

    const direction = sort.direction === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const left = column.sortValue!(a)
      const right = column.sortValue!(b)
      // Missing values sink to the bottom whichever way the column is sorted.
      if (left === null && right === null) return 0
      if (left === null) return 1
      if (right === null) return -1
      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction
      }
      return String(left).localeCompare(String(right)) * direction
    })
  }, [rows, sort, columns])

  /** Cycles ascending, descending, then back to the rows' natural order. */
  const toggleSort = (key: string) =>
    setSort((current) => {
      if (current?.key !== key) return { key, direction: 'asc' }
      if (current.direction === 'asc') return { key, direction: 'desc' }
      return null
    })

  const allKeys = sorted.map(rowKey)
  const selectedCount = selection ? allKeys.filter((k) => selection.selected.has(k)).length : 0
  const colSpan = columns.length + (selection ? 1 : 0) + (expandable ? 1 : 0)

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas">
            {selection && (
              <th scope="col" className="h-10 w-9 px-3">
                <Checkbox
                  size="sm"
                  aria-label="Select all rows"
                  checked={selectedCount > 0 && selectedCount === allKeys.length}
                  indeterminate={selectedCount > 0 && selectedCount < allKeys.length}
                  onChange={(e) =>
                    selection.onChange(new Set(e.target.checked ? allKeys : []))
                  }
                />
              </th>
            )}

            {columns.map((column) => {
              const isSorted = sort?.key === column.key
              return (
                <th
                  key={column.key}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={
                    isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                  className={cn(
                    // 40px, measured off the wireframe.
                    'h-10 px-3 text-[11px] font-medium tracking-wide text-ink/55 uppercase',
                    column.align === 'right' ? 'text-right' : 'text-left',
                  )}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className={cn(
                        'inline-flex cursor-pointer items-center gap-1 rounded-[3px] uppercase',
                        'transition-colors duration-150 hover:text-ink',
                        'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
                        column.align === 'right' && 'flex-row-reverse',
                        isSorted && 'text-ink',
                      )}
                    >
                      {column.header}
                      <ChevronDownIcon
                        className={cn(
                          'size-3 transition-[transform,opacity] duration-150',
                          isSorted ? 'opacity-100' : 'opacity-0',
                          isSorted && sort.direction === 'asc' && 'rotate-180',
                        )}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}

            {expandable && <th scope="col" className="w-9" />}
          </tr>
        </thead>

        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={colSpan} className="px-3 py-8 text-center text-[13px] text-ink/45">
                {empty}
              </td>
            </tr>
          )}

          {sorted.map((row) => {
            const key = rowKey(row)
            const panel = expandable?.(row)
            const isOpen = expanded === key

            return (
              // A keyed Fragment, because a row and its disclosure panel are two
              // sibling <tr>s and the shorthand <> cannot carry a key.
              <Fragment key={key}>
                <tr className="border-b border-line-soft last:border-0">
                  {selection && (
                    <td className="px-3">
                      <Checkbox
                        size="sm"
                        aria-label={selection.label?.(row) ?? `Select ${key}`}
                        checked={selection.selected.has(key)}
                        onChange={(e) => {
                          const next = new Set(selection.selected)
                          if (e.target.checked) next.add(key)
                          else next.delete(key)
                          selection.onChange(next)
                        }}
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'h-control-md px-3 whitespace-nowrap',
                        column.align === 'right' ? 'text-right tabular-nums' : 'text-left',
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}

                  {expandable && (
                    <td className="px-2">
                      {panel != null && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                          onClick={() => setExpanded(isOpen ? null : key)}
                          className={cn(
                            'flex cursor-pointer items-center justify-center rounded-[5px] p-1',
                            'text-ink/45 transition-colors duration-150 hover:bg-ink/[0.06] hover:text-ink',
                            'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
                          )}
                        >
                          <ChevronDownIcon
                            className={cn('size-4 transition-transform', isOpen && 'rotate-180')}
                          />
                        </button>
                      )}
                    </td>
                  )}
                </tr>

                {isOpen && panel != null && (
                  <tr className="border-b border-line-soft last:border-0">
                    <td colSpan={colSpan} className="bg-surface-hi px-3 py-3">
                      {panel}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
