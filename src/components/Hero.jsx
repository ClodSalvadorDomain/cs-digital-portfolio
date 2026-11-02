import { useEffect, useState } from 'react'
import HeroLattice from './HeroLattice'
import { traceLines } from '../data/content'
import { useNearViewport, useReducedMotion } from '../hooks/useViewport'

function Trace() {
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? traceLines.length : 0)

  useEffect(() => {
    if (reduced) {
      setN(traceLines.length)
      return
    }
    setN(0)
    const timers = traceLines.map((_, i) =>
      setTimeout(() => setN(i + 1), 420 + i * 520)
    )
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  const done = n >= traceLines.length

  return (
    <div className="glass trace">
      <div className="trace-head">
        <span className="trace-head-dot" />
        cs.digital · session trace
      </div>
      <div className="trace-body">
        {traceLines.slice(0, n).map((line) => (
          <div className="trace-line" key={line.tag} data-kind={line.kind}>
            <span>{line.tag}</span>
            <b>
              {line.text}
              {!done && line === traceLines[n - 1] && <i className="trace-caret" />}
            </b>
            <i>{line.ms}</i>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero({ onBook }) {
  const [ref, near] = useNearViewport('10%')

  return (
    <section className="hero" id="top" ref={ref}>
      <HeroLattice active={near} />

      <div className="wrap hero-grid">
        <div>
          <p className="glass glass-pill hero-badge">
            <span className="nav-mark-dot" />
            AI &amp; automation systems · <b>now booking audits</b>
          </p>

          <h1>
            Your business should <em>run itself</em> by now
          </h1>

          <p className="lede">
            I am Clod Salvador. I design websites and build AI systems that quietly handle
            the follow-ups, the data entry, and the chasing, so the work that actually needs
            you is the only work left on your plate.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={onBook}>
              Get your free automation audit
            </button>
            <a className="btn btn-ghost" href="#work">
              See what I have built
            </a>
          </div>

          <div className="hero-foot">
            <span>n8n · Make · Zapier</span>
            <span>Websites &amp; funnels</span>
            <span>AI chat agents</span>
          </div>
        </div>

        <Trace />
      </div>
    </section>
  )
}
