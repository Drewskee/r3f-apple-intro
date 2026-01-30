'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { Html } from '@react-three/drei'

// Apple logo SVG path
const APPLE_SVG_PATH = `M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z`

// Full rainbow spectrum - creates color blending at overlaps
const LOGO_COLORS = [
  '#0066ff', // Blue (far left)
  '#0099ff', // Sky blue
  '#00ccff', // Cyan
  '#00ffcc', // Cyan-green
  '#00ff88', // Green-cyan
  '#00ff44', // Green
  '#44ff00', // Yellow-green
  '#88ff00', // Lime
  '#ccff00', // Yellow-lime
  '#ffff00', // Yellow
  '#ffcc00', // Yellow-orange
  '#ff9900', // Orange
  '#ff6600', // Red-orange
  '#ff3300', // Red
  '#ff0066', // Red-pink
  '#ff00aa', // Pink
  '#ff00ff', // Magenta
  '#cc00ff', // Purple (far right)
]

// Animation timing
const TOTAL_CYCLE = 6 // seconds - longer to show TV at end

interface SingleLogoProps {
  geometry: THREE.ExtrudeGeometry
  color: string
  index: number
  total: number
  animationProgress: number
}

function SingleLogo({ geometry, color, index, total, animationProgress }: SingleLogoProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null)

  // Seeded random offsets based on index (consistent per slice)
  const seedX = Math.sin(index * 1234.5678) * 0.5
  const seedY = Math.cos(index * 8765.4321) * 0.5
  const randomOffsetX = seedX * 80 // Random X offset
  const randomOffsetY = seedY * 60 // Random Y offset

  // Staggered timing - outer slices take slightly longer to fold in
  const distanceFromCenter = Math.abs(index - (total - 1) / 2)
  const maxDistance = (total - 1) / 2
  const normalizedIndex = index / (total - 1)
  // const sliceDelay = normalizedIndex * 0.15
  const sliceDelay = (distanceFromCenter / maxDistance) * 0.15

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return

    // Progress for this slice - completes by 60% of animation
    const sliceProgress = Math.max(0, Math.min((animationProgress - sliceDelay) / (0.55 - sliceDelay), 1))

    // Ease-out cubic - starts fast, slows down towards end
    const easedProgress = 1 - Math.pow(1 - sliceProgress, 3)

    // Fan spread: all colors fan out in sequence like a flip-book
    // Lower max angle so edge colors are still visible (not facing away)
    const maxSpread = Math.PI /.8 // ~108 degrees total spread
    const normalizedIndex = index / (total - 1) // 0 to 1
    // Map to range: first color at -maxSpread, last color at +maxSpread
    const startAngle = (normalizedIndex - 1) * maxSpread
    // const startAngle = -maxSpread * (1 - normalizedIndex)
    // Keep a tiny offset even when merged for holographic layering effect
    const normalizedOffset = -normalizedIndex // * 2 - 1 // -1 to 1 for Z positioning
    const minOffset = normalizedOffset * 0.03 // Slight final offset
    const currentRotation = startAngle * (1 - easedProgress) + minOffset * easedProgress
    meshRef.current.rotation.y = currentRotation

    // Random X/Y offsets that correct to 0 (creates rainbow echo effect)
    meshRef.current.position.x = randomOffsetX * (1 - easedProgress)
    meshRef.current.position.y = randomOffsetY * (1 - easedProgress)

    // Offset in Z so layers are visible as holographic strips
    meshRef.current.position.z = normalizedOffset * 3 * (1 - easedProgress) + normalizedOffset * 1.5 * easedProgress

    // Color: stay vibrant longer, then fade to holographic gradient
    const baseColor = new THREE.Color(color)

    // Create holographic final colors based on slice position
    // More saturated colors for visible gradient effect
    const holographicColors = [
      new THREE.Color('#c0ffe0'), // Green tint (for blues)
      new THREE.Color('#d0ffd0'), // Light green
      new THREE.Color('#e8ffe8'), // Pale green
      new THREE.Color('#f8f8f0'), // Warm white (center)
      new THREE.Color('#fff0f0'), // Pale pink
      new THREE.Color('#ffd0e8'), // Light pink
      new THREE.Color('#ffc0e0'), // Pink tint (for magentas)
    ]
    const colorIndex = normalizedIndex * (holographicColors.length - 1)
    const lowerIndex = Math.floor(colorIndex)
    const upperIndex = Math.min(lowerIndex + 1, holographicColors.length - 1)
    const blend = colorIndex - lowerIndex
    const finalColor = holographicColors[lowerIndex].clone().lerp(holographicColors[upperIndex], blend)

    // Keep color vibrant until 60% progress, then fade to holographic
    const colorFade = Math.max(0, (easedProgress - 0.6) / 0.4)
    materialRef.current.color.copy(baseColor).lerp(finalColor, colorFade)

    // Emissive glow - bright at start, dims slowly and smoothly
    // Uses a smooth ease-out curve for gentle fade
    const glowProgress = Math.pow(easedProgress, 0.5) // Slower fade (square root easing)
    const glowIntensity = 2.5 * Math.pow(1 - glowProgress, 2) // Quadratic ease-out for smooth dim
    materialRef.current.emissive.copy(baseColor)
    materialRef.current.emissiveIntensity = glowIntensity

    // Opacity: animate from 20% to 100% based on progress
    materialRef.current.opacity = 0.2 + easedProgress * 0.8

    // Transmission decreases as opacity increases (more solid at end)
    materialRef.current.transmission = 0.5 * (1 - easedProgress)
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.2}
        roughness={0.02}
        metalness={0.0}
        clearcoat={1.0}
        clearcoatRoughness={0.01}
        transmission={0.4}
        thickness={0.5}
        ior={1.5}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// Subset of colors for TV text (fewer layers for performance)
const TV_COLORS = [
  '#0066ff', // Blue
  '#00ccff', // Cyan
  '#00ff44', // Green
  '#88ff00', // Lime
  '#ffff00', // Yellow
  '#ff9900', // Orange
  '#ff3300', // Red
  '#ff00aa', // Pink
  '#cc00ff', // Purple
]

interface TVTextProps {
  progress: number
}

function TVText({ progress }: TVTextProps) {
  // TV appears after 55% progress
  if (progress <= 0.55) return null

  // TV animation progress (0 to 1) after it starts appearing
  const tvProgress = Math.min((progress - 0.55) / 0.35, 1)
  const easedProgress = 1 - Math.pow(1 - tvProgress, 3)

  return (
    <Html
      position={[2.5, 0, 0]}
      center
      style={{
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative', width: '400px', height: '400px' }}>
        {TV_COLORS.map((color, index) => {
          const total = TV_COLORS.length
          const normalizedIndex = index / (total - 1)
          const maxSpread = 60 // pixels of spread
          const maxRotation = 15 // degrees of rotation

          // Calculate offset and rotation based on progress
          const offsetX = (normalizedIndex * 2 - 1) * maxSpread * (1 - easedProgress)
          const offsetY = Math.sin(normalizedIndex * Math.PI) * 20 * (1 - easedProgress)
          const rotation = (normalizedIndex * 2 - 1) * maxRotation * (1 - easedProgress)

          // Opacity: starts visible, fades to show only merged result
          const layerOpacity = index === Math.floor(total / 2)
            ? 1 // Middle layer stays fully visible
            : 0.7 * (1 - easedProgress * 0.8) + 0.2

          return (
            <span
              key={index}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`,
                fontSize: '350px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                color: color,
                opacity: layerOpacity,
                textShadow: `0 0 ${30 * (1 - easedProgress)}px ${color}`,
                mixBlendMode: 'screen',
              }}
            >
              tv
            </span>
          )
        })}
      </div>
    </Html>
  )
}

interface AppleLogoProps {
  progress: number
}

export function AppleLogo({ progress }: AppleLogoProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [geometry, setGeometry] = useState<THREE.ExtrudeGeometry | null>(null)

  useFrame(() => {
  if (!groupRef.current) return

  // closing portion only (your slices complete around ~0.55)
  const closeProgress = Math.min(progress / 0.55, 1)
  const eased = 1 - Math.pow(1 - closeProgress, 3)

  // Example: start rotated, end aligned
  const startY = -Math.PI * 0.1   // ~-108deg at start
  const endY = 0                 // settled at the end
  groupRef.current.rotation.y = startY * (1 - eased) + endY * eased

  // Optional: tiny roll for “premium” feel
  const startZ = Math.PI * 0.08  // ~14deg
  groupRef.current.rotation.z = startZ * (1 - eased)
})

  useEffect(() => {
    const loader = new SVGLoader()
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 814 1000">
      <path d="${APPLE_SVG_PATH}" fill="black"/>
    </svg>`

    const result = loader.parse(svgData)

    if (result.paths.length > 0) {
      const shapes: THREE.Shape[] = []

      result.paths.forEach((path) => {
        const pathShapes = SVGLoader.createShapes(path)
        shapes.push(...pathShapes)
      })

      if (shapes.length > 0) {
        const extrudeSettings = {
          depth: 5,
          bevelEnabled: true,
          bevelThickness: 1.5,
          bevelSize: 0.8,
          bevelOffset: 0,
          bevelSegments: 2,
        }

        const geo = new THREE.ExtrudeGeometry(shapes, extrudeSettings)
        geo.center()

        // Offset so pivot is on the round side (opposite the bite)
        // The bite is on the left after centering, so move geometry left
        // to put pivot on the right (round side)
        geo.translate(-407, 0, 0)

        setGeometry(geo)
      }
    }
  }, [])

  if (!geometry) return null

  return (
    <group ref={groupRef} position={[0.5, 0, 0]}>
      <group scale={0.005} rotation={[Math.PI, 0, 0]}>
        {LOGO_COLORS.map((color, index) => (
          <SingleLogo
            key={index}
            geometry={geometry}
            color={color}
            index={index}
            total={LOGO_COLORS.length}
            animationProgress={progress}
          />
        ))}
      </group>
      <TVText progress={progress} />
    </group>
  )
}
