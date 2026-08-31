import { useLayoutEffect, useRef, useState } from 'react'

/**
 * The rendered width of an element, kept current as it resizes.
 *
 * Charts need real pixels rather than a scaling viewBox. A viewBox with
 * `preserveAspectRatio="none"` stretches everything inside it, so axis labels
 * distort and a 2px line becomes 2px in one direction and something else in the
 * other. Measuring instead keeps text at its intended size and strokes even.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => setWidth(element.clientWidth)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}
