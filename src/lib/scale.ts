/**
 * Chart maths, kept apart from chart markup.
 *
 * Split out before TimeSeriesChart was written rather than after it hit the
 * 300-line cap, which is what happened with DataTable. Everything here is pure
 * and testable on its own, and every chart wrapper needs it.
 */

export interface ChartPoint {
  /** Milliseconds since epoch, or any numeric x. */
  t: number
  /**
   * `null` is a genuine gap: no reading, a failed fit, a device that stopped
   * answering. Charts must break the line at one rather than draw across it,
   * because a straight segment over a gap is an invented measurement.
   */
  v: number | null
}

/** Smallest and largest non-null value, or `null` when there are none. */
export function extent(points: ChartPoint[]): [number, number] | null {
  let min = Infinity
  let max = -Infinity
  for (const { v } of points) {
    if (v === null) continue
    if (v < min) min = v
    if (v > max) max = v
  }
  return min === Infinity ? null : [min, max]
}

/** Union of several series' extents. */
export function combinedExtent(all: ChartPoint[][]): [number, number] | null {
  const found = all.map(extent).filter((e): e is [number, number] => e !== null)
  if (found.length === 0) return null
  return [Math.min(...found.map((e) => e[0])), Math.max(...found.map((e) => e[1]))]
}

/**
 * Round tick values across a domain: 0, 3, 6 rather than 0.31, 2.94, 5.57.
 *
 * A reader takes an approximate value off a chart by eye against the gridlines,
 * so the gridlines have to sit on numbers worth reading.
 */
export function niceTicks(min: number, max: number, count = 3): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return []

  // A flat series still deserves an axis, so give it something either side.
  if (min === max) {
    const pad = Math.abs(min) > 1 ? Math.abs(min) * 0.05 : 1
    min -= pad
    max += pad
  }

  const rough = (max - min) / Math.max(1, count)
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const error = rough / magnitude
  const step = magnitude * (error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1)

  const ticks: number[] = []
  for (let t = Math.ceil(min / step) * step; t <= max + step / 1000; t += step) {
    // Kill floating-point dust: 0.30000000000000004 renders as 0.30000000000000004.
    ticks.push(Number(t.toPrecision(12)))
  }
  return ticks
}

/** Maps a domain value onto a pixel range. */
export function linear([d0, d1]: [number, number], [r0, r1]: [number, number]) {
  const span = d1 - d0 || 1
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0)
}

/**
 * Splits a series at its gaps, so each run of real readings becomes its own
 * path. This is what makes a missing reading look missing.
 */
export function segments(points: ChartPoint[]): Array<Array<{ t: number; v: number }>> {
  const runs: Array<Array<{ t: number; v: number }>> = []
  let run: Array<{ t: number; v: number }> = []

  for (const point of points) {
    if (point.v === null) {
      if (run.length) runs.push(run)
      run = []
    } else {
      run.push({ t: point.t, v: point.v })
    }
  }
  if (run.length) runs.push(run)
  return runs
}
