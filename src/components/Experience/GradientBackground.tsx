

'use client'

import { useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GRADIENT_COLORS }  from '@/lib/constants'

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


export default GradientBackground