'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { Html } from '@react-three/drei'
import { Text } from '@react-three/drei'
import { FAN_ANIMATION_SPEED } from '@/lib/constants'


// Apple logo SVG path
const APPLE_SVG_PATH = `M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z`

// Rainbow glass spectrum - ends on white
const LOGO_COLORS = [
  '#cc00ff', // Purple (back)
  '#ff00aa', // Pink
  '#ff0066', // Red-pink
  '#ff3300', // Red
  '#ff6600', // Red-orange
  '#ff9900', // Orange
  '#ffcc00', // Yellow-orange
  '#ffff00', // Yellow
  '#ccff00', // Yellow-lime
  '#88ff00', // Lime
  '#44ff00', // Yellow-green
  '#00ff44', // Green
  '#00ff88', // Green-cyan
  '#00ffcc', // Cyan-green
  '#00ccff', // Cyan
  '#99ddff', // Light cyan
  '#cceeff', // Pale blue
  '#ffffff', // White (front)
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
  const randomOffsetY = seedY * 80 // Random Y offset

  // Staggered timing - each color appears sequentially
  const normalizedIndex = index / (total - 1) // 0 to 1
  const sliceDelay = normalizedIndex * 0.4 // First color starts at 0%, last at 40%

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return

    // Each slice has its own delayed start, completes by 70%
    const sliceProgress = Math.max(0, Math.min((animationProgress - sliceDelay) / (1 - sliceDelay), 1))

    // Ease-out quart - fast start, smooth slow finish
    const easedProgress = 1 - Math.pow(1 - sliceProgress, FAN_ANIMATION_SPEED)
    // Fan rotation: all rotate from the same side (like flipping book pages)
    const maxSpread = Math.PI / 1.5 // ~200 degrees rotation
    // All start rotated to one side, flip to center
    const startAngle = -maxSpread
    // End aligned together
    const currentRotation = startAngle * (.9 - easedProgress)
    meshRef.current.rotation.y = currentRotation

    // Random X/Y offsets that correct to 0 (creates rainbow echo effect)
    meshRef.current.position.x = randomOffsetX * (1 - easedProgress)
    meshRef.current.position.y = randomOffsetY * (1 - easedProgress)

    // Z-offset: purple (index 0) in back, white (last index) in front
    // Each slice stacks in front of the previous one - increased for more visible layered edges
    const zEnd = normalizedIndex * 2.5 // Purple at z=0 (back), White at z=2.5 (front)
    meshRef.current.position.z = zEnd

    // Glass material - keep color throughout
    const baseColor = new THREE.Color(color)
    materialRef.current.color.copy(baseColor)

    // Emissive rim glow - maintains throughout for glass edge effect
    const glowIntensity = 1.8 * (0.4 + .6 * (1 - easedProgress)) // Fades but keeps some glow
    materialRef.current.emissive.copy(baseColor)
    materialRef.current.emissiveIntensity = glowIntensity

    // Glass-like transparency - fade in as slice appears, stay transparent
    // Opacity increases as slice rotates in, peaks around halfway
    const fadeIn = Math.min(easedProgress * 1, 3) // Quick fade in at start
    const baseOpacity = 0.2 + easedProgress * 0.15 // 20% to 35%
    materialRef.current.opacity = fadeIn * baseOpacity

    // High transmission for glass look throughout
    materialRef.current.transmission = 0.8
  })

  return (
    <mesh ref={meshRef} geometry={geometry} renderOrder={index}>
      <meshPhysicalMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0}
        roughness={0.0}
        metalness={0.0}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
        transmission={0.85}
        thickness={1.0}
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

function Occluder({ geometry }: { geometry: THREE.ExtrudeGeometry }) {
  return (
    <mesh geometry={geometry} renderOrder={0}>
      <meshBasicMaterial
        colorWrite={false}
        transparent
        opacity={0}         // invisible
        depthWrite={true}   // ✅ writes depth so it can occlude
        depthTest={true}
      />
    </mesh>
  )
}

function TVText({ progress }: TVTextProps) {
  // TV appears after 55% progress
  if (progress <= 0.1) return null

  // TV animation progress (0 to 1) after it starts appearing
  const tvProgress = Math.min((progress - 0.05) / 0.35, 1)
  const easedProgress = 1 - Math.pow(1 - tvProgress, 3)

  return (
    <Html
      position={[2.5, 0, -2]}
      center
      transform
      occlude // enable occlusion late
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div style={{ position: 'relative', width: '400px', height: '400px' }}>
        {TV_COLORS.map((color, index) => {
          const total = TV_COLORS.length
          const normalizedIndex = index / (total - 1)

          const maxSpread = 60 // pixels of spread
          const maxRotation = 15 // degrees of rotation

          // Calculate offset and rotation based on progress
          const offsetX = 0 // (normalizedIndex * 2 - 1) * maxSpread * (1 - easedProgress)
          const offsetY = 0 //Math.sin(normalizedIndex * Math.PI) * 20 * (1 - easedProgress)
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
                zIndex: "-1",
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


function TVTextMesh({ progress }: { progress: number }) {
  if (progress <= 0.1) return null
  const tvProgress = Math.min((progress - 0.1) / 0.35, 1)
  const eased = 1 - Math.pow(1 - tvProgress, 3)

  return (
    <group position={[2.5, 0, -4]} renderOrder={1}> {/* behind logo */}
      {TV_COLORS.map((color, index) => {
        const total = TV_COLORS.length
        const t = index / (total - 1)
        const spread = 0.35

        const x = (t * 2 - 1) * spread * (1 - eased)
        const y = Math.sin(t * Math.PI) * 0.12 * (1 - eased)

        return (
          <Text
            key={index}
            fontSize={1.8}
            anchorX="center"
            anchorY="middle"
            position={[x, y, index * 0.01]}
            color={color}
          >
            tv
          </Text>
        )
      })}
    </group>
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
    groupRef.current.position.x = eased * 2

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
        // Increased offset to add more space at the pivot center (like the reference)
        geo.translate(-550, 0, 0)

        setGeometry(geo)
      }
    }
  }, [])

  if (!geometry) return null

  return (
    <group ref={groupRef} position={[0, 1, 2]} renderOrder={1}>
      <group scale={0.005} rotation={[Math.PI, 0, 0]}>
        {/* <Occluder geometry={geometry} /> */}
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
      {/* <TVText progress={progress} /> */}
      {/* <TVTextMesh progress={progress} /> */}
    </group>
  )
}

