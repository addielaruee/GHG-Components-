/**
 * Formatting a reading for an axis label or a summary line.
 *
 * Pulled out of the charts because the number of decimals is a *decision*, and
 * making it per-caller is how a dashboard ends up showing 96420.31 Pa beside
 * 15.2381 °C. The rule here is that decimals follow the span being drawn, not
 * the value: a pressure axis covering 260 Pa needs none, a temperature axis
 * covering 3 °C needs one, a flux axis covering 0.004 needs several.
 */

/**
 * A narrow no-break space, which is the SI thousands separator and what the
 * wireframe draws in `96 340`. No-break, so a pressure never wraps mid-number.
 */
const THOUSANDS = ' '

/** A true minus sign, not a hyphen. The wireframe uses one in `−2.100`. */
const MINUS = '−'

/**
 * How many decimals a span deserves: roughly two significant figures of it.
 *
 * A 3 °C range gets one decimal, a 17 % range none, a 0.004 range four. Small
 * spans need more because 0.004 shown to two decimals is a column of zeroes,
 * and large ones need none because 96 174.31 Pa is false precision. Guarded at
 * both ends, since a channel that has not moved has a span of zero.
 */
export function decimalsFor(span: number): number {
  const size = Math.abs(span)
  if (!Number.isFinite(size) || size === 0) return 2
  return Math.min(6, Math.max(0, 1 - Math.floor(Math.log10(size))))
}

/**
 * The decimals a tick step needs to print exactly.
 *
 * Different question from `decimalsFor`, and getting them confused is how an
 * axis ends up labelled `14.00, 15.00, 16.00`. A step of 1 needs none; only a
 * fractional step needs any.
 */
export function decimalsForStep(step: number): number {
  const size = Math.abs(step)
  if (!Number.isFinite(size) || size === 0 || size >= 1) return 0
  return Math.min(6, Math.ceil(-Math.log10(size)))
}

/** A reading with grouped thousands and a real minus sign. */
export function formatReading(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '?'
  const [whole, fraction] = Math.abs(value).toFixed(decimals).split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS)
  // `value < 0` rather than a sign check, so -0 does not print as "−0".
  return (value < 0 ? MINUS : '') + grouped + (fraction ? `.${fraction}` : '')
}

/**
 * A formatter fixed to one domain, so every label on an axis and every figure
 * in the summary beside it carry the same number of decimals. Ragged decimals
 * down a column are the thing that makes a readout look untrustworthy.
 */
export function readingFormatter(domain: [number, number]): (value: number) => string {
  const decimals = decimalsFor(domain[1] - domain[0])
  return (value) => formatReading(value, decimals)
}
