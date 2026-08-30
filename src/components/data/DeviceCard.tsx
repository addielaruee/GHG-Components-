import { useState } from 'react'
import { DeviceCardHeader } from '@/components/data/DeviceCardHeader'
import { StatStrip, type Stat } from '@/components/data/StatStrip'
import { TrendArrow } from '@/components/primitives/TrendArrow'
import { EmptyValue } from '@/components/primitives/EmptyValue'
import { StatusDot } from '@/components/primitives/StatusDot'
import { cn } from '@/lib/cn'
import type { StandaloneChamber } from '@/types/device'

/**
 * DeviceCard
 *
 * A standalone chamber in the card view, in four bands:
 *
 *   ● CH-S21 · standalone                                     ⌄
 *     192.168.1.51 · last row 2 min ago
 *   ┌ CO2_ppm  SoilT_C  SoilM_Raw  Temp C  UsedSD ┐
 *   Lid closed · fan on · Mode status 2      RH 68 % · 96 340 Pa
 *   Latest CO₂ flux · cycle 15:02          5.10 µmol m⁻² s⁻¹ ↑
 *
 * **`CollapsedDeviceRow` is this component collapsed**, not a separate one. The
 * wireframe shows six cards in two states and they are visibly the same object;
 * CH-S23 and CH-S26 are simply closed. Building the collapsed form separately
 * would mean a second copy of the header band, so the chevron toggles instead.
 * It still counts toward the 52, it just is not its own file.
 *
 * A device with no reading collapses and stays collapsed. There is nothing
 * truthful to put in the strip, and three bands of em dashes would read as a
 * fault in the dashboard rather than in the paddock.
 */

export interface DeviceCardProps {
  device: StandaloneChamber
  /** The five fields the strip shows. The caller picks them; the card lays them out. */
  stats: Stat[]
  /** Start collapsed. A device with no reading is collapsed regardless. */
  defaultCollapsed?: boolean
  /** Sits left of the chevron, for a "No response" badge. */
  aside?: React.ReactNode
  className?: string
}

export function DeviceCard({
  device,
  stats,
  defaultCollapsed,
  aside,
  className,
}: DeviceCardProps) {
  const hasReading = device.latest !== null
  const [open, setOpen] = useState(!defaultCollapsed && hasReading)
  const expanded = open && hasReading

  const reading = device.latest

  return (
    <div
      className={cn(
        'rounded-panel border border-line-strong bg-surface shadow-panel',
        className,
      )}
    >
      <div className="px-4 py-3">
        <DeviceCardHeader
          status={device.status}
          name={device.name}
          kind="standalone"
          meta={
            device.ipAddress
              ? [device.ipAddress, describeLastRow(device.lastRowAt)]
              : [describeLastRow(device.lastRowAt)]
          }
          aside={aside}
          expanded={expanded}
          // A card with nothing to show has nothing to open.
          onToggle={hasReading ? () => setOpen((o) => !o) : undefined}
        />
      </div>

      {expanded && reading && (
        <>
          <StatStrip size="sm" stats={stats} />

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-2 text-[13px]">
            <span className="text-ink/70">
              Lid {reading.lidStatus === 'Close' ? 'closed' : 'open'} · fan{' '}
              {reading.fanStatus.toLowerCase()} · {reading.modeStatus}
            </span>
            <span className="text-ink/55 tabular-nums">
              RH {reading.chamberRhPct ?? <EmptyValue reason="No humidity reading" />} % ·{' '}
              {reading.chamberPressurePa ?? <EmptyValue reason="No pressure reading" />} Pa
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-2.5">
            <span className="text-[13px] text-ink/55">
              Latest CO₂ flux{device.latestFlux ? ` · cycle ${clock(device.latestFlux.closedAt)}` : ''}
            </span>
            {device.latestFlux?.value == null ? (
              <span className="text-[13px]">
                <EmptyValue reason="No closure has completed yet" /> no flux yet
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums">
                {device.latestFlux.value.toFixed(2)} µmol m⁻² s⁻¹
                <TrendArrow direction="up" />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/** "last row 2 min ago", or the plainer truth when it has been a while. */
function describeLastRow(iso: string | null) {
  if (!iso) return 'never reported'
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000)
  if (minutes < 1) return 'last row just now'
  if (minutes < 60) return `last row ${minutes} min ago`
  return `unreachable since ${clock(iso)}`
}

function clock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Re-exported so a caller can build the header without importing two files. */
export { DeviceCardHeader, StatusDot }
