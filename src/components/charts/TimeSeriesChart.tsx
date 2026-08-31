import { useId } from 'react'
import { cn } from '@/lib/cn'
import {
  combinedExtent,
  dashArrays,
  linear,
  linePath,
  niceTicks,
  segments,
  type ChartPoint,
  type SeriesShape,
} from '@/lib/scale'
import { useElementWidth } from '@/lib/useElementWidth'

/**
 * TimeSeriesChart
 *
 * The base every other chart wraps. Measured from the flux summary: a #fafafa
 * plot area, gridlines a shade above it, and sparse labels sitting outside the
 * plot rather than on it. No axis lines, which is what keeps a dense stack of
 * these readable.
 *
 * **A gap in the data is a gap in the line.** Nulls split a series into
 * separate paths rather than being bridged, because a straight segment drawn
 * across a missing reading is an invented measurement, and this dashboard is
 * read by people deciding whether a chamber is working. The mock series carry
 * deliberate nulls so this stays exercised.
 *
 * **Series carry a dash as well as a colour.** Four chambers on one axis have
 * to be told apart in greyscale, by a colour-blind reader, and in a printed
 * report, which is a real output here.
 *
 * Sized by measurement rather than a scaling viewBox, so labels stay at their
 * intended size and strokes stay even. See `useElementWidth`.
 *
 * **The x domain can be forced.** Left alone a chart fits its own data, which is
 * right on its own and wrong in a stack: two panels covering different spans
 * would look aligned while showing different hours, and reading straight down is
 * the entire point of stacking them. `StackedChannelChart` passes one domain to
 * every panel. Anything falling outside a forced domain is clipped rather than
 * drawn over the labels.
 */

export interface ChartSeries {
  id: string
  points: ChartPoint[]
  /** A CSS colour. Use the `--color-series-*` tokens. */
  colour: string
  dash?: 'solid' | 'dashed' | 'dotted'
  /**
   * `step` holds a value until the next reading, for a valve position or a lid
   * state. Defaults to `line`. See `SeriesShape`.
   */
  shape?: SeriesShape
  label?: string
}

export interface TimeSeriesChartProps {
  series: ChartSeries[]
  height?: number
  /** Force a y domain. Defaults to the data's own extent. */
  domain?: [number, number]
  /**
   * Force the time domain. Defaults to the data's own span. Pass this whenever
   * more than one chart is meant to be read against the same clock.
   */
  xDomain?: [number, number]
  /**
   * Width of the gutter the y labels sit in. Stacked panels pass a single value
   * worked out from the widest label across all of them, so their plots line up
   * and a five-digit pressure does not shunt one panel out of step.
   */
  yAxisWidth?: number
  /** Gridlines to aim for. A panel in a stack wants 2, a chart on its own 3. */
  tickCount?: number
  /**
   * Exact gridline values, overriding `tickCount`. For a caller that has
   * already decided where the lines go, which `StackedChannelChart` has:
   * its panels are labelled at their bounds, not at ticks chosen inside them.
   */
  ticks?: number[]
  /** Labels under the plot. Three reads best: start, middle, end. */
  xLabels?: React.ReactNode[]
  formatY?: (value: number) => string
  /**
   * Drawn under the gridlines: shaded intervals. A band belongs beneath them,
   * because a band that hides the grid changes what the chart is measured
   * against. See `valveBands`.
   */
  underlay?: (helpers: PlotHelpers) => React.ReactNode
  /** Drawn over the gridlines, under the lines: fitted lines, markers. */
  overlay?: (helpers: PlotHelpers) => React.ReactNode
  /** Announced to screen readers in place of the drawing. */
  ariaLabel?: string
  className?: string
}

/** Passed to `overlay` so an annotation can place itself in the same space. */
export interface PlotHelpers {
  x: (t: number) => number
  y: (v: number) => number
  plot: { left: number; top: number; width: number; height: number }
}

/** Room for the x labels beneath, and a little air at the top and right. */
const PAD = { right: 4, top: 6, bottom: 18 }
const DEFAULT_Y_AXIS_WIDTH = 30

export function TimeSeriesChart({
  series,
  height = 120,
  domain,
  xDomain,
  yAxisWidth = DEFAULT_Y_AXIS_WIDTH,
  tickCount = 3,
  ticks: fixedTicks,
  xLabels,
  formatY = (v) => String(v),
  underlay,
  overlay,
  ariaLabel,
  className,
}: TimeSeriesChartProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  // Two charts on one screen must not share a clip path.
  const clipId = useId()

  const times = series.flatMap((s) => s.points).map((p) => p.t)
  const yExtent = domain ?? combinedExtent(series.map((s) => s.points))
  const xExtent: [number, number] | null =
    xDomain ?? (times.length ? [Math.min(...times), Math.max(...times)] : null)

  const plot = {
    left: yAxisWidth,
    top: PAD.top,
    width: Math.max(0, width - yAxisWidth - PAD.right),
    height: Math.max(0, height - PAD.top - PAD.bottom),
  }

  const ready = width > 0 && yExtent !== null && xExtent !== null
  const ticks = !ready ? [] : (fixedTicks ?? niceTicks(yExtent[0], yExtent[1], tickCount))
  // Pad the domain to the ticks so the top gridline is not clipped.
  const yDomain: [number, number] = ready
    ? [Math.min(yExtent[0], ticks[0] ?? yExtent[0]), Math.max(yExtent[1], ticks.at(-1) ?? yExtent[1])]
    : [0, 1]

  const x = linear(ready ? xExtent : [0, 1], [plot.left, plot.left + plot.width])
  const y = linear(yDomain, [plot.top + plot.height, plot.top])

  return (
    <div ref={ref} className={cn('w-full', className)}>
      {ready && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel ?? `Time series, ${series.length} series`}
        >
          <rect
            x={plot.left}
            y={plot.top}
            width={plot.width}
            height={plot.height}
            fill="var(--color-surface-hi)"
          />

          {underlay?.({ x, y, plot })}

          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={plot.left}
                x2={plot.left + plot.width}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--color-line-soft)"
              />
              {/* Outside the plot, so a line never runs behind its own label. */}
              <text
                x={plot.left - 6}
                y={y(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-ink/45 text-[10px] tabular-nums"
              >
                {formatY(tick)}
              </text>
            </g>
          ))}

          {overlay?.({ x, y, plot })}

          <clipPath id={clipId}>
            <rect x={plot.left} y={plot.top} width={plot.width} height={plot.height} />
          </clipPath>

          {/* Clipped, because a forced domain can be narrower than the data. */}
          <g clipPath={`url(#${clipId})`}>
            {series.map((s) =>
              // One path per unbroken run. This is the null handling.
              segments(s.points).map((run, index) => (
                <path
                  key={`${s.id}-${index}`}
                  d={linePath(run, x, y, s.shape)}
                  fill="none"
                  stroke={s.colour}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={dashArrays[s.dash ?? 'solid']}
                />
              )),
            )}
          </g>
        </svg>
      )}

      {xLabels && xLabels.length > 0 && (
        <div
          className="flex justify-between text-[10px] text-ink/45 tabular-nums"
          style={{ marginLeft: yAxisWidth, marginRight: PAD.right, marginTop: -PAD.bottom + 4 }}
        >
          {xLabels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
