import type { DeviceTone } from '@/components/primitives/Badge'

/**
 * Which device a number came from, as a tag and as an edge colour.
 *
 * Here rather than beside `ChartCard` so the chart card exports components
 * only, and because more than the chart card needs it: the dashboard editor's
 * tile list draws the same tag, and its footer draws the same three colours as
 * a key.
 *
 * The wireframe's reason for any of this is worth keeping in mind: "so a graph
 * is never read against the wrong source". A CO2 number off the analyser and a
 * CO2 number off a standalone chamber's own sensor are different measurements,
 * and the dashboard stacks them one above another.
 */

export const sourceLabels: Record<DeviceTone, string> = {
  analyser: 'ANALYSER',
  array: 'ARRAY-MODE',
  standalone: 'STANDALONE',
}

/** The card's left edge. Background utilities, so they compose with `cn`. */
export const sourceEdge: Record<DeviceTone, string> = {
  analyser: 'bg-device-analyser',
  array: 'bg-device-array',
  standalone: 'bg-device-standalone',
}
