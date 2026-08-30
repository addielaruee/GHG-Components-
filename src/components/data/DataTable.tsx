import { Fragment, useCallback, useState } from 'react'
import { Checkbox } from '@/components/primitives/Checkbox'
import { ChevronDownIcon } from '@/components/primitives/icons'
import { cn } from '@/lib/cn'
import { useTableSort } from '@/lib/useTableSort'

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
 *
 * The inventory lists `ExpandableTableRow` as its own component. It is not one:
 * a row that opens a panel is a table behaviour, and building it separately
 * would mean either duplicating row rendering or wrapping this component for no
 * gain. It lives here as the `expandable` prop, matching the wireframe's
 * analyser page: the chevron leads the row rather than trailing it, and an open
 * row is tinted so it stays findable once its panel has pushed the rest of the
 * table down the screen. What goes *inside* the panel is `InlineChartPanel`,
 * which is a real separate component.
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

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selection,
  expandable,
  empty = 'No devices',
  className,
}: DataTableProps<T>) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const accessorFor = useCallback(
    (key: string) => columns.find((c) => c.key === key)?.sortValue,
    [columns],
  )
  const { sorted, sort, toggleSort } = useTableSort(rows, accessorFor)

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
                  // Do not read e.target.checked here. A native checkbox in the
                  // indeterminate state still reports checked === false, so a
                  // click on it flips to true and selects everything, forcing a
                  // second click to clear. Decide from the selection instead:
                  // anything selected clears, nothing selected selects all.
                  onChange={() =>
                    selection.onChange(new Set(selectedCount > 0 ? [] : allKeys))
                  }
                />
              </th>
            )}

            {expandable && <th scope="col" className="w-8" />}

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
                <tr
                  className={cn(
                    'border-b border-line-soft last:border-0',
                    // An open row keeps the tint so it stays findable once its
                    // panel has pushed everything below it down the screen.
                    isOpen && 'bg-accent/[0.04]',
                  )}
                >
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

                  {expandable && (
                    <td className="pl-2">
                      {panel != null && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                          onClick={() => setExpanded(isOpen ? null : key)}
                          className={cn(
                            'flex cursor-pointer items-center justify-center rounded-[5px] p-0.5',
                            'text-ink/45 transition-colors duration-150 hover:bg-ink/[0.06] hover:text-ink',
                            'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
                          )}
                        >
                          <ChevronDownIcon
                            className={cn(
                              'size-3.5 transition-transform duration-150',
                              isOpen && 'rotate-180',
                            )}
                          />
                        </button>
                      )}
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

                </tr>

                {isOpen && panel != null && (
                  <tr className="border-b border-line-soft last:border-0">
                    <td colSpan={colSpan} className="bg-surface px-3 py-3">
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
