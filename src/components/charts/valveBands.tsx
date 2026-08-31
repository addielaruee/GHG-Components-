import type { PlotHelpers } from '@/components/charts/TimeSeriesChart'

/**
 * valveBands
 *
 * Shades the intervals when the analyser's valve was actually on the position
 * being plotted, for `TimeSeriesChart`'s `underlay`.
 *
 * **This is the most important annotation on the analyser page**, and the
 * wireframe's own note says why: between the bands "the trace is interpolated
 * across a gap rather than measured". The analyser samples one chamber at a
 * time, so a chart filtered to position 1 has real readings only while the
 * manifold was there. Drawn without the bands it looks like a continuous
 * 24-hour record of chamber 1, which it is not.
 *
 * ⚠️ Worth arguing at a design review: everywhere else in this library a gap in
 * the data is drawn as a gap, and interpolating across one is exactly what
 * `segments` exists to prevent. The bands make the interpolation legible rather
 * than removing it. If the analyser series were split at its gaps instead, the
 * bands would be decoration rather than a correction, and the chart would be
 * honest without needing the reader to know what the shading means.
 *
 * A band is drawn even when it starts before or ends after the window, clamped
 * to the plot, because "the valve was already here when this window opened" is
 * true and a band that vanishes at the edge would deny it.
 */

export interface ValveInterval {
  /** Milliseconds since epoch. */
  from: number
  to: number
}

export interface ValveBandOptions {
  /** `muted` for a band that is not about the valve, e.g. a closure dead band. */
  tone?: 'active' | 'muted'
  /** Announced in place of the shading. Set null for a chart that explains it. */
  label?: string | null
}

export function valveBands(intervals: ValveInterval[], options: ValveBandOptions = {}) {
  const { tone = 'active', label = 'Shaded: the valve was on this position' } = options
  const fill = tone === 'active' ? 'var(--color-band)' : 'var(--color-band-muted)'

  return function bands({ x, plot }: PlotHelpers) {
    const left = plot.left
    const right = plot.left + plot.width

    return (
      <g role={label ? 'img' : undefined} aria-label={label ?? undefined}>
        {intervals.map((interval, index) => {
          // Clamped, because `underlay` is drawn outside the series clip path
          // and an unclamped band would paint over the axis labels.
          const x0 = Math.max(left, Math.min(right, x(interval.from)))
          const x1 = Math.max(left, Math.min(right, x(interval.to)))
          if (x1 - x0 <= 0) return null

          return (
            <rect
              key={index}
              x={x0}
              y={plot.top}
              width={x1 - x0}
              height={plot.height}
              fill={fill}
            />
          )
        })}
      </g>
    )
  }
}
