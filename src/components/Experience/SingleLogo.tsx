'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FAN_ANIMATION_SPEED } from '@/lib/constants'

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

  // Staggered timing
  const normalizedIndex = index / (total - 1) // 0 to 1
  const sliceDelay = normalizedIndex * 0.4 

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

export default SingleLogo;