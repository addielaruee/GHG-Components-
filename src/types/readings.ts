/**
 * Row shapes, taken from the client's own sample files rather than from prose.
 *
 * Field names follow the files, not the wireframe. The wireframe labels a value
 * "Lid Func" while showing what the file calls `Lid_Status`, and inventing a
 * third naming would make both harder to trace. Display labels are a rendering
 * concern and live with the components.
 *
 * **Every sensor value is `number | null`.** Not optional, not zero. The
 * client's files are full of columns for sensors that were never fitted, hours
 * lost when a Raspberry Pi lost power mid-write, and devices that stop
 * answering. A missing measurement rendered as `0` is a false data point in a
 * scientific instrument, indistinguishable from a real reading of zero flux, so
 * the type refuses to let it happen quietly.
 */

/** Raw sensor value, or `null` when there is no measurement. Never 0. */
export type Reading = number | null

// ---------------------------------------------------------------------------
// Analyser
// ---------------------------------------------------------------------------

/**
 * The 13 columns the client asked for, out of the analyser's 38.
 *
 * He named the rest as noise: "There are some other columns such as N2O_2min or
 * _5min, please ignore these columns." The actual file carries `_30s`, `_1min`
 * and `_5min` variants, so match on the suffix rather than on his exact list.
 */
export interface AnalyserReading {
  /** ISO date from the file, e.g. "2022-05-07". */
  date: string
  /** "12:41:39.950". Sub-second precision is real; the analyser logs at 1 Hz. */
  time: string
  alarmStatus: number
  instStatus: number
  /** Which chamber the manifold is pointed at. See `toChamberPosition`. */
  mpvPosition: number
  n2o: Reading
  n2oDry: Reading
  co2: Reading
  co2Dry: Reading
  ch4: Reading
  ch4Dry: Reading
  h2o: Reading
  nh3: Reading
}

/**
 * `MPVPosition` is a float, and that is a trap worth knowing about.
 *
 * The valve takes time to move, and rows logged mid-travel carry values like
 * 1.5012106538 or 3.6164383562. Rounding or truncating those invents readings
 * for a chamber that was not being sampled. In the client's own sample file
 * there are eight such rows.
 *
 * Values of 9 and above are not chambers at all. The client: "These IDs are
 * assigned to measurements from gas cylinders or air for background check and
 * are not part of the measurements." In that same file position 9 accounts for
 * 1,729 rows, more than any real chamber, so failing to drop them skews
 * everything downstream.
 *
 * Returns the chamber number, or `null` when the row is mid-travel or a
 * calibration check.
 */
export function toChamberPosition(mpvPosition: number): number | null {
  if (!Number.isInteger(mpvPosition)) return null
  if (mpvPosition < 1 || mpvPosition >= 9) return null
  return mpvPosition
}

// ---------------------------------------------------------------------------
// Chambers
// ---------------------------------------------------------------------------

/** Whether the lid is shut. The string is `Close`, not `Closed`. */
export type LidStatus = 'Open' | 'Close'

/**
 * Where the lid is in its travel, which is not the same as `lidStatus`. The
 * sample file contains exactly these four, in this cycle.
 */
export type LidFunc = 'opening2' | 'opened-OK2' | 'closing2' | 'closed-OK2'

/** Only `Mode2` appears in the sample. Left open until the client says more. */
export type ModeStatus = string

/** Columns both chamber kinds carry. */
interface ChamberReadingBase {
  /** ⚠️ Format differs by rig: array mode writes "19/06/2025", standalone "2025-06-19". */
  date: string
  /** ⚠️ Array-mode samples have lost their hour to Excel and read "04:57.8". */
  time: string
  chamberId: string
  lidStatus: LidStatus
  lidFunc: LidFunc
  fanStatus: 'On' | 'Off'
  modeStatus: ModeStatus
  avSd: Reading
  totalSd: Reading
  usedSd: Reading
  chamberTempC: Reading
  chamberRhPct: Reading
  chamberPressurePa: Reading
  soilMRaw: Reading
}

/**
 * A chamber inside the array. It has no gas sensor of its own: the analyser
 * measures it through the manifold, which is why there is no `co2Ppm` here.
 * Its soil and light columns exist in the file but are always empty.
 */
export interface ArrayChamberReading extends ChamberReadingBase {
  kind: 'array'
  lightDown: Reading
}

/** A standalone chamber, which carries its own CO2 sensor and a fuller soil kit. */
export interface StandaloneChamberReading extends ChamberReadingBase {
  kind: 'standalone'
  /** The defining difference. Array chambers have no equivalent. */
  co2Ppm: Reading
  soilTC: Reading
  soilEc: Reading
  lightUp: Reading
  lightDown: Reading
}

/**
 * Discriminated on `kind` rather than one shape with optional fields. The two
 * genuinely report different columns, and the wireframe is built on that split
 * throughout: separate tables, separate cards, and a dashboard tile that can
 * hold one type or the other but never both.
 */
export type ChamberReading = ArrayChamberReading | StandaloneChamberReading

// ---------------------------------------------------------------------------
// Derived
// ---------------------------------------------------------------------------

/**
 * One flux value, computed over a single closure.
 *
 * The client's method: drop the first 60 seconds, fit a straight line to
 * concentration against elapsed time, and put the slope through his equation.
 * `r2` travels with it because a poor fit is the signal that a measurement
 * should not be trusted.
 */
export interface FluxResult {
  gas: 'CO2' | 'CH4' | 'N2O'
  /** µmol m⁻² s⁻¹. `null` when the closure has not finished or the fit failed. */
  value: Reading
  /** Slope of the fitted line, ppm s⁻¹. */
  slope: Reading
  r2: Reading
  /** ISO timestamp of the closure this came from. */
  closedAt: string
}

/**
 * One full rotation of the analyser through its chambers. The client's own term
 * and his natural unit: roughly 16 a day, each about an hour.
 */
export interface Cycle {
  id: string
  startedAt: string
  endedAt: string | null
  /** Chamber numbers measured in this cycle, calibration positions excluded. */
  chamberPositions: number[]
}
