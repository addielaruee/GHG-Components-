import { Chip } from '@/components/primitives/Chip'
import { TextLink } from '@/components/primitives/TextLink'
import { cn } from '@/lib/cn'

/**
 * ChannelChipRow
 *
 * The channel picker on the chamber pages:
 *
 *   Channels  shared time axis · last 24 h              Edit channels
 *   [Chamber_Temp_C] [Chamber_RH_%] [SoilM_Raw] [SoilT_C · not fitted]
 *
 * This is the client's requirement that users choose which measurements they
 * see, in its smallest form.
 *
 * "shared time axis" is not decoration. Every selected channel plots against
 * one x-axis so a researcher can read a temperature dip against a lid closing
 * at the same instant. Saying so is what stops the row being read as an
 * arbitrary filter.
 *
 * An unfitted channel stays in the row, disabled, rather than being hidden.
 * A chamber that never had a soil probe and one whose probe has failed look
 * identical if the channel simply vanishes, and only one of those is worth
 * driving out to fix.
 */

export interface Channel {
  /** The column name from the file, e.g. `Chamber_Temp_C`. */
  id: string
  /** Shown on the chip. Defaults to the id, which is what the wireframe does. */
  label?: React.ReactNode
  /** This chamber has no such sensor. Rendered disabled and suffixed. */
  notFitted?: boolean
}

export interface ChannelChipRowProps {
  channels: Channel[]
  /** Ids currently plotted. */
  selected: ReadonlySet<string>
  onToggle: (id: string) => void
  /** Describes the axis, e.g. `['shared time axis', 'last 24 h']`. */
  meta?: React.ReactNode
  onEdit?: () => void
  className?: string
}

export function ChannelChipRow({
  channels,
  selected,
  onToggle,
  meta = 'shared time axis · last 24 h',
  onEdit,
  className,
}: ChannelChipRowProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[13px]">
          <span className="font-semibold text-ink">Channels</span>{' '}
          <span className="text-ink/55">{meta}</span>
        </p>
        {onEdit && (
          <TextLink size="sm" onClick={onEdit}>
            Edit channels
          </TextLink>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {channels.map((channel) => (
          <Chip
            key={channel.id}
            active={selected.has(channel.id)}
            disabled={channel.notFitted}
            onClick={() => onToggle(channel.id)}
          >
            {channel.label ?? channel.id}
            {channel.notFitted && ' · not fitted'}
          </Chip>
        ))}
      </div>
    </div>
  )
}
