/**
 * Assigns a chart line's colour and dash to a device, once, for everything.
 *
 * The wireframe's dashboard editor says: "Colours are remembered per device
 * across dashboards." So a chamber's colour belongs to the chamber, not to the
 * chart it happens to appear in.
 *
 * That matters more than it sounds. The flux summary draws lines and the legend
 * beside it draws swatches, and if the two work it out separately then CH-01 can
 * be blue in one and green in the other. Both call this instead.
 *
 * Style is taken from position in the fleet rather than hashed from the id.
 * Hashing is stable but collides, and two chambers sharing a colour on the same
 * chart is worse than either being a particular colour.
 */

export type SeriesDash = 'solid' | 'dashed' | 'dotted'

export interface SeriesStyle {
  colour: string
  dash: SeriesDash
}

/** The eight tokens in index.css, in order. */
const COLOURS = Array.from({ length: 8 }, (_, i) => `var(--color-series-${i + 1})`)

/**
 * The nth palette colour, wrapping.
 *
 * For anything coloured by position that is *not* a device: the channels in a
 * stacked chart are separate quantities, not separate chambers, so they take
 * their colour from here rather than through `assignSeriesStyles`, whose whole
 * contract is that a colour belongs to a device.
 */
export function paletteColour(index: number): string {
  return COLOURS[((index % COLOURS.length) + COLOURS.length) % COLOURS.length]
}

/**
 * Dash is the second channel, not decoration. Four chambers on one axis have to
 * be told apart in greyscale, by a colour-blind reader, and in a printed report,
 * which is a real output for this project.
 */
const DASHES: SeriesDash[] = ['solid', 'dashed', 'dotted']

/**
 * A stable style for every id given.
 *
 * Pass the whole fleet in a consistent order, not just the visible subset, or
 * hiding a chamber would recolour the ones after it. 8 colours by 3 dashes is
 * 24 distinct lines, comfortably more than the client's roughly 20 standalone
 * chambers plus 8 on the analyser.
 */
export function assignSeriesStyles(ids: string[]): Map<string, SeriesStyle> {
  return new Map(
    ids.map((id, index) => [
      id,
      {
        colour: COLOURS[index % COLOURS.length],
        // Cycle colour first, so the first eight are told apart by hue alone.
        dash: DASHES[Math.floor(index / COLOURS.length) % DASHES.length],
      },
    ]),
  )
}

/** One id's style, for a caller that only needs the one. */
export function seriesStyle(ids: string[], id: string): SeriesStyle | undefined {
  return assignSeriesStyles(ids).get(id)
}
