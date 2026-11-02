import { useEffect, useRef, useState } from 'react'

/** True once the element has entered the viewport. Stays true. */
export function useReveal(options = {}) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px', ...options }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown, options.threshold, options.rootMargin])

  return [ref, shown]
}

/** Whether the element is anywhere near the viewport — used to keep
 *  heavy things (WebGL, video decoding) idle while off screen. */
export function useNearViewport(margin = '35%') {
  const ref = useRef(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: margin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])

  return [ref, near]
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** 0 → 1 across the whole document. */
export function useScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const d = document.documentElement
      const span = d.scrollHeight - d.clientHeight
      setPct(span > 0 ? Math.min(1, d.scrollTop / span) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return pct
}
