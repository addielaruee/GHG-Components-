import { useMemo, useState } from 'react'

/**
 * Sorting for DataTable.
 *
 * Extracted because DataTable reached the 300-line cap exactly. This is the
 * right seam: it is logic with no markup, so pulling it out leaves the
 * component as a description of what a table looks like and puts the ordering
 * rules somewhere they can be read, and tested, on their own.
 *
 * Deliberately generic over how a value is fetched, taking a lookup rather than
 * a column list, so it does not have to import DataTable's types and create a
 * cycle.
 */

export type SortValue = string | number | null
export type SortState = { key: string; direction: 'asc' | 'desc' } | null

export function useTableSort<T>(
  rows: T[],
  /** Returns an accessor for a column key, or undefined if it cannot be sorted. */
  accessorFor: (key: string) => ((row: T) => SortValue) | undefined,
) {
  const [sort, setSort] = useState<SortState>(null)

  const sorted = useMemo(() => {
    if (!sort) return rows
    const accessor = accessorFor(sort.key)
    if (!accessor) return rows

    const direction = sort.direction === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      const left = accessor(a)
      const right = accessor(b)
      // Missing values sink to the bottom whichever way the column is sorted.
      // A chamber with no reading is not the smallest reading, and sorting
      // ascending by temperature must not park every dead device at the top as
      // though they were cold.
      if (left === null && right === null) return 0
      if (left === null) return 1
      if (right === null) return -1
      if (typeof left === 'number' && typeof right === 'number') {
        return (left - right) * direction
      }
      return String(left).localeCompare(String(right)) * direction
    })
  }, [rows, sort, accessorFor])

  /** Cycles ascending, descending, then back to the rows' natural order. */
  const toggleSort = (key: string) =>
    setSort((current) => {
      if (current?.key !== key) return { key, direction: 'asc' }
      if (current.direction === 'asc') return { key, direction: 'desc' }
      return null
    })

  return { sorted, sort, toggleSort }
}
