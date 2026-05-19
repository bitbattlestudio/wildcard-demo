import React from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Text } from '@react-three/drei'
import { animated, to, useSpring } from '@react-spring/three'

const OUTER_LABELS = ['Green', 'Blue', 'Red', 'Black']
const OUTER_IDS = ['green', 'blue', 'red', 'black']
const OUTER_TEXT_COLORS = ['#1f9d4d', '#2357cb', '#cf2f2f', '#1a1a1a']
const INNER_NUMBERS = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
]

const TRI_BASE = 0.95
const TRI_HEIGHT = 0.92
const TRI_THICKNESS = 0.022

const CAMERA_PRESETS = {
  closed: { position: [0, 1.2, 2.2], lookAt: [0, 0, 0] },
  mid: { position: [0, 1.0, 2.0], lookAt: [0, 0, 0] },
  open: { position: [0, 0.8, 1.8], lookAt: [0, 0, 0] },
}

const POSES = {
  closed: {
    outer: -1.12,
    inner: 0.98,
    innerOpacity: 0.04,
    centerOpacity: 0,
  },
  mid: {
    outer: -0.38,
    inner: 0.64,
    innerOpacity: 1,
    centerOpacity: 0,
  },
  open: {
    outer: -0.02,
    inner: 0.02,
    innerOpacity: 1,
    centerOpacity: 1,
  },
}

function buildTrianglePrismGeometry(base = TRI_BASE, height = TRI_HEIGHT, depth = TRI_THICKNESS) {
  const hb = base * 0.5
  const hd = depth * 0.5

  const verts = new Float32Array([
    // top tri
    -hb, hd, 0,
    hb, hd, 0,
    0, hd, height,
    // bottom tri
    -hb, -hd, 0,
    hb, -hd, 0,
    0, -hd, height,
  ])

  const indices = [
    // top
    0, 1, 2,
    // bottom
    3, 5, 4,
    // hinge edge side
    0, 4, 1,
    0, 3, 4,
    // left side
    0, 2, 5,
    0, 5, 3,
    // right side
    1, 4, 5,
    1, 5, 2,
  ]

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(verts, 3))
  g.setIndex(indices)
  g.computeVertexNormals()
  return g
}

function resolveStage(face, isAnimating, hasFlapPicker) {
  if (face === 'color' && !isAnimating) return 'closed'
  if (face === 'flap' && !hasFlapPicker) return 'open'
  return 'mid'
}

function CameraRig({ stage }) {
  const { camera } = useThree()
  const target = React.useRef(new THREE.Vector3(...CAMERA_PRESETS.closed.position))
  const lookAt = React.useRef(new THREE.Vector3(...CAMERA_PRESETS.closed.lookAt))

  React.useEffect(() => {
    const cfg = CAMERA_PRESETS[stage]
    target.current.set(...cfg.position)
    lookAt.current.set(...cfg.lookAt)
  }, [stage])

  useFrame(() => {
    camera.position.lerp(target.current, 0.14)
    camera.lookAt(lookAt.current)
  })

  return null
}

function GameStateController({ face, isAnimating, hasFlapPicker, onStage }) {
  React.useEffect(() => {
    onStage(resolveStage(face, isAnimating, hasFlapPicker))
  }, [face, isAnimating, hasFlapPicker, onStage])
  return null
}

function TriangleFace({
  index,
  kind,
  geometry,
  poseSpring,
  pulse,
  clickable,
  onPickColor,
  onPickNumber,
  onPickFlap,
  stage,
}) {
  const azimuth = index * (Math.PI / 2)
  const isOuter = kind === 'outer'
  const localTiltBase = isOuter ? poseSpring.outer : poseSpring.inner

  const localTilt = to([localTiltBase, pulse], (base, p) => {
    if (!clickable || stage === 'open') return base
    const phase = index % 2 === 0 ? -1 : 1
    const amp = isOuter ? 0.14 : -0.12
    return base + phase * amp * p
  })

  const localScale = useSpring({
    scale: clickable ? 1.05 : 1,
    config: { tension: 220, friction: 20 },
  })

  const [n1, n2] = INNER_NUMBERS[index]

  const hitAction = () => {
    if (!clickable) return
    if (isOuter) {
      onPickColor?.(OUTER_IDS[index])
      return
    }
    if (onPickNumber) {
      onPickNumber(n1)
      return
    }
    onPickFlap?.()
  }

  return (
    <group rotation={[0, azimuth, 0]}>
      <animated.group rotation-x={localTilt} scale={localScale.scale}>
        <group position={[0, 0, 0]}>
          <mesh geometry={geometry} castShadow receiveShadow onClick={hitAction}>
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.92}
              metalness={0}
              side={THREE.DoubleSide}
              transparent
              opacity={isOuter ? 1 : poseSpring.innerOpacity}
            />
          </mesh>

          {isOuter ? (
            <Text
              position={[0, TRI_THICKNESS * 0.75, TRI_HEIGHT * 0.55]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.13}
              color={OUTER_TEXT_COLORS[index]}
              anchorX="center"
              anchorY="middle"
              maxWidth={0.7}
              onClick={hitAction}
            >
              {OUTER_LABELS[index]}
            </Text>
          ) : (
            <>
              <Text
                position={[-TRI_BASE * 0.16, TRI_THICKNESS * 0.75, TRI_HEIGHT * 0.52]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.145}
                color="#344ec8"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.24}
                onClick={() => clickable && onPickNumber?.(n1)}
                material-opacity={poseSpring.innerOpacity}
              >
                {String(n1)}
              </Text>
              <Text
                position={[TRI_BASE * 0.16, TRI_THICKNESS * 0.75, TRI_HEIGHT * 0.52]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.145}
                color="#7a42d8"
                anchorX="center"
                anchorY="middle"
                maxWidth={0.24}
                onClick={() => clickable && onPickNumber?.(n2)}
                material-opacity={poseSpring.innerOpacity}
              >
                {String(n2)}
              </Text>
            </>
          )}

          <mesh
            position={[0, TRI_THICKNESS * 2, TRI_HEIGHT * 0.48]}
            rotation={[-Math.PI / 2, 0, 0]}
            visible={false}
            onClick={hitAction}
          >
            <planeGeometry args={[TRI_BASE * 0.95, TRI_HEIGHT * 0.96]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>
      </animated.group>
    </group>
  )
}

function CenterReveal({ opacity }) {
  return (
    <animated.group position={[0, TRI_THICKNESS * 2.1, 0.12]} scale={to(opacity, (o) => 0.95 + o * 0.05)}>
      <animated.mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.18, 0.72]} />
        <meshStandardMaterial color="#ffffff" roughness={0.92} metalness={0} transparent opacity={opacity} />
      </animated.mesh>
      <animated.group position={[0, 0.004, 0]}>
        <Text
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.122}
          color="#111111"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.0}
          textAlign="center"
        >
          {'You win\n$10 back'}
        </Text>
      </animated.group>
    </animated.group>
  )
}

function FortuneModel({
  face,
  isAnimating,
  onPickColor,
  onPickNumber,
  onPickFlap,
}) {
  const stage = resolveStage(face, isAnimating, Boolean(onPickFlap))
  const geometry = React.useMemo(() => buildTrianglePrismGeometry(), [])

  const poseSpring = useSpring({
    ...POSES[stage],
    config: { tension: 180, friction: 18 },
  })

  const pulseSpring = useSpring({
    from: { pulse: 0 },
    to: async (next) => {
      if (!isAnimating) {
        await next({ pulse: 0 })
        return
      }
      while (true) {
        await next({ pulse: 1 })
        await next({ pulse: 0 })
      }
    },
    config: { tension: 180, friction: 18 },
    reset: !isAnimating,
  })

  const canPickColor = face === 'color' && !isAnimating && Boolean(onPickColor)
  const canPickNumber = face === 'number' && !isAnimating && Boolean(onPickNumber)
  const canPickFlap = face === 'flap' && !isAnimating && Boolean(onPickFlap)

  return (
    <group>
      {/* 4 outer triangles */}
      {Array.from({ length: 4 }).map((_, i) => (
        <TriangleFace
          key={`outer-${i}`}
          index={i}
          kind="outer"
          geometry={geometry}
          poseSpring={poseSpring}
          pulse={pulseSpring.pulse}
          clickable={canPickColor}
          onPickColor={onPickColor}
          stage={stage}
        />
      ))}

      {/* 4 inner triangles (interleaved at 45 degrees) */}
      <group rotation={[0, Math.PI / 4, 0]}>
        {Array.from({ length: 4 }).map((_, i) => (
          <TriangleFace
            key={`inner-${i}`}
            index={i}
            kind="inner"
            geometry={geometry}
            poseSpring={poseSpring}
            pulse={pulseSpring.pulse}
            clickable={canPickNumber || canPickFlap}
            onPickNumber={canPickNumber ? onPickNumber : undefined}
            onPickFlap={canPickFlap ? onPickFlap : undefined}
            stage={stage}
          />
        ))}
      </group>

      {stage === 'open' && <CenterReveal opacity={poseSpring.centerOpacity} />}
    </group>
  )
}

function Scene({
  face,
  isAnimating,
  onPickColor,
  onPickNumber,
  onPickFlap,
  stage,
}) {
  const floatRef = React.useRef(null)
  useFrame(({ clock }) => {
    if (!floatRef.current) return
    const t = clock.getElapsedTime()
    floatRef.current.position.y = 0.1 + Math.sin(t * 1.15) * 0.03
    floatRef.current.rotation.y = 0.26 + Math.sin(t * 0.78) * 0.035
  })

  return (
    <>
      <CameraRig stage={stage} />
      <ambientLight intensity={0.58} />
      <directionalLight
        position={[2.8, 4.4, 2.4]}
        intensity={0.95}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={12}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <Environment preset="studio" intensity={0.08} />
      <Float speed={0.9} rotationIntensity={0} floatIntensity={0}>
        <group ref={floatRef} rotation={[-0.54, 0.26, 0]}>
          <FortuneModel
            face={face}
            isAnimating={isAnimating}
            onPickColor={onPickColor}
            onPickNumber={onPickNumber}
            onPickFlap={onPickFlap}
          />
        </group>
      </Float>
      <ContactShadows position={[0, -0.84, 0]} opacity={0.24} scale={3.1} blur={2.4} far={2.4} resolution={512} />
    </>
  )
}

export default function FortuneTeller3D({
  face = 'color',
  isAnimating = false,
  size = 220,
  onPickColor,
  onPickNumber,
  onPickFlap,
}) {
  const [stage, setStage] = React.useState('closed')

  return (
    <div style={{ width: size, height: size, flexShrink: 0, position: 'relative' }}>
      <GameStateController
        face={face}
        isAnimating={isAnimating}
        hasFlapPicker={Boolean(onPickFlap)}
        onStage={setStage}
      />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: CAMERA_PRESETS.closed.position, fov: 34 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          face={face}
          isAnimating={isAnimating}
          onPickColor={onPickColor}
          onPickNumber={onPickNumber}
          onPickFlap={onPickFlap}
          stage={stage}
        />
      </Canvas>
    </div>
  )
}
