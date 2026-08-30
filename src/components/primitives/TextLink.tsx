import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * TextLink
 *
 * Accent-coloured text that does something. In the wireframe: "Show 4 more
 * array chambers", "12 more", "Select all 8", "Edit channels", and
 * "Open CH-01 chamber page →".
 *
 * Most of those reveal more of the current page rather than navigating, so the
 * default element is a <button>. Pass `href` only when it genuinely goes
 * somewhere. A button styled as a link cannot be opened in a new tab, and a
 * link that only expands a list is a lie to anyone using a screen reader.
 */

type CommonProps = {
  size?: 'sm' | 'md'
  className?: string
  children: React.ReactNode
}

type TextLinkProps = CommonProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>)
  )

const sizes = {
  sm: 'text-xs',
  md: 'text-[13px]',
}

const base = [
  'inline-flex cursor-pointer items-center gap-1 font-medium',
  'text-accent underline-offset-2 hover:underline',
  'rounded-[3px] outline-none focus-visible:ring-[3px] focus-visible:ring-accent/30',
  'disabled:pointer-events-none disabled:opacity-45',
].join(' ')

export function TextLink({ size = 'md', className, children, ...props }: TextLinkProps) {
  if (props.href !== undefined) {
    const { href, ...rest } = props
    return (
      <a href={href} className={cn(base, sizes[size], className)} {...rest}>
        {children}
      </a>
    )
  }

  const { href: _ignored, type = 'button', ...rest } = props
  return (
    <button type={type} className={cn(base, sizes[size], className)} {...rest}>
      {children}
    </button>
  )
}
