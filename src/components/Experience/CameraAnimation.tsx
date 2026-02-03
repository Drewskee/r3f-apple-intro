
'use client'

import { useThree, useFrame } from '@react-three/fiber'

interface CameraAnimationProps {
  progress: number
}

function CameraAnimation({ progress }: CameraAnimationProps) {
  const { camera } = useThree()

  useFrame(() => {
    // Zoom animation: start close, zoom out to center by 50%
    const zoomProgress = Math.min(progress / 0.6, .8) // Complete zoom by 50%

    // Ease-in-out: slow start, faster middle, slow end
    const easedZoom = zoomProgress < 0.6
      ? 4 * Math.pow(zoomProgress, 4.5)
      : 1 - Math.pow(-2 * zoomProgress + 2.3, 2) / 2

    // Camera Z position: start at 6 (close), end at 14 (far enough to see everything)
    const startZ = 8
    const endZ = 14
    camera.position.z = startZ + (endZ - startZ) * easedZoom

    // Optional: slight Y adjustment to keep centered
    const startY = 1
    const endY = 0
    camera.position.y = startY + (endY - startY) * easedZoom
  })

  return null
}

export default CameraAnimation;