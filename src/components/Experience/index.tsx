'use client'

import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Lights } from './Lights'
import { Controls } from './Controls'
import LogoWrapper from './LogoWrapper'
import GradientBackground from './GradientBackground'
import CameraAnimation from './CameraAnimation'
import { TOTAL_CYCLE } from '@/lib/constants'

function AppleIntro() {
    const [isPlaying, setIsPlaying] = useState(true)
    const [progress, setProgress] = useState(0)
    const [isDark, setIsDark] = useState(true)

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
        <div className="w-full h-[100vh] overflow-hidden rounded-b-lg bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
            <Canvas
                camera={{ position: [0, 1, 6], fov: 50 }}
                gl={{
                    antialias: false,
                    alpha: false,
                    toneMapping: 0,
                }}
                className='overflow-hidden rounded-b-lg'
            >
                <ambientLight intensity={isDark ? 1.2 * Math.PI : Math.sin(progress) * Math.PI} />

                <GradientBackground />
                <CameraAnimation progress={progress} />

                <LogoWrapper progress={progress} />
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

export default AppleIntro