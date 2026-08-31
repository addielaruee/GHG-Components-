import { useMemo } from 'react'
import { TimeSeriesChart, type TimeSeriesChartProps } from '@/components/charts/TimeSeriesChart'
import { assignSeriesStyles } from '@/lib/seriesPalette'
import type { ChartPoint } from '@/lib/scale'

/**
 * MultiSeriesChart
 *
 * Several chambers overlaid on one axis, as the flux summary draws them.
 *
 * TimeSeriesChart can already take a list of series, so what this adds is the
 * two things that turn a list into a comparison a reader can trust:
 *
 * **Every device gets its style from one place.** Colour and dash come from
 * `assignSeriesStyles`, keyed on the device's position in the fleet, so the line
 * on the chart and the swatch in the legend beside it cannot disagree. Working
 * it out independently in each is how CH-01 ends up blue in one and green in
 * the other.
 *
 * **Hiding a chamber does not recolour the rest.** Styles are assigned from the
 * full fleet, then the visible subset is drawn. Assigning from what happens to
 * be shown would shuffle every colour each time a legend box is ticked, which
 * makes a chart impossible to read across changes.
 *
 * A chamber can still override its own colour, because the dashboard editor
 * lets a researcher pick one.
 */

export interface DeviceSeries {
  /** The device id. Drives the assigned style. */
  id: string
  label?: string
  points: ChartPoint[]
  /** Overrides the assigned colour, for the editor's per-device picker. */
  colour?: string
  dash?: 'solid' | 'dashed' | 'dotted'
}

export interface MultiSeriesChartProps
  extends Omit<TimeSeriesChartProps, 'series' | 'ariaLabel'> {
  series: DeviceSeries[]
  /**
   * The whole fleet, in a stable order, so styles do not shift as chambers are
   * hidden. Defaults to the ids given, which is right when the chart is showing
   * everything.
   */
  fleetOrder?: string[]
  /** Ids to draw. Omit to draw them all. Pairs with LegendPanel's checkboxes. */
  visible?: ReadonlySet<string>
  ariaLabel?: string
}

export function MultiSeriesChart({
  series,
  fleetOrder,
  visible,
  ariaLabel,
  ...rest
}: MultiSeriesChartProps) {
  const styles = useMemo(
    () => assignSeriesStyles(fleetOrder ?? series.map((s) => s.id)),
    [fleetOrder, series],
  )

  const drawn = series
    .filter((s) => !visible || visible.has(s.id))
    .map((s) => {
      const style = styles.get(s.id)
      return {
        id: s.id,
        label: s.label,
        points: s.points,
        colour: s.colour ?? style?.colour ?? 'var(--color-series-1)',
        dash: s.dash ?? style?.dash,
      }
    })

  return (
    <TimeSeriesChart
      series={drawn}
      ariaLabel={ariaLabel ?? `${drawn.length} chambers compared over time`}
      {...rest}
    />
  )
}
