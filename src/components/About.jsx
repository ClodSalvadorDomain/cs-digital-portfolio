import { useReveal } from '../hooks/useViewport'

const SKILLS = [
  'AI & automation',
  'Funnel design',
  'Zapier',
  'Make.com',
  'n8n workflows',
  'AI integrations',
  'CRM systems',
]

export default function About() {
  const [ref, shown] = useReveal()

  return (
    <section id="about">
      <div className="wrap about-grid reveal" data-shown={shown} ref={ref}>
        <figure className="glass about-photo" style={{ margin: 0 }}>
          <img
            src="/assets/clod-salvador.jpg"
            alt="Clod Salvador, founder of CS Digital"
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="about-copy">
          <p className="eyebrow">About</p>
          <h2>Clod Salvador</h2>
          <p>
            I am the founder of CS Digital. I design websites and build automated workflows
            for business owners who are ready to stop doing everything by hand.
          </p>
          <p>
            My websites are built to turn visitors into leads. My workflows automate the
            repetitive tasks that eat up your week, like data entry, email sorting,
            follow-ups, and task updates, so you can focus on the work that actually needs
            you.
          </p>
          <div className="chips">
            {SKILLS.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
