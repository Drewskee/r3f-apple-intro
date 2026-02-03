'use client'

interface LightsProps {
  progress?: number
}

export function Lights({ progress }: LightsProps) {
  return (
    <>
      {/* Stronger ambient for colored apple glow */}
      <ambientLight intensity={2 * Math.sin(progress || 0)} />

      {/* Rim lights for edge glow */}
      <pointLight position={[8, 0, -5]} intensity={2} color="#ff00ff" distance={20} />
      <pointLight position={[-8, 0, -5]} intensity={2} color="#0088ff" distance={20} />

      {/* Top and bottom fill */}
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, -8, 0]} intensity={0.3} color="#ffffff" />
    </>
  )
}
