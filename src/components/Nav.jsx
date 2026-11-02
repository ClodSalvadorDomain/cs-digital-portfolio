import { useEffect, useState } from 'react'

const SECTIONS = [
  ['work', 'Work'],
  ['composer', 'Build yours'],
  ['services', 'Services'],
  ['about', 'About'],
]

export default function Nav({ onBook }) {
  const [stuck, setStuck] = useState(false)
  const [here, setHere] = useState('')

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: the section whose top is closest above the midline wins.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setHere(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6] }
    )
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav className="nav" data-stuck={stuck}>
      <a className="nav-mark" href="#top">
        <span className="nav-mark-dot" />
        CS.DIGITAL
      </a>

      <div className="nav-links">
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            className="nav-link"
            href={`#${id}`}
            aria-current={here === id ? 'true' : undefined}
          >
            {label}
          </a>
        ))}
        <button className="nav-cta" type="button" onClick={onBook}>
          Get a free audit
        </button>
      </div>
    </nav>
  )
}
