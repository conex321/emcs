import { RoundedBox } from '@react-three/drei'
import { useRef } from 'react'

function LaptopModel() {
  const laptopRef = useRef()

  return (
    <group ref={laptopRef} position={[0, -0.5, 0]}>
      {/* Screen Assembly */}
      <group rotation={[-0.3, 0, 0]} position={[0, 0.8, -0.3]}>
        {/* Screen Back (Aluminum shell) */}
        <RoundedBox args={[4.2, 2.6, 0.08]} radius={0.08} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.7}
            roughness={0.3}
            envMapIntensity={0.8}
          />
        </RoundedBox>

        {/* Screen Bezel (Black border) */}
        <RoundedBox args={[4.0, 2.4, 0.02]} radius={0.06} smoothness={4} position={[0, 0, 0.05]}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.1} />
        </RoundedBox>

        {/* Screen Display (Glossy) */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[3.8, 2.2]} />
          <meshStandardMaterial
            color="#0f0f0f"
            roughness={0.1}
            metalness={0.05}
            emissive="#050505"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Webcam */}
        <mesh position={[0, 1.15, 0.05]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.3} />
        </mesh>
      </group>

      {/* Keyboard Base */}
      <group position={[0, 0, 0]}>
        {/* Main Base (Aluminum) */}
        <RoundedBox
          args={[4.2, 0.12, 2.8]}
          radius={0.08}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#3a3a3a"
            metalness={0.7}
            roughness={0.25}
            envMapIntensity={0.9}
          />
        </RoundedBox>

        {/* Keyboard Deck (Darker area) */}
        <RoundedBox
          args={[3.8, 0.02, 2.4]}
          radius={0.04}
          smoothness={4}
          position={[0, 0.08, 0.1]}
        >
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.3} />
        </RoundedBox>

        {/* Trackpad */}
        <RoundedBox
          args={[1.2, 0.01, 0.8]}
          radius={0.02}
          smoothness={4}
          position={[0, 0.09, 0.8]}
        >
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
        </RoundedBox>

        {/* Keyboard Keys (simplified grid) */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => (
            <mesh
              key={`key-${row}-${col}`}
              position={[
                -1.8 + col * 0.27,
                0.1,
                -0.8 + row * 0.27
              ]}
            >
              <boxGeometry args={[0.22, 0.02, 0.22]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
            </mesh>
          ))
        )}

        {/* Speaker Grilles (left and right) */}
        {[-1.5, 1.5].map((x, i) => (
          <mesh key={`speaker-${i}`} position={[x, 0.09, -1.1]}>
            <boxGeometry args={[0.6, 0.01, 0.15]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Bottom Case Shadow */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.5, 3]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  )
}

export default LaptopModel
