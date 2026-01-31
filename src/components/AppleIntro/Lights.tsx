'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightsProps {
  progress: number
}

export function Lights({ progress }: LightsProps) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    if (!directionalLightRef.current) return

    // Light fades in smoothly - starts at 40%, full at 65%
    const fadeStart = 0.4
    const fadeEnd = 0.6
    const fadeProgress = Math.max(0, Math.min((progress - fadeStart) / (fadeEnd - fadeStart), 1))

    // Smooth ease-out curve
    const easedFade = 1 - Math.pow(1 - fadeProgress, 3)

    // Animate intensity from 0 to 2.5
    directionalLightRef.current.intensity = easedFade * 1.1

    // Animate Z position straight in (from -10 to 40)
    directionalLightRef.current.position.z = -10 + easedFade * 50
  })

  return (
    <>
      {/* Stronger ambient for colored apple glow */}
      <ambientLight intensity={2} />

      {/* Key light - animates straight in from behind */}
      {/* <directionalLight
        ref={directionalLightRef}
        position={[-2, -1, 0]}
        intensity={0}
        color="#ffffff"
      /> */}

      {/* Rim lights for edge glow */}
      <pointLight position={[8, 0, -5]} intensity={2} color="#ff00ff" distance={20} />
      <pointLight position={[-8, 0, -5]} intensity={2} color="#0088ff" distance={20} />

      {/* Top and bottom fill */}
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, -8, 0]} intensity={0.3} color="#ffffff" />
    </>
  )
}
