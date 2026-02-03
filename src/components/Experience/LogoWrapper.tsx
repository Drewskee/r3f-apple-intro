
'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { LOGO_COLORS, GEO_TRANSLATE_X, GEO_TRANSLATE_Y, GEO_TRANSLATE_Z } from '@/lib/constants'
import SingleLogo from '../Experience/SingleLogo';

// Apple logo SVG path
const APPLE_SVG_PATH = `M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z`


interface LogoWrapperProps {
  progress: number
}

export function LogoWrapper({ progress }: LogoWrapperProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [geometry, setGeometry] = useState<THREE.ExtrudeGeometry | null>(null)

  useFrame(() => {
    if (!groupRef.current) return

    // closing portion only (your slices complete around ~0.55)
    const closeProgress = Math.min(progress / 0.55, 1)
    const eased = 1 - Math.pow(1 - closeProgress, 3)

    // Example: start rotated, end aligned
    const startY = -Math.PI * 0.1  // ~-18deg
    const endY = 0                 // end aligned
    groupRef.current.rotation.y = startY * (1 - eased) + endY * eased
    groupRef.current.position.x = eased * 3

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
        geo.translate(GEO_TRANSLATE_X, GEO_TRANSLATE_Y, GEO_TRANSLATE_Z)
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
    </group>
  )
}


export default LogoWrapper;