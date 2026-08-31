import { useMemo } from 'react'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { cn } from '@/lib/cn'
import { decimalsFor, decimalsForStep, formatReading, readingFormatter } from '@/lib/format'
import { extent, niceDomain, type ChartPoint, type SeriesShape } from '@/lib/scale'
import { paletteColour } from '@/lib/seriesPalette'

/**
 * StackedChannelChart
 *
 * Several channels drawn one above another on a single shared time axis, each
 * with its own label, unit, scale and summary.
 *
 * **This is the client's own chart idiom, not ours.** Every figure in his
 * document is a measurement plotted directly above its context: CO₂ over
 * MPVPosition, lid state over chamber temperature. Reading straight down a
 * vertical line is how a researcher confirms a measurement is real, which makes
 * one property load-bearing:
 *
 * **Every panel is forced onto the same time domain.** Left to themselves the
 * panels would each fit their own data, and a channel that stopped reporting an
 * hour early would silently stretch to fill the same width as the others. Two
 * panels that look aligned while showing different hours is the worst failure
 * this component could have, so the domain is computed once across every
 * channel and handed to all of them.
 *
 * **The y gutter is shared too**, sized to the widest label any panel will
 * draw. A five-digit pressure otherwise shunts its own plot right and breaks
 * the alignment the whole chart exists for.
 *
 * **A panel is labelled at its bounds, not at gridlines inside it**, which is
 * what the wireframe draws: two numbers, the floor and the ceiling, so a glance
 * gives the range and the line gets the panel's full height.
 *
 * **The summary describes the data, never the axis.** Force a domain and the
 * two part company, and it is the readings a researcher is asking about. A
 * panel showing a fixed 0-8 valve axis must not claim a minimum of 0 when the
 * valve never left position 1.
 *
 * A channel with nothing in it keeps its panel and says so. Dropping it would
 * make a dead sensor look like a channel nobody selected, and the difference
 * matters on a dashboard whose job is spotting equipment that has stopped.
 */

export interface ChannelSeries {
  /** The column name from the file, e.g. `Chamber_Temp_C`. */
  id: string
  /** Shown in the panel header. Defaults to the id, as the wireframe does. */
  label?: React.ReactNode
  /** Shown next to the label, greyed: `°C`, `%`, `Pa`. */
  unit?: React.ReactNode
  points: ChartPoint[]
  /** Defaults to the palette colour for this channel's position. */
  colour?: string
  /** `step` for a lid state or a valve position. See `SeriesShape`. */
  shape?: SeriesShape
  /** Force this panel's y range. Defaults to the channel's own extent. */
  domain?: [number, number]
  /**
   * Overrides the decimals worked out from the range. A valve position is a
   * chamber number, and the default rule has no way to know that `5.00` is
   * wrong where `5` is right.
   */
  format?: (value: number) => string
  /** Replaces the computed `min … · max …` line on the right. */
  summary?: React.ReactNode
}

export interface StackedChannelChartProps {
  channels: ChannelSeries[]
  /** Force the shared time domain, e.g. a fixed "last 24 h" window. */
  xDomain?: [number, number]
  /** Drawn once, under the bottom panel. Three reads best. */
  xLabels?: React.ReactNode[]
  /** Plot height per panel. */
  panelHeight?: number
  className?: string
}

/** Sized to sit flush inside `<Card flush>`, so the dividers run full width. */
const GUTTER = 'px-4'

/** Roughly one digit of the 10px tabular label, plus the 6px the axis insets. */
const LABEL_CHAR = 5.6
const MIN_AXIS_WIDTH = 30

export function StackedChannelChart({
  channels,
  xDomain,
  xLabels,
  panelHeight = 64,
  className,
}: StackedChannelChartProps) {
  const panels = useMemo(() => {
    return channels.map((channel, index) => {
      // What the readings say. Drives the summary, and nothing else.
      const range = extent(channel.points)
      const nice = range ? niceDomain(range[0], range[1]) : null

      // What the axis shows. A forced domain has no step to read decimals off,
      // so fall back to sizing them from its span.
      const axis = channel.domain ?? nice?.domain ?? null
      const decimals = channel.domain
        ? decimalsFor(channel.domain[1] - channel.domain[0])
        : decimalsForStep(nice?.step ?? 1)
      const axisFormat = channel.format ?? ((value: number) => formatReading(value, decimals))

      return {
        channel,
        index,
        range,
        axis,
        axisFormat,
        summary: range ? (channel.format ?? readingFormatter(range)) : null,
        // Measured from the strings the panel will really draw.
        labels: axis ? axis.map(axisFormat) : [],
      }
    })
  }, [channels])

  // One domain for every panel. This is the alignment guarantee.
  const sharedX = useMemo<[number, number] | undefined>(() => {
    if (xDomain) return xDomain
    const times = channels.flatMap((c) => c.points).map((p) => p.t)
    return times.length ? [Math.min(...times), Math.max(...times)] : undefined
  }, [xDomain, channels])

  const axisWidth = useMemo(() => {
    const widest = Math.max(0, ...panels.flatMap((p) => p.labels.map((l) => l.length)))
    return Math.max(MIN_AXIS_WIDTH, Math.round(widest * LABEL_CHAR) + 8)
  }, [panels])

  return (
    <div className={cn('flex flex-col', className)}>
      {panels.map(({ channel, index, range, axis, axisFormat, summary, labels }) => (
        <div key={channel.id} className={cn('border-t border-line pt-2.5 pb-1', GUTTER)}>
          <div className="flex items-baseline justify-between gap-x-4">
            <p className="text-[13px] leading-tight">
              <span className="font-semibold text-ink">{channel.label ?? channel.id}</span>
              {channel.unit != null && <span className="ml-1.5 text-ink/45">{channel.unit}</span>}
            </p>
            <p className="text-[11px] tabular-nums text-ink/45">
              {channel.summary ??
                (range && summary ? (
                  <>
                    min {summary(range[0])} <span aria-hidden>·</span> max {summary(range[1])}
                  </>
                ) : (
                  'no readings'
                ))}
            </p>
          </div>

          {axis ? (
            <TimeSeriesChart
              series={[
                {
                  id: channel.id,
                  points: channel.points,
                  colour: channel.colour ?? paletteColour(index),
                  shape: channel.shape,
                },
              ]}
              height={panelHeight}
              domain={axis}
              ticks={axis}
              xDomain={sharedX}
              yAxisWidth={axisWidth}
              formatY={axisFormat}
              ariaLabel={`${channel.id}, ${labels.at(0)} to ${labels.at(-1)}`}
            />
          ) : (
            // Height matched to a drawn panel, so one dead channel does not
            // make the stack jump about as channels are toggled.
            <div
              className="flex items-center text-[11px] text-ink/35"
              style={{ height: panelHeight, paddingLeft: axisWidth }}
            >
              This channel reported nothing over the window shown.
            </div>
          )}
        </div>
      ))}

      {xLabels && xLabels.length > 0 && (
        <div
          className={cn('flex justify-between pb-1 text-[10px] tabular-nums text-ink/45', GUTTER)}
          style={{ paddingLeft: axisWidth + 16 }}
        >
          {xLabels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
