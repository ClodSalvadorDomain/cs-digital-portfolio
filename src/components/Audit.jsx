import { useState } from 'react'
import { blocks, CONTACT_EMAIL } from '../data/content'
import { useReveal } from '../hooks/useViewport'

/* ──────────────────────────────────────────────────────────────
   WEBHOOK
   Set VITE_N8N_AUDIT_WEBHOOK in Vercel (Project → Settings →
   Environment Variables) to your n8n production webhook URL, then
   redeploy. Until that is set the form degrades to a pre-filled
   email to CONTACT_EMAIL, so it is never a dead end.
   ────────────────────────────────────────────────────────────── */
const WEBHOOK = import.meta.env.VITE_N8N_AUDIT_WEBHOOK || ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function Audit({ formRef, picked }) {
  const [ref, shown] = useReveal()
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})

  const chosen = blocks.filter((b) => picked.includes(b.id))
  const hours = chosen.reduce((sum, b) => sum + b.hours, 0)

  const buildPayload = (form) => ({
    name: form.name.value.trim(),
    business: form.business.value.trim(),
    email: form.email.value.trim(),
    notes: form.notes.value.trim(),
    pipeline: chosen.map((b) => b.node),
    pipelineDetail: chosen.map((b) => ({ id: b.id, name: b.name, estHours: b.hours })),
    estimatedHoursPerMonth: hours,
    source: 'cs-digital portfolio · audit form',
    submittedAt: new Date().toISOString(),
    page: typeof window !== 'undefined' ? window.location.href : '',
  })

  const mailtoFallback = (payload) => {
    const body = [
      `Name: ${payload.name}`,
      `Business: ${payload.business || '—'}`,
      `Email: ${payload.email}`,
      '',
      `Pipeline picked: ${payload.pipeline.join(', ') || '—'}`,
      `Estimated saving: ~${payload.estimatedHoursPerMonth}h / month`,
      '',
      payload.notes || '',
    ].join('\n')

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'Free automation audit request'
    )}&body=${encodeURIComponent(body)}`
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget

    // Honeypot: real people never fill a hidden field.
    if (form.company_website.value) return

    const next = {}
    if (!form.name.value.trim()) next.name = 'Tell me what to call you.'
    if (!EMAIL_RE.test(form.email.value.trim())) next.email = 'That email does not look right.'
    setErrors(next)
    if (Object.keys(next).length) return

    const payload = buildPayload(form)

    if (!WEBHOOK) {
      mailtoFallback(payload)
      setState('sent')
      return
    }

    setState('sending')
    try {
      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`)
      setState('sent')
      form.reset()
    } catch {
      setState('error')
    }
  }

  return (
    <section className="audit" id="audit" ref={formRef}>
      <div className="wrap">
        <div className="reveal" data-shown={shown} ref={ref}>
          <p className="eyebrow">The next step</p>
          <h2 style={{ marginBlock: '0.8rem 1.1rem' }}>
            Get a free audit of what you could automate
          </h2>
          <p className="lede">
            Send this and I will come back with a written breakdown: what can be automated,
            what should be built first, and what it would cost. No obligation, no pitch, and
            the plan is yours whether you hire me or not.
          </p>
        </div>

        <div className="audit-grid" style={{ marginTop: '2.6rem' }}>
          <form className="glass audit-form" onSubmit={onSubmit} noValidate>
            {chosen.length > 0 && (
              <div className="audit-picked">
                <strong style={{ width: '100%', fontWeight: 500 }}>
                  Coming with you from the builder:
                </strong>
                {chosen.map((b) => (
                  <span className="chip" key={b.id}>
                    {b.node}
                  </span>
                ))}
                <span className="chip" style={{ borderColor: 'rgba(245,185,66,0.4)' }}>
                  ~{hours}h / month
                </span>
              </div>
            )}

            <div className="field-row">
              <div className="field">
                <label htmlFor="af-name">Your name</label>
                <input id="af-name" name="name" type="text" autoComplete="name" placeholder="Jane Dela Cruz" />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="af-business">Business</label>
                <input
                  id="af-business"
                  name="business"
                  type="text"
                  autoComplete="organization"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="af-email">Email</label>
              <input
                id="af-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@yourbusiness.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="af-notes">What is eating your week?</label>
              <textarea
                id="af-notes"
                name="notes"
                placeholder="A sentence or two is plenty. What do you keep doing by hand that you wish you did not?"
              />
            </div>

            {/* honeypot */}
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />

            {state === 'sent' ? (
              <div className="audit-status">
                <b>That is in. Thank you.</b>
                <span>
                  {WEBHOOK
                    ? 'It landed in my automation, which means I already know about it. Expect a reply within one working day.'
                    : 'Your email client should have opened with everything filled in. Hit send and it reaches me directly.'}
                </span>
              </div>
            ) : (
              <>
                <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
                  {state === 'sending' ? 'Sending…' : 'Send my free audit request'}
                </button>
                {state === 'error' && (
                  <div className="audit-status" data-tone="error">
                    <b>That did not go through.</b>
                    <span>
                      Email me directly at{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--gold)' }}>
                        {CONTACT_EMAIL}
                      </a>{' '}
                      and I will pick it up from there.
                    </span>
                  </div>
                )}
                <p className="audit-note">
                  Your details go straight to me. No list, no sequence you did not ask for.
                </p>
              </>
            )}
          </form>

          <div className="audit-side">
            <div className="glass audit-promise">
              <h3>What you get back</h3>
              <ul>
                <li>A written list of what in your business can be automated today.</li>
                <li>The order I would build it in, and why that order.</li>
                <li>A real cost, not a range designed to get you on a second call.</li>
                <li>The plan itself, yours to keep and hand to anyone.</li>
              </ul>
            </div>

            <div className="glass audit-promise">
              <h3>Rather just talk?</h3>
              <p style={{ fontSize: '0.89rem', color: 'var(--paper-soft)' }}>
                Email me directly and we will find a time.
              </p>
              <a
                className="btn btn-ghost"
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "Let's talk about AI & automation"
                )}`}
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
