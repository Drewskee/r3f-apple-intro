'use client'

export function Lights() {
  return (
    <>
      {/* Soft ambient for base visibility */}
      <ambientLight intensity={0.4} />

      {/* Key light from front */}
      <directionalLight
        position={[-2, 0, 40]}
        intensity={2}
        color="#ffffff"
      />

      {/* Rim lights for edge glow */}
      <pointLight position={[8, 0, -5]} intensity={2} color="#ff00ff" distance={20} />
      <pointLight position={[-8, 0, -5]} intensity={2} color="#0088ff" distance={20} />

      {/* Top and bottom fill */}
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, -8, 0]} intensity={0.3} color="#ffffff" />
    </>
  )
}
