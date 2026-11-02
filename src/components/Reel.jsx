import { useScrubVideo } from '../hooks/useScrubVideo'
import { useMediaQuery, useNearViewport, useReducedMotion } from '../hooks/useViewport'

/**
 * A featured build, with its walkthrough bound to the scroll wheel.
 * Scrolling forward plays the site; scrolling back rewinds it.
 */
export default function Reel({ reel, span = 300, index }) {
  const reduced = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 760px)')
  const [nearRef, near] = useNearViewport('30%')
  const { trackRef, videoRef, progress, ready } = useScrubVideo({
    enabled: !reduced && near,
  })

  const src = narrow && reel.srcMobile ? reel.srcMobile : reel.src

  // Which note the footage is currently sitting on.
  const activeNote = reel.notes.reduce(
    (best, note, i) => (progress >= note.at ? i : best),
    0
  )

  const head = (
    <div className="reel-head">
      <div>
        <p className="reel-client">{reel.client}</p>
        <h2>{reel.title}</h2>
      </div>
      <div className="reel-meta">
        {reel.chips.map((c) => (
          <span className="chip" key={c}>
            {c}
          </span>
        ))}
        {reel.live && (
          <a className="chip" href={reel.live} target="_blank" rel="noopener noreferrer">
            Visit the live site ↗
          </a>
        )}
      </div>
    </div>
  )

  const notes = (
    <div className="reel-notes">
      {reel.notes.map((note, i) => (
        <div
          className="reel-note"
          key={note.label}
          data-active={reduced ? 'true' : i === activeNote}
        >
          <b>{note.label}</b>
          {note.text}
        </div>
      ))}
    </div>
  )

  /* Reduced motion keeps the composition and gives the visitor the
     controls instead of taking the timeline off them. */
  if (reduced) {
    return (
      <section className="reel" id={reel.id} ref={nearRef}>
        <div className="wrap-wide reel-sticky">
          {head}
          <div className="glass reel-frame">
            <video src={src} poster={reel.poster} controls preload="none" playsInline />
          </div>
          {notes}
        </div>
      </section>
    )
  }

  return (
    <section className="reel" id={reel.id} ref={nearRef}>
      <div className="reel-track" ref={trackRef} style={{ height: `${span}vh` }}>
        <div className="wrap-wide reel-sticky">
          {head}

          <div className="glass reel-frame">
            <video
              ref={videoRef}
              src={near ? src : undefined}
              poster={reel.poster}
              muted
              playsInline
              preload={near ? 'auto' : 'none'}
              disablePictureInPicture
              tabIndex={-1}
              aria-label={`${reel.client} — walkthrough, scrubbed by scrolling`}
            />
          </div>

          <div className="reel-scrub">
            <span>{String(index + 1).padStart(2, '0')} · scroll to scrub</span>
            <span className="reel-scrub-rail">
              <span
                className="reel-scrub-fill"
                style={{ transform: `scaleX(${progress})`, transformOrigin: 'left' }}
              />
            </span>
            <span>{ready ? `${Math.round(progress * 100)}%` : 'loading'}</span>
          </div>

          {notes}
        </div>
      </div>
    </section>
  )
}
