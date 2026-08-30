import type {
  Analyser,
  ArrayChamber,
  Device,
  StandaloneChamber,
} from '@/types/device'
import type { ArrayChamberReading, StandaloneChamberReading } from '@/types/readings'

/**
 * A fleet to build screens against, shaped like the client's real one.
 *
 * The point of these is the awkward cases, not the tidy ones. Building a table
 * against clean invented data hides exactly what breaks it, and the client's
 * files are not clean: sensors that were never fitted, an hour lost to a power
 * cut mid-write, devices that stop answering without saying so.
 *
 * Deliberately included:
 *
 *   - **The array skips position 5.** His own file cycles 1, 2, 3, 4, 6, 7, 8.
 *     Anything deriving position from an array index will be wrong here, which
 *     is the point.
 *   - **CH-04 has gone quiet**, hours ago, with its last reading still on file.
 *     Stale values must not be shown as current.
 *   - **CH-S23 is unreachable** and has no reading at all, which is a different
 *     state again.
 *   - **CH-S26 has never produced a flux**, distinct from a flux of zero.
 *   - **Unfitted sensors are null throughout**, never 0.
 */

const now = new Date('2026-08-30T15:02:00Z')
const ago = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString()

function arrayReading(
  chamberId: string,
  overrides: Partial<ArrayChamberReading> = {},
): ArrayChamberReading {
  return {
    kind: 'array',
    // The array rig writes day-first, and its samples have lost the hour.
    date: '19/06/2025',
    time: '04:57.8',
    chamberId,
    lidStatus: 'Open',
    lidFunc: 'opened-OK2',
    fanStatus: 'On',
    modeStatus: 'Mode2',
    avSd: 1.84,
    totalSd: 4.2,
    usedSd: 11.42,
    chamberTempC: 15.1,
    chamberRhPct: 71,
    chamberPressurePa: 96_340,
    soilMRaw: 742,
    // Present in the file, empty in every row: this rig has no light sensor.
    lightDown: null,
    ...overrides,
  }
}

function standaloneReading(
  chamberId: string,
  overrides: Partial<StandaloneChamberReading> = {},
): StandaloneChamberReading {
  return {
    kind: 'standalone',
    // The standalone rig writes ISO, unlike the array rig.
    date: '2025-06-19',
    time: '15:06:19.990544',
    chamberId,
    lidStatus: 'Close',
    lidFunc: 'closed-OK2',
    fanStatus: 'On',
    modeStatus: 'Mode2',
    avSd: 23.62,
    totalSd: 28.72,
    usedSd: 3.63,
    co2Ppm: 452,
    chamberTempC: 14.8,
    chamberRhPct: 68,
    chamberPressurePa: 96_340,
    soilMRaw: 742,
    soilTC: 11.6,
    soilEc: null,
    lightUp: null,
    lightDown: 677.2,
    ...overrides,
  }
}

/** Positions on the manifold. Note the gap: the client's own rig has no 5. */
const ARRAY_POSITIONS = [1, 2, 3, 4, 6, 7, 8]

export const analyser: Analyser = {
  id: 'anlz-1',
  kind: 'analyser',
  name: 'Analyser',
  mode: 'array',
  status: 'ok',
  lastRowAt: ago(0.2),
  chamberIds: ARRAY_POSITIONS.map((p) => `ch-${String(p).padStart(2, '0')}`),
  activeChamberId: 'ch-01',
  latest: {
    date: '2022-05-07',
    time: '12:41:39.950',
    alarmStatus: 0,
    instStatus: 963,
    mpvPosition: 1,
    n2o: 0.338,
    n2oDry: 0.341,
    co2: 438,
    co2Dry: 442,
    ch4: 2.11,
    ch4Dry: 2.13,
    h2o: 14.2,
    nh3: null,
  },
}

export const arrayChambers: ArrayChamber[] = ARRAY_POSITIONS.map((position, index) => {
  const id = `ch-${String(position).padStart(2, '0')}`
  // CH-04 stopped answering five hours ago. Its last reading is still on file,
  // which is exactly the case that tempts a screen into showing stale numbers.
  const quiet = position === 4
  return {
    id,
    kind: 'array',
    name: id.toUpperCase(),
    analyserId: analyser.id,
    position,
    status: quiet ? 'warn' : 'ok',
    lastRowAt: quiet ? ago(300) : ago(index + 0.2),
    latest: arrayReading(String(position), {
      lidStatus: position === 1 ? 'Close' : 'Open',
      lidFunc: position === 1 ? 'closed-OK2' : 'opened-OK2',
      chamberTempC: quiet ? null : 14.4 + index * 0.2,
      chamberRhPct: quiet ? null : 64 + index,
      soilMRaw: quiet ? null : 650 + index * 18,
    }),
    latestFlux: quiet
      ? null
      : {
          gas: 'CO2',
          value: 2.4 + index * 0.3,
          slope: 0.58,
          r2: 0.99,
          closedAt: ago(index * 10 + 4),
        },
  }
})

export const standaloneChambers: StandaloneChamber[] = [
  {
    id: 'ch-s21',
    kind: 'standalone',
    name: 'CH-S21',
    status: 'ok',
    lastRowAt: ago(2),
    ipAddress: '192.168.1.51',
    location: { lat: 54.315, lon: -2.1 },
    latest: standaloneReading('21'),
    latestFlux: { gas: 'CO2', value: 5.1, slope: 0.58, r2: 0.99, closedAt: ago(4) },
  },
  {
    id: 'ch-s22',
    kind: 'standalone',
    name: 'CH-S22',
    status: 'ok',
    lastRowAt: ago(0.7),
    ipAddress: '192.168.1.52',
    location: { lat: 54.309, lon: -2.094 },
    latest: standaloneReading('22', {
      lidStatus: 'Open',
      lidFunc: 'opened-OK2',
      co2Ppm: 479,
      chamberTempC: 15.2,
      usedSd: 8.06,
    }),
    latestFlux: { gas: 'CO2', value: 4.62, slope: 0.51, r2: 0.97, closedAt: ago(15) },
  },
  {
    // Unreachable, and with no reading at all. Not the same as CH-04, which is
    // quiet but has history.
    id: 'ch-s23',
    kind: 'standalone',
    name: 'CH-S23',
    status: 'warn',
    lastRowAt: ago(348),
    ipAddress: '192.168.1.53',
    location: { lat: 54.322, lon: -2.081 },
    latest: null,
    latestFlux: null,
  },
  {
    id: 'ch-s24',
    kind: 'standalone',
    name: 'CH-S24',
    status: 'ok',
    lastRowAt: ago(0.9),
    ipAddress: '192.168.1.54',
    location: { lat: 54.301, lon: -2.088 },
    latest: standaloneReading('24', { co2Ppm: 468, chamberTempC: 15.9 }),
    latestFlux: { gas: 'CO2', value: 3.9, slope: 0.44, r2: 0.98, closedAt: ago(6) },
  },
  {
    id: 'ch-s25',
    kind: 'standalone',
    name: 'CH-S25',
    status: 'ok',
    lastRowAt: ago(3),
    ipAddress: '192.168.1.55',
    // Never placed on the map. Coordinates are typed in by hand.
    location: null,
    latest: standaloneReading('25', {
      lidStatus: 'Open',
      lidFunc: 'opened-OK2',
      co2Ppm: 441,
      chamberTempC: 14.1,
    }),
    latestFlux: { gas: 'CO2', value: 2.98, slope: 0.31, r2: 0.94, closedAt: ago(9) },
  },
  {
    // Running, but has not completed a closure yet, so there is no flux to show.
    // "No flux yet" is a different statement from a flux of zero.
    id: 'ch-s26',
    kind: 'standalone',
    name: 'CH-S26',
    status: 'ok',
    lastRowAt: ago(1),
    ipAddress: '192.168.1.56',
    location: { lat: 54.318, lon: -2.073 },
    latest: standaloneReading('26', {
      lidStatus: 'Open',
      lidFunc: 'opening2',
      fanStatus: 'Off',
      co2Ppm: null,
      chamberTempC: 16.2,
      soilTC: null,
    }),
    latestFlux: null,
  },
]

export const devices: Device[] = [analyser, ...arrayChambers, ...standaloneChambers]
