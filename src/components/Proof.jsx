import { useEffect, useState } from 'react'
import { counters, tools } from '../data/content'
import { useReducedMotion, useReveal } from '../hooks/useViewport'

function Counter({ to, suffix, label }) {
  const [ref, shown] = useReveal({ threshold: 0.4 })
  const reduced = useReducedMotion()
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!shown) return
    if (reduced) {
      setN(to)
      return
    }
    const start = performance.now()
    const dur = 1300
    let raf = 0
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur)
      // easeOutExpo, so the number lands rather than drifting
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setN(Math.round(to * eased))
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [shown, to, reduced])

  return (
    <div className="glass counter reveal" data-shown={shown} ref={ref}>
      <span className="counter-num">
        {n}
        {suffix}
      </span>
      <span className="counter-label">{label}</span>
    </div>
  )
}

export default function Proof() {
  const [ref, shown] = useReveal()

  return (
    <section className="proof">
      <div className="wrap proof-inner">
        <div className="glass tools reveal" data-shown={shown} ref={ref}>
          <p className="tools-label">Built with</p>
          <div className="tools-row">
            {tools.map((t) => (
              <span className="tool" key={t.name}>
                <img src={t.icon} alt="" width="18" height="18" loading="lazy" />
                {t.name}
              </span>
            ))}
          </div>
        </div>

        <div className="counters">
          {counters.map((c) => (
            <Counter key={c.label} {...c} />
          ))}
        </div>
      </div>
    </section>
  )
}
