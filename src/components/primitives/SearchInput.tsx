import { TextInput, type TextInputProps } from '@/components/primitives/TextInput'
import { SearchIcon } from '@/components/primitives/icons'

/**
 * SearchInput
 *
 * The device filter on the Devices screen. A thin wrapper over TextInput rather
 * than its own field, so the two can never drift apart visually.
 *
 * `type="search"` is deliberate: it gives the browser's own clear button and
 * lets a screen reader announce the field as a search box.
 */

export type SearchInputProps = Omit<TextInputProps, 'leading' | 'type'>

export function SearchInput({ placeholder = 'Search devices', ...props }: SearchInputProps) {
  return (
    <TextInput
      type="search"
      placeholder={placeholder}
      leading={<SearchIcon className="size-4" />}
      {...props}
    />
  )
}
