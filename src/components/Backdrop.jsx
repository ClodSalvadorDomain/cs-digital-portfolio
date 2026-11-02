import { Component, Suspense, lazy } from 'react'
import { useMediaQuery, useReducedMotion } from '../hooks/useViewport'

// The gradient mesh is the single heaviest thing on the page, so it is
// split out of the main bundle and only requested once React mounts.
const ShaderGradientCanvas = lazy(() =>
  import('@shadergradient/react').then((m) => ({ default: m.ShaderGradientCanvas }))
)
const ShaderGradient = lazy(() =>
  import('@shadergradient/react').then((m) => ({ default: m.ShaderGradient }))
)

/** A machine without WebGL still gets the palette, just not the motion. */
function StaticFallback() {
  return (
    <div
      className="backdrop-gradient"
      style={{
        background:
          'radial-gradient(90% 70% at 18% 8%, rgba(245,185,66,0.5) 0%, transparent 58%),' +
          'radial-gradient(80% 65% at 86% 22%, rgba(255,95,69,0.42) 0%, transparent 60%),' +
          'radial-gradient(100% 80% at 50% 100%, rgba(42,27,77,0.85) 0%, transparent 70%)',
      }}
    />
  )
}

class GLBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <StaticFallback /> : this.props.children
  }
}

export default function Backdrop() {
  const reduced = useReducedMotion()
  const coarse = useMediaQuery('(max-width: 820px)')

  return (
    <div className="backdrop" aria-hidden="true">
      <GLBoundary>
        <Suspense fallback={<StaticFallback />}>
          <ShaderGradientCanvas
            className="backdrop-gradient"
            style={{ position: 'absolute', inset: 0 }}
            pixelDensity={coarse ? 0.85 : 1.1}
            fov={42}
            pointerEvents="none"
          >
            <ShaderGradient
              control="props"
              type="waterPlane"
              animate={reduced ? 'off' : 'on'}
              uSpeed={0.16}
              uStrength={2.4}
              uDensity={1.3}
              uFrequency={5.5}
              uAmplitude={0}
              color1="#f5b942"
              color2="#ff5f45"
              color3="#2a1b4d"
              lightType="3d"
              brightness={1.05}
              reflection={0.12}
              grain="off"
              cDistance={3.4}
              cPolarAngle={115}
              cAzimuthAngle={185}
              cameraZoom={9.5}
              positionX={-0.4}
              positionY={0.1}
              positionZ={0}
              rotationX={0}
              rotationY={10}
              rotationZ={50}
            />
          </ShaderGradientCanvas>
        </Suspense>
      </GLBoundary>

      {/* The veil is what keeps the gradient a light source rather than
          the subject, and what makes white text legible over it. */}
      <div className="backdrop-veil" />
      <div className="backdrop-grain" />
    </div>
  )
}
