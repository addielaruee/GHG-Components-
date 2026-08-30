import { MetaList } from '@/components/primitives/MetaList'
import { StatusDot, type Status } from '@/components/primitives/StatusDot'
import { cn } from '@/lib/cn'

/**
 * PlacedDevicesList
 *
 * The right rail of the map view: every device that has coordinates.
 *
 *   Placed devices
 *   ● Analyser      8 array chambers
 *   ● CH-S21        standalone · 192.168.1.51
 *   ● CH-S23        standalone · no response
 *
 * Its name is doing real work. The chambers have no GPS, so coordinates are
 * typed in by hand and a device stays *unplaced* until somebody does it. This
 * list is therefore not "all devices", and calling it that would hide the ones
 * missing from the map. The wireframe's own note says devices without
 * coordinates "are listed separately with a Place action".
 *
 * Selecting a row is paired with a pin on the map, so a row highlights rather
 * than navigating. That is why it carries a selected state instead of behaving
 * like a link.
 */

export interface PlacedDevice {
  id: string
  name: React.ReactNode
  status: Status
  /** Facts under the name, joined with a middot. */
  meta?: React.ReactNode[]
}

export interface PlacedDevicesListProps {
  title?: React.ReactNode
  devices: PlacedDevice[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  /** Shown when nothing has been placed yet. */
  empty?: React.ReactNode
  className?: string
}

export function PlacedDevicesList({
  title = 'Placed devices',
  devices,
  selectedId,
  onSelect,
  empty = 'No devices have been placed on the map yet.',
  className,
}: PlacedDevicesListProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold tracking-[-0.006em] text-ink">{title}</h3>
      </div>

      {devices.length === 0 ? (
        <p className="px-4 py-6 text-center text-[13px] text-ink/45">{empty}</p>
      ) : (
        <ul>
          {devices.map((device) => {
            const selected = device.id === selectedId
            return (
              <li key={device.id} className="border-b border-line-soft last:border-0">
                <button
                  type="button"
                  aria-current={selected ? 'true' : undefined}
                  onClick={() => onSelect?.(device.id)}
                  className={cn(
                    'flex w-full cursor-pointer items-start gap-2.5 px-4 py-2.5 text-left',
                    'transition-colors duration-150',
                    'outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30 focus-visible:ring-inset',
                    selected ? 'bg-accent/[0.05]' : 'hover:bg-ink/[0.03]',
                  )}
                >
                  {/* Decorative: the meta line already says "no response". */}
                  <StatusDot status={device.status} label={null} size="sm" className="mt-1.5" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-ink">
                      {device.name}
                    </span>
                    {device.meta && (
                      <MetaList items={device.meta} className="block truncate text-xs" />
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
