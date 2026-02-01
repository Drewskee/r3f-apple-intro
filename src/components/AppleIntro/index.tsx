'use client'

import { useState, useEffect, useCallback, useContext } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { AppleLogo } from './AppleLogo'
import { Lights } from './Lights'
import { Controls } from './Controls'
import { LayoutContext } from '@/context/layout.context'

const TOTAL_CYCLE = 6 // seconds

const GRADIENT_COLORS = {
  dark: ['#080808', '#000000'],
  light: ['#203A43', '#C4E0E5'],
}

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

function GradientBackground() {
  const { scene } = useThree()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const colors = isDark ? GRADIENT_COLORS.dark : GRADIENT_COLORS.light

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Top-right to bottom-left (45 degrees)
    const gradient = ctx.createLinearGradient(512, 0, 0, 512)
    colors.forEach((color, i) => {
      gradient.addColorStop(i / (colors.length - 1), color)
    })

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    const texture = new THREE.CanvasTexture(canvas)
    scene.background = texture

    return () => {
      texture.dispose()
      scene.background = null
    }
  }, [scene, isDark])

  return null
}

export function AppleIntro() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isDark, setIsDark] = useState(true)
  const { mainContentWidth } = useContext(LayoutContext)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    let lastTime = performance.now()
    let animationId: number

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000 // Convert to seconds
      lastTime = currentTime

      setProgress((prev) => {
        const newProgress = prev + deltaTime / TOTAL_CYCLE
        return newProgress >= 1 ? newProgress % 1 : newProgress
      })

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [isPlaying])

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleRestart = useCallback(() => {
    setProgress(0)
    setIsPlaying(true)
  }, [])

  const handleSliderChange = useCallback((value: number) => {
    setProgress(value)
  }, [])

  return (
    <div className="apple-intro-container overflow-hidden rounded-b-lg" style={{ width: mainContentWidth }}>
      <Canvas
        camera={{ position: [0, 1, 6], fov: 50 }}
        gl={{
          antialias: false,
          alpha: false,
          toneMapping: 0,
        }}
        className='overflow-hidden rounded-b-lg'
      >
          <ambientLight intensity={isDark ? 1.2 * Math.PI : Math.sin(progress) * Math.PI } />

        <GradientBackground />
        <CameraAnimation progress={progress} />

        <AppleLogo progress={progress} />
        <Lights progress={progress} />

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={1.95}
            mipmapBlur
            radius={0.8}
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      <Controls
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={handlePlayPause}
        onRestart={handleRestart}
        onSliderChange={handleSliderChange}
      />
    </div>
  )
}
