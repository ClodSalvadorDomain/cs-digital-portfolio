import { blocks } from '../data/content'
import { useReveal } from '../hooks/useViewport'

/** "a, b and c" — an Oxford-comma-free list that reads out loud. */
function joinClauses(list) {
  if (list.length <= 1) return list[0] ?? ''
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
}

function writeSpec({ picked, steps }) {
  const entry = picked.includes('site')
    ? 'A lead arrives through your site or funnel'
    : 'A lead arrives through whichever channel they prefer'

  const middle = steps.length
    ? `From there, ${joinClauses(steps.map((b) => b.clause))}.`
    : 'From there it is logged and routed without you touching it.'

  const close = picked.includes('digest')
    ? 'One message each morning tells you what happened while you were doing something else.'
    : 'You only hear about it when a human actually needs to step in.'

  return `${entry}. ${middle} ${close}`
}

/**
 * The signature move: the visitor assembles their own pipeline, the page
 * draws it as a live flow and writes the spec in plain English, and that
 * spec is what the audit form sends. Choosing is the engagement; the form
 * stops being a cold field and starts being a summary of their own answers.
 */
export default function Composer({ picked, onToggle, onSend }) {
  const [ref, shown] = useReveal()

  const chosen = blocks.filter((b) => picked.includes(b.id))
  const steps = chosen.filter((b) => b.kind === 'step')
  const hours = chosen.reduce((sum, b) => sum + b.hours, 0)

  const flow = chosen.length
    ? [
        {
          kind: 'trigger',
          label: 'Trigger',
          name: picked.includes('site') ? 'Website / funnel' : 'New enquiry',
        },
        ...steps.map((b) => ({ kind: 'step', label: 'Step', name: b.node })),
        {
          kind: 'out',
          label: 'Output',
          name: picked.includes('digest') ? 'Daily digest' : 'You, only when it matters',
        },
      ]
    : []

  const spec = chosen.length ? writeSpec({ picked, steps }) : ''

  return (
    <section id="composer">
      <div className="wrap">
        <div className="reveal" data-shown={shown} ref={ref}>
          <p className="eyebrow">Build it here, before you even call me</p>
          <h2 style={{ marginBlock: '0.8rem 1.1rem' }}>
            Tick what eats your week. Watch the system assemble.
          </h2>
          <p className="lede">
            This is the same exercise we would do on a call, except you can do it right now.
            Pick the parts that sound like your business and the pipeline draws itself. What
            you build here comes with you into the audit form at the bottom.
          </p>
        </div>

        <div className="composer-grid">
          <div className="glass composer-picks">
            <p>Your bottlenecks</p>
            {blocks.map((b) => {
              const on = picked.includes(b.id)
              return (
                <button
                  key={b.id}
                  className="pick"
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggle(b.id)}
                >
                  <span className="pick-box" aria-hidden="true">
                    {on ? '✓' : ''}
                  </span>
                  <span>
                    <span className="pick-name">{b.name}</span>
                    <span className="pick-note">{b.note}</span>
                  </span>
                  <span className="pick-saving">~{b.hours}h</span>
                </button>
              )
            })}
          </div>

          <div className="composer-out">
            <div className="glass composer-canvas">
              {flow.length ? (
                <div className="flow" role="img" aria-label={spec}>
                  {flow.map((node, i) => (
                    <div key={`${node.name}-${i}`} style={{ display: 'contents' }}>
                      {i > 0 && <span className="flow-wire" aria-hidden="true" />}
                      <div className="flow-node" data-kind={node.kind}>
                        <span className="flow-node-kind">{node.label}</span>
                        <span className="flow-node-name">{node.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="composer-empty">
                  nothing selected yet
                  <br />
                  <span style={{ color: 'var(--amber)' }}>
                    ← tick a bottleneck to start building
                  </span>
                </p>
              )}
            </div>

            {chosen.length > 0 && (
              <div className="glass composer-spec">
                <div>
                  <h3>Here is what that would do</h3>
                  <p style={{ marginTop: '0.5rem' }}>{spec}</p>
                </div>

                <div className="composer-tally">
                  <div>
                    <b>{flow.length}</b>
                    Nodes in your pipeline
                  </div>
                  <div>
                    <b>~{hours}h</b>
                    Estimated saving / month
                  </div>
                </div>

                <p className="audit-note">
                  Those hours are an estimate, not a quote. On the call we replace them with
                  your real numbers.
                </p>

                <button className="btn btn-primary" type="button" onClick={onSend}>
                  Send this pipeline to Clod
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
