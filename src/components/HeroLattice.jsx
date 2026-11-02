import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../hooks/useViewport'

/* A loose field of nodes wired to their nearest neighbours, with packets
   running the wires. It is the same shape as the automations Clod builds,
   which is the only reason it is here — it is not decoration looking for
   a home. Everything is instanced or merged: three draw calls total. */

const COUNT = 58
const LINKS_PER_NODE = 2

function buildGraph() {
  const rng = mulberry(20261102)
  const nodes = []
  for (let i = 0; i < COUNT; i++) {
    nodes.push(
      new THREE.Vector3(
        (rng() - 0.5) * 15,
        (rng() - 0.5) * 7.4,
        (rng() - 0.5) * 5.2
      )
    )
  }

  const edges = []
  const seen = new Set()
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: a.distanceTo(b) }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, LINKS_PER_NODE)

    near.forEach(({ j }) => {
      const key = i < j ? `${i}:${j}` : `${j}:${i}`
      if (seen.has(key)) return
      seen.add(key)
      edges.push([i, j])
    })
  })

  return { nodes, edges }
}

// Deterministic noise, so the lattice is identical on every load and
// every build. A random layout would make screenshots unreviewable.
function mulberry(seed) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = t
    r = Math.imul(r ^ (r >>> 15), r | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function Lattice({ reduced }) {
  const group = useRef(null)
  const nodeMesh = useRef(null)
  const packetMesh = useRef(null)
  const { viewport } = useThree()

  const { nodes, edges } = useMemo(buildGraph, [])

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(positions, i * 6)
      nodes[b].toArray(positions, i * 6 + 3)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [nodes, edges])

  // One packet per handful of edges, each with its own offset and speed.
  const packets = useMemo(() => {
    const rng = mulberry(777)
    return Array.from({ length: 18 }, () => ({
      edge: Math.floor(rng() * edges.length),
      offset: rng(),
      speed: 0.1 + rng() * 0.17,
    }))
  }, [edges])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const pos = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (group.current) {
      // Pointer parallax, damped. Pointer is -1 → 1 in R3F.
      const tx = state.pointer.y * 0.12
      const ty = state.pointer.x * 0.26
      group.current.rotation.x += (tx - group.current.rotation.x) * 0.035
      group.current.rotation.y += (ty + 0.1 - group.current.rotation.y) * 0.035
      if (!reduced) group.current.rotation.z = Math.sin(t * 0.07) * 0.03
    }

    // Nodes breathe out of phase with each other.
    if (nodeMesh.current) {
      for (let i = 0; i < COUNT; i++) {
        const s = reduced ? 1 : 0.78 + Math.sin(t * 0.9 + i * 1.7) * 0.22
        dummy.position.copy(nodes[i])
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        nodeMesh.current.setMatrixAt(i, dummy.matrix)
      }
      nodeMesh.current.instanceMatrix.needsUpdate = true
    }

    if (packetMesh.current && !reduced) {
      packets.forEach((p, i) => {
        p.offset = (p.offset + delta * p.speed) % 1
        const [a, b] = edges[p.edge]
        pos.copy(nodes[a]).lerp(nodes[b], p.offset)
        dummy.position.copy(pos)
        // Fade in and out at the ends of the wire rather than popping.
        const fade = Math.sin(p.offset * Math.PI)
        dummy.scale.setScalar(0.55 + fade * 0.5)
        dummy.updateMatrix()
        packetMesh.current.setMatrixAt(i, dummy.matrix)
      })
      packetMesh.current.instanceMatrix.needsUpdate = true
    }
  })

  const scale = Math.min(1, viewport.width / 13)

  return (
    <group ref={group} scale={scale} position={[1.1, 0, 0]}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#f5b942"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <instancedMesh ref={nodeMesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <sphereGeometry args={[0.062, 10, 10]} />
        <meshBasicMaterial
          color="#ffe9a8"
          transparent
          opacity={0.72}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      <instancedMesh
        ref={packetMesh}
        args={[undefined, undefined, packets.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial
          color="#ff8a5f"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </group>
  )
}

export default function HeroLattice({ active = true }) {
  const reduced = useReducedMotion()

  return (
    <div className="hero-lattice" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 11], fov: 42 }}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <Lattice reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  )
}
