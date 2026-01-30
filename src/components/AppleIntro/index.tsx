'use client'

import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { AppleLogo } from './AppleLogo'
import { Lights } from './Lights'
import { Controls } from './Controls'

const TOTAL_CYCLE = 6 // seconds

export function AppleIntro() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

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
    <div className="apple-intro-container">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: 0,
        }}
      >
        <color attach="background" args={['#000000']} />

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
          enableZoom={false}
          enablePan={false}
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
