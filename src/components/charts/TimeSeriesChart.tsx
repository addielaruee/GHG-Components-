import { cn } from '@/lib/cn'
import { combinedExtent, linear, niceTicks, segments, type ChartPoint } from '@/lib/scale'
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
 */

export interface ChartSeries {
  id: string
  points: ChartPoint[]
  /** A CSS colour. Use the `--color-series-*` tokens. */
  colour: string
  dash?: 'solid' | 'dashed' | 'dotted'
  label?: string
}

export interface TimeSeriesChartProps {
  series: ChartSeries[]
  height?: number
  /** Force a y domain. Defaults to the data's own extent. */
  domain?: [number, number]
  /** Labels under the plot. Three reads best: start, middle, end. */
  xLabels?: React.ReactNode[]
  formatY?: (value: number) => string
  /** Drawn inside the plot: dead bands, fitted lines, markers. */
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

const dashArrays = { solid: undefined, dashed: '5 4', dotted: '1.5 3' } as const

/** Room for the y labels on the left and the x labels beneath. */
const PAD = { left: 30, right: 4, top: 6, bottom: 18 }

export function TimeSeriesChart({
  series,
  height = 120,
  domain,
  xLabels,
  formatY = (v) => String(v),
  overlay,
  ariaLabel,
  className,
}: TimeSeriesChartProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()

  const allPoints = series.flatMap((s) => s.points)
  const yExtent = domain ?? combinedExtent(series.map((s) => s.points))
  const xExtent = allPoints.length
    ? ([Math.min(...allPoints.map((p) => p.t)), Math.max(...allPoints.map((p) => p.t))] as const)
    : null

  const plot = {
    left: PAD.left,
    top: PAD.top,
    width: Math.max(0, width - PAD.left - PAD.right),
    height: Math.max(0, height - PAD.top - PAD.bottom),
  }

  const ready = width > 0 && yExtent !== null && xExtent !== null
  const ticks = ready ? niceTicks(yExtent[0], yExtent[1], 3) : []
  // Pad the domain to the ticks so the top gridline is not clipped.
  const yDomain: [number, number] = ready
    ? [Math.min(yExtent[0], ticks[0] ?? yExtent[0]), Math.max(yExtent[1], ticks.at(-1) ?? yExtent[1])]
    : [0, 1]

  const x = linear(ready ? [xExtent[0], xExtent[1]] : [0, 1], [plot.left, plot.left + plot.width])
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

          {series.map((s) =>
            // One path per unbroken run. This is the null handling.
            segments(s.points).map((run, index) => (
              <path
                key={`${s.id}-${index}`}
                d={run.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.t)},${y(p.v)}`).join(' ')}
                fill="none"
                stroke={s.colour}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashArrays[s.dash ?? 'solid']}
              />
            )),
          )}
        </svg>
      )}

      {xLabels && xLabels.length > 0 && (
        <div
          className="flex justify-between text-[10px] text-ink/45 tabular-nums"
          style={{ marginLeft: PAD.left, marginRight: PAD.right, marginTop: -PAD.bottom + 4 }}
        >
          {xLabels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
