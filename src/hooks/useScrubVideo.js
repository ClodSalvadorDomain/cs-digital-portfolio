import { useEffect, useRef, useState } from 'react'

/**
 * Binds a <video> timeline to the scroll position of a track element.
 *
 * The track is taller than the viewport; its sticky child stays put while
 * the page scrolls through it, and that travel maps 0 → 1 onto the clip.
 *
 * Notes that cost real debugging time:
 *  - Seeking only works once the browser knows the duration, so everything
 *    waits on `loadedmetadata`.
 *  - iOS will not honour `currentTime` on a clip it considers untouched.
 *    One muted play()/pause() pair unlocks the decoder; we do it on the
 *    first scroll or touch and never again.
 *  - Target time is lerped rather than assigned, otherwise a trackpad fling
 *    produces a stutter of discrete jumps instead of a scrub.
 */
export function useScrubVideo({ enabled = true } = {}) {
  const trackRef = useRef(null)
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  const target = useRef(0)
  const current = useRef(0)
  const unlocked = useRef(false)

  // Keep metadata state in its own effect so a source swap (desktop ↔ mobile)
  // re-arms it rather than leaving `ready` stale.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onMeta = () => setReady(Number.isFinite(v.duration) && v.duration > 0)
    if (v.readyState >= 1) onMeta()
    v.addEventListener('loadedmetadata', onMeta)
    return () => v.removeEventListener('loadedmetadata', onMeta)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const track = trackRef.current
    const video = videoRef.current
    if (!track || !video) return

    let raf = 0
    let running = true

    const unlock = () => {
      if (unlocked.current) return
      unlocked.current = true
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => video.pause()).catch(() => {})
      } else {
        try { video.pause() } catch { /* nothing to recover from */ }
      }
    }

    const measure = () => {
      const rect = track.getBoundingClientRect()
      const span = rect.height - window.innerHeight
      if (span <= 0) return 0
      return Math.min(1, Math.max(0, -rect.top / span))
    }

    const tick = () => {
      if (!running) return
      const p = measure()
      setProgress(p)

      const duration = video.duration
      if (Number.isFinite(duration) && duration > 0) {
        // Stop a hair short of the end: seeking to exactly `duration`
        // makes some browsers fire `ended` and blank the frame.
        target.current = p * (duration - 0.05)
        current.current += (target.current - current.current) * 0.16

        if (Math.abs(current.current - video.currentTime) > 1 / 48) {
          if (typeof video.fastSeek === 'function') {
            video.fastSeek(current.current)
          } else {
            video.currentTime = current.current
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const onFirstMove = () => {
      unlock()
      window.removeEventListener('scroll', onFirstMove)
      window.removeEventListener('touchstart', onFirstMove)
    }

    window.addEventListener('scroll', onFirstMove, { passive: true, once: false })
    window.addEventListener('touchstart', onFirstMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onFirstMove)
      window.removeEventListener('touchstart', onFirstMove)
    }
  }, [enabled])

  return { trackRef, videoRef, progress, ready }
}
