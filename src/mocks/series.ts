/**
 * Time series for the charts, shaped like the real measurements rather than
 * like pleasant sine waves.
 *
 * Everything here is deterministic: a seeded generator, so a chart looks the
 * same on every reload and a visual difference means something changed.
 */

export interface Point {
  /** Milliseconds since epoch. */
  t: number
  /** `null` is a genuine gap, and charts must break the line rather than bridge it. */
  v: number | null
}

/** Small deterministic PRNG, so mock charts do not shimmer between reloads. */
function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const MINUTE = 60_000

/**
 * The analyser's CO2 trace across one cycle: a sawtooth.
 *
 * This is the shape in the client's own Fig. 1. Concentration climbs while a
 * chamber is sealed, then drops back when the manifold moves to the next one.
 * Reading it against MPVPosition is how a scientist confirms a measurement is
 * real, which is why the two are always plotted together.
 */
export function analyserCycle(options: { positions?: number[]; closureMinutes?: number } = {}) {
  // The client's own array skips 5.
  const positions = options.positions ?? [1, 2, 3, 4, 6, 7, 8]
  const closure = options.closureMinutes ?? 10
  const random = seeded(7)
  const start = new Date('2026-08-30T01:00:00Z').getTime()

  const co2: Point[] = []
  const mpv: Point[] = []
  let t = start

  for (const position of positions) {
    const baseline = 430 + random() * 20
    const rise = 260 + random() * 90
    for (let minute = 0; minute < closure; minute += 0.5) {
      const progress = minute / closure
      co2.push({ t, v: baseline + rise * progress + (random() - 0.5) * 8 })
      mpv.push({ t, v: position })
      t += 0.5 * MINUTE
    }
  }
  return { co2, mpv }
}

/**
 * One chamber's closure, as the flux chart draws it.
 *
 * The first 60 seconds are the dead band: the client discards them because the
 * air has not settled after the lid shuts. The line is fitted to what remains.
 *
 * ⚠️ The wireframe's axis runs 0 to 180 s while the client's document describes
 * a 600 s closure. That contradiction is unresolved, so this takes a duration
 * rather than assuming one.
 */
export function closureTrace(options: { seconds?: number; deadBandSeconds?: number } = {}) {
  const seconds = options.seconds ?? 180
  const deadBand = options.deadBandSeconds ?? 60
  const random = seeded(11)
  const start = new Date('2026-08-30T15:02:00Z').getTime()

  const points: Point[] = []
  for (let s = 0; s <= seconds; s += 2) {
    // Unsettled while the dead band lasts, then a clean linear rise.
    const settling = s < deadBand ? Math.exp(-s / 18) * 22 : 0
    points.push({ t: start + s * 1000, v: 440 + 0.58 * s + settling + (random() - 0.5) * 3 })
  }
  return { points, deadBandSeconds: deadBand, slope: 0.58, r2: 0.99 }
}

/**
 * A chamber's environment channels over 24 hours, for the stacked small
 * multiples on the detail pages.
 *
 * `soilTC` is null throughout, because array chambers have no soil probe
 * fitted. That is a channel to disable, not one to hide, and these components
 * need a case that exercises it.
 */
export function environment24h(seed = 3) {
  const random = seeded(seed)
  const end = new Date('2026-08-30T15:02:00Z').getTime()
  const step = 15 * MINUTE
  const count = (24 * 60) / 15

  const temp: Point[] = []
  const humidity: Point[] = []
  const pressure: Point[] = []
  const soilTC: Point[] = []

  for (let i = 0; i < count; i += 1) {
    const t = end - (count - i) * step
    const dayPhase = Math.sin((i / count) * Math.PI * 2 - Math.PI / 2)
    temp.push({ t, v: 15 + dayPhase * 1.4 + (random() - 0.5) * 0.2 })
    humidity.push({ t, v: 69 - dayPhase * 8 + (random() - 0.5) * 1.5 })
    pressure.push({ t, v: 96_290 + dayPhase * 110 + (random() - 0.5) * 30 })
    soilTC.push({ t, v: null })
  }
  return { temp, humidity, pressure, soilTC }
}

/**
 * One flux value per closure across 24 hours, roughly 16 cycles a day.
 *
 * A couple of points are null: a closure whose fit was too poor to trust is not
 * a flux of zero, and the chart has to say so by breaking rather than dipping.
 */
export function fluxPerClosure(seed = 5): Point[] {
  const random = seeded(seed)
  const end = new Date('2026-08-30T15:02:00Z').getTime()
  const step = 90 * MINUTE

  return Array.from({ length: 16 }, (_, i) => {
    const t = end - (16 - i) * step
    const failedFit = i === 4 || i === 11
    return { t, v: failedFit ? null : 3.6 + Math.sin(i / 2.2) * 1.1 + (random() - 0.5) * 0.5 }
  })
}

/**
 * The analyser filtered to one valve position, as screen 3b draws it: four gas
 * channels over 24 hours, plus the intervals when the valve was actually there.
 *
 * The intervals are the point. The analyser samples one chamber at a time, so a
 * chart filtered to position 1 holds real readings only inside them; between
 * them the line is interpolated. Roughly 16 cycles a day means roughly 13
 * visits inside a 24 h window, each about 10 minutes long.
 */
export function analyser24h(position = 1, seed = 13) {
  const random = seeded(seed + position)
  const end = new Date('2026-08-30T15:00:00Z').getTime()
  const step = 5 * MINUTE
  const count = (24 * 60) / 5

  const co2: Point[] = []
  const co2Dry: Point[] = []
  const ch4: Point[] = []
  const ch4Dry: Point[] = []

  for (let i = 0; i < count; i += 1) {
    const t = end - (count - i) * step
    const drift = Math.sin((i / count) * Math.PI * 2 - Math.PI / 2)
    const wobble = Math.sin(i / 7) * 6
    const base = 445 + drift * 18 + wobble + (random() - 0.5) * 9
    co2.push({ t, v: base })
    // The dry mole fraction runs a few ppm above the wet one, and the wireframe
    // tells them apart by line style rather than by colour.
    co2Dry.push({ t, v: base + 3.4 + (random() - 0.5) * 4 })

    const methane = 2.2 + drift * 0.12 + Math.sin(i / 5) * 0.09 + (random() - 0.5) * 0.05
    ch4.push({ t, v: methane })
    ch4Dry.push({ t, v: methane + 0.02 + (random() - 0.5) * 0.03 })
  }

  const visitEvery = 105 * MINUTE
  const dwell = 10 * MINUTE
  const first = end - 24 * 60 * MINUTE
  const intervals: Array<{ from: number; to: number }> = []
  for (let t = first + 20 * MINUTE; t < end; t += visitEvery) {
    intervals.push({ from: t, to: t + dwell })
  }

  return { co2, co2Dry, ch4, ch4Dry, intervals, window: [first, end] as [number, number] }
}
