import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

function CameraController({ activeFeature, isInteracting }) {
  const cameraRef = useRef()
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(...activeFeature.cameraPosition))
  const timeRef = useRef(0)

  useEffect(() => {
    targetPosition.current.set(...activeFeature.cameraPosition)
  }, [activeFeature])

  useFrame((state, delta) => {
    if (!cameraRef.current) return

    // Smooth camera transition
    camera.position.lerp(targetPosition.current, delta * 2)

    // Gentle auto-rotation when not interacting
    if (!isInteracting) {
      timeRef.current += delta * 0.2
      const offset = Math.sin(timeRef.current) * 0.3
      camera.position.x = targetPosition.current.x + offset
    }

    camera.lookAt(0, 0, 0)
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={activeFeature.cameraPosition}
      fov={50}
    />
  )
}

export default CameraController
