import { useCallback, useRef, useState } from 'react'
import Backdrop from './components/Backdrop'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Proof from './components/Proof'
import Reel from './components/Reel'
import Work from './components/Work'
import Composer from './components/Composer'
import Services from './components/Services'
import About from './components/About'
import Audit from './components/Audit'
import { CONTACT_EMAIL, reels } from './data/content'
import { useScrollProgress } from './hooks/useViewport'

// El Arika runs 33s against Gretza's 13s, so it gets the longer track.
// Scroll span is matched to clip length, not handed out evenly.
const SPANS = { 'gretza-roman': 280, 'el-arika': 420 }

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <p>CS.DIGITAL · Clod Salvador</p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <p>© {new Date().getFullYear()} · All rights reserved</p>
      </div>
    </footer>
  )
}

export default function App() {
  const [picked, setPicked] = useState(['site', 'reply'])
  const auditRef = useRef(null)
  const progress = useScrollProgress()

  const toggle = useCallback((id) => {
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }, [])

  const goToAudit = useCallback(() => {
    auditRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Hand focus to the first field so keyboard users land where the
    // scroll just took everyone else.
    window.setTimeout(() => document.getElementById('af-name')?.focus(), 650)
  }, [])

  return (
    <>
      <Backdrop />
      <div
        className="progress"
        style={{ width: `${progress * 100}%` }}
        role="presentation"
      />

      <Nav onBook={goToAudit} />

      <main className="shell">
        <Hero onBook={goToAudit} />
        <Proof />

        <div id="work">
          {reels.map((reel, i) => (
            <Reel key={reel.id} reel={reel} index={i} span={SPANS[reel.id]} />
          ))}
          <Work />
        </div>

        <Composer picked={picked} onToggle={toggle} onSend={goToAudit} />
        <Services />
        <About />
        <Audit formRef={auditRef} picked={picked} />
      </main>

      <Footer />
    </>
  )
}
