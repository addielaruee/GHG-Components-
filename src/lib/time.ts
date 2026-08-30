/**
 * Time formatting for device readings.
 *
 * Shared because DeviceCard and AnalyserCard both describe when a row last
 * arrived, and AnalyserCard was quietly printing a hardcoded "last row 12 s
 * ago" while DeviceCard computed its own.
 *
 * **These never say a device is unreachable, and that is deliberate.** An
 * earlier version called anything over an hour old "unreachable since 09:14",
 * which is wrong for this project: the client asked about forwarding data
 * **every six hours** because the sites have poor connectivity, so a perfectly
 * healthy chamber can be five hours stale by design. Whether a gap is a fault
 * depends on the agreed cadence, which is still an open question with the
 * client, and a formatting helper has no way to know it.
 *
 * So these state the elapsed time and stop. A device's `status` carries the
 * judgement, and a caller that genuinely knows a device has failed can pass its
 * own wording.
 */

/** "just now", "2 min ago", "5 h ago", "3 d ago". Never a verdict. */
export function formatElapsed(iso: string | null): string {
  if (!iso) return 'never reported'

  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 45) return 'just now'

  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`

  return `${Math.round(hours / 24)} d ago`
}

/** "last row 2 min ago", the phrasing the wireframe uses on device cards. */
export function formatLastRow(iso: string | null): string {
  if (!iso) return 'never reported'
  return `last row ${formatElapsed(iso)}`
}

/** "09:14", for when a caller does want to name the moment something stopped. */
export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
