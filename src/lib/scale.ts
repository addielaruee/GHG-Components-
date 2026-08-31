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

  const [lo, hi] = padded(min, max)
  min = lo
  max = hi
  const step = niceStep((max - min) / Math.max(1, count))

  const ticks: number[] = []
  for (let t = Math.ceil(min / step) * step; t <= max + step / 1000; t += step) {
    // Kill floating-point dust: 0.30000000000000004 renders as 0.30000000000000004.
    ticks.push(Number(t.toPrecision(12)))
  }
  return ticks
}

/** A flat series still deserves an axis, so give it something either side. */
function padded(min: number, max: number): [number, number] {
  if (min !== max) return [min, max]
  const pad = Math.abs(min) > 1 ? Math.abs(min) * 0.05 : 1
  return [min - pad, max + pad]
}

/**
 * The nearest round number at or above `rough`: 1, 2, 5 or 10 times a power of
 * ten. Every gridline and axis bound in the library comes through here, so the
 * whole app rounds the same way.
 */
export function niceStep(rough: number): number {
  if (!Number.isFinite(rough) || rough <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const error = rough / magnitude
  return magnitude * (error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1)
}

/**
 * A domain rounded outward to round bounds, for a panel labelled at its edges
 * rather than at gridlines inside it.
 *
 * This is what the wireframe's stacked panels do: two labels, the bottom and
 * the top, so a glance gives the range and the line gets the panel's full
 * height. Quartering the span is what makes the bounds land where the design
 * draws them, 13.5 to 16.5 around a 13.8-16.4 reading rather than 13 to 17.
 */
export function niceDomain(min: number, max: number): { domain: [number, number]; step: number } {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { domain: [0, 1], step: 1 }
  const [lo, hi] = padded(min, max)
  const step = niceStep((hi - lo) / 4)
  // The step comes back too: it is what says how many decimals the bounds need
  // to print, and working that out from the bounds alone means parsing floats.
  return {
    domain: [
      Number((Math.floor(lo / step) * step).toPrecision(12)),
      Number((Math.ceil(hi / step) * step).toPrecision(12)),
    ],
    step,
  }
}

/**
 * A domain cut into equal intervals, labelled at every cut.
 *
 * This is the 31 Aug wireframe's axis rule, and it is deliberately *not*
 * `niceTicks`. The values it returns are not round: `Chamber_RH_%` over a 60-80
 * domain gives 60, 63.33, 66.67, 70, 73.33, 76.67, 80. They become round when
 * printed, because the label formatter takes its decimals from the domain's
 * span, and the file's own axis reads 60, 63, 67, 70, 73, 77, 80.
 *
 * Checked against every chart in the wireframe. Paired with `decimalsFor` on
 * the domain span it reproduces all of them exactly, pressure included:
 * 96 160, 96 203, 96 247, 96 290, 96 333, 96 377, 96 420.
 *
 * The trade is that a gridline no longer sits on a number worth reading, which
 * is what `niceTicks` exists for. Labelling every cut is what buys it back:
 * nothing has to be estimated between lines. Use this when a caller has already
 * chosen the bounds, `niceTicks` when the chart is choosing them itself.
 */
export function equalTicks(domain: [number, number], intervals = 6): number[] {
  const [lo, hi] = domain
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return []
  if (lo === hi) return [lo]

  const count = Math.max(1, Math.floor(intervals))
  const step = (hi - lo) / count
  // toPrecision kills the floating dust that turns 96 246.666666666664 into a
  // label one pixel off its gridline.
  return Array.from({ length: count + 1 }, (_, i) => Number((lo + i * step).toPrecision(12)))
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

/**
 * How a series gets from one reading to the next.
 *
 * `line` interpolates, which is right for anything that varies continuously:
 * concentration, temperature, pressure.
 *
 * `step` holds a value until the next reading and then jumps, which is what a
 * valve position or a lid actually does. Interpolating those invents a diagonal
 * ramp through positions the manifold never sat at, and the client's own Fig. 1
 * draws MPVPosition as a staircase for exactly that reason.
 */
export type SeriesShape = 'line' | 'step'

/**
 * An SVG path for one unbroken run of readings.
 *
 * A single-point run still emits a zero-length segment, because with a round
 * linecap that draws as a dot. A lone reading between two gaps is real data,
 * and a bare `M` would render nothing at all.
 */
export function linePath(
  run: Array<{ t: number; v: number }>,
  x: (t: number) => number,
  y: (v: number) => number,
  shape: SeriesShape = 'line',
): string {
  if (run.length === 0) return ''

  const start = `M${x(run[0].t)},${y(run[0].v)}`
  if (run.length === 1) return `${start} L${x(run[0].t)},${y(run[0].v)}`

  let d = start
  for (let i = 1; i < run.length; i += 1) {
    const px = x(run[i].t)
    // Step first travels along the old value, then jumps at the new timestamp.
    if (shape === 'step') d += ` L${px},${y(run[i - 1].v)}`
    d += ` L${px},${y(run[i].v)}`
  }
  return d
}

/**
 * SVG dash patterns, one per line style.
 *
 * Here rather than in the chart because a legend swatch has to be drawn with
 * exactly the pattern its line is drawn with. Two copies of `'5 4'` is how a
 * legend ends up showing a dash the chart renders as a dot.
 */
export const dashArrays: Record<import('@/lib/seriesPalette').SeriesDash, string | undefined> = {
  solid: undefined,
  dashed: '5 4',
  dotted: '1.5 3',
}

