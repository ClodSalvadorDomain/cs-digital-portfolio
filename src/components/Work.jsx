import { useRef, useState } from 'react'
import { work } from '../data/content'
import { useReducedMotion, useReveal } from '../hooks/useViewport'

const TABS = [
  ['builds', 'Websites, funnels & pages'],
  ['systems', 'AI & automation systems'],
]

function CardMedia({ media, title }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  if (media.type === 'image') {
    return <img src={media.src} alt={title} loading="lazy" decoding="async" />
  }

  // Video cards sit on their poster until pointed at, so a grid of twelve
  // never decodes twelve streams at once.
  const play = () => {
    if (reduced) return
    const v = ref.current
    if (v) v.play().catch(() => {})
  }
  const stop = () => {
    const v = ref.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <video
      ref={ref}
      src={media.src}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      aria-label={title}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
    />
  )
}

function Card({ item }) {
  const [ref, shown] = useReveal()

  return (
    <article className="glass glass-interactive card reveal" data-shown={shown} ref={ref}>
      <div className="card-media">
        <span className="card-kind">{item.kind}</span>
        <CardMedia media={item.media} title={item.title} />
      </div>
      <div className="card-body">
        <p className="card-client">{item.client}</p>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
        <div className="chips">
          {item.chips.map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  const [tab, setTab] = useState('builds')
  const [ref, shown] = useReveal()

  return (
    <section id="work-grid">
      <div className="wrap">
        <div className="reveal" data-shown={shown} ref={ref}>
          <p className="eyebrow">Selected work</p>
          <h2 style={{ marginBlock: '0.8rem 1.1rem' }}>
            Real systems, running in real businesses
          </h2>
          <p className="lede">
            Not mockups and not concepts. Every item below was built for a paying client and
            is either live now or was handed over working.
          </p>
        </div>

        <div className="tabs" role="tablist" aria-label="Work categories">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              className="tab"
              role="tab"
              type="button"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {TABS.map(([id]) => (
          <div
            key={id}
            id={`panel-${id}`}
            role="tabpanel"
            hidden={tab !== id}
            className="work-grid"
          >
            {tab === id && work[id].map((item) => <Card key={item.title} item={item} />)}
          </div>
        ))}
      </div>
    </section>
  )
}
