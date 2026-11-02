import { services } from '../data/content'
import { useReveal } from '../hooks/useViewport'

function Service({ title, body }) {
  const [ref, shown] = useReveal()
  return (
    <article className="glass glass-interactive svc reveal" data-shown={shown} ref={ref}>
      <div className="svc-rail" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  )
}

export default function Services() {
  const [ref, shown] = useReveal()

  return (
    <section id="services">
      <div className="wrap">
        <div className="reveal" data-shown={shown} ref={ref}>
          <p className="eyebrow">Services</p>
          <h2 style={{ marginBlock: '0.8rem 1.1rem' }}>
            Six ways to stop doing it by hand
          </h2>
          <p className="lede">
            Every service here exists for one reason: to turn more of your leads into closed
            business without adding hours to your day.
          </p>
        </div>

        <div className="svc-grid">
          {services.map((s) => (
            <Service key={s.title} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
