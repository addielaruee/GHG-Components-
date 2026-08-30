import type { Status } from '@/components/primitives/StatusDot'
import type {
  AnalyserReading,
  ArrayChamberReading,
  FluxResult,
  StandaloneChamberReading,
} from '@/types/readings'

/**
 * Devices, as the dashboard needs to think about them.
 *
 * There are three kinds, not two, and the distinction the wireframe is built on
 * runs right through here:
 *
 *   analyser    one per site, owns the gas measurement for every array chamber
 *   array       a chamber the analyser samples through the manifold, read-only
 *   standalone  a chamber with its own CO2 sensor, reachable and editable
 *
 * A discriminated union rather than one shape with optional fields. An array
 * chamber has no IP address because you do not talk to it directly, and no
 * location because it inherits the analyser's. Making those optional on a
 * shared type would let a screen ask for an address that cannot exist.
 */

/** Scale is small and bounded: about 20 standalone chambers, 8 to 12 per analyser. */
export interface DeviceBase {
  id: string
  /** What the researcher calls it: "CH-S21", "CH-01", "Analyser". */
  name: string
  status: Status
  /**
   * When the last row arrived, ISO. `null` when the device has never reported,
   * which is different from having reported nothing recently.
   */
  lastRowAt: string | null
}

export interface Analyser extends DeviceBase {
  kind: 'analyser'
  /** The client runs array mode today. Left as a field because he has said he may not always. */
  mode: 'array'
  /** Ids of the chambers on its manifold, in position order. */
  chamberIds: string[]
  /** Chamber currently being sampled, or `null` between positions and during calibration. */
  activeChamberId: string | null
  latest: AnalyserReading | null
}

export interface ArrayChamber extends DeviceBase {
  kind: 'array'
  analyserId: string
  /**
   * Its position on the manifold, 1 to 8. Note the client's own array skips 5,
   * so positions are not contiguous and must never be derived from an index.
   */
  position: number
  latest: ArrayChamberReading | null
  /** Computed from the analyser's gas during this chamber's closure, not its own sensor. */
  latestFlux: FluxResult | null
}

export interface StandaloneChamber extends DeviceBase {
  kind: 'standalone'
  /** Reachable directly, unlike an array chamber. */
  ipAddress: string | null
  /** Entered by hand: the chambers have no GPS. `null` until someone places it. */
  location: { lat: number; lon: number } | null
  latest: StandaloneChamberReading | null
  latestFlux: FluxResult | null
}

export type Device = Analyser | ArrayChamber | StandaloneChamber

/** Any chamber, of either kind. Most screens want this rather than `Device`. */
export type Chamber = ArrayChamber | StandaloneChamber

export function isChamber(device: Device): device is Chamber {
  return device.kind !== 'analyser'
}

/**
 * Whether the dashboard may change this device.
 *
 * Array chambers are read-only, and that is a hardware fact rather than a
 * permission: they are reached through the analyser, whose own software is not
 * ours to modify. Only the name and location of a standalone chamber can be
 * edited.
 */
export function isEditable(device: Device): boolean {
  return device.kind === 'standalone'
}
