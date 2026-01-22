import { useState, useEffect, useCallback, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useResponsive3D } from './hooks/useResponsive3D'
import { useFeatureTransition } from './hooks/useFeatureTransition'
import MobileView from './MobileView'
import LaptopModel from './LaptopModel'
import ScreenContent from './ScreenContent'
import FeatureAnnotations from './FeatureAnnotations'
import CameraController from './CameraController'
import './LMS3DScene.css'

function Scene({ activeFeature, onFeatureChange, setIsInteracting }) {
  return (
    <>
      <CameraController activeFeature={activeFeature} isInteracting={false} />

      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.6} />

      {/* Main key light from top-right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill light from left to soften shadows */}
      <directionalLight
        position={[-4, 3, 3]}
        intensity={0.4}
        color="#ffffff"
      />

      {/* Rim light from behind for depth */}
      <spotLight
        position={[0, 4, -5]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.6}
        color="#ffffff"
      />

      {/* Environment lighting for realistic reflections */}
      <hemisphereLight
        skyColor="#ffffff"
        groundColor="#444444"
        intensity={0.5}
      />

      <LaptopModel />
      <ScreenContent activeFeature={activeFeature} />
      <FeatureAnnotations
        features={useFeatureTransition().features}
        activeFeature={activeFeature}
        onFeatureChange={onFeatureChange}
      />
    </>
  )
}

function LMS3DScene() {
  const { isMobile } = useResponsive3D()
  const { features } = useFeatureTransition()
  const [activeFeature, setActiveFeature] = useState(features[0])
  const [isInView, setIsInView] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const containerRef = useRef()

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
      const currentIndex = features.findIndex((f) => f.id === activeFeature.id)

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          setActiveFeature(features[(currentIndex + 1) % features.length])
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          setActiveFeature(
            features[(currentIndex - 1 + features.length) % features.length]
          )
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [activeFeature, features])

  const handleFeatureChange = useCallback(
    (featureId) => {
      const feature = features.find((f) => f.id === featureId)
      if (feature) {
        setActiveFeature(feature)
        setIsInteracting(true)
        setTimeout(() => setIsInteracting(false), 1000)
      }
    },
    [features]
  )

  const hasWebGL = (() => {
    try {
      const canvas = document.createElement('canvas')
      return !!(
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      )
    } catch (e) {
      return false
    }
  })()

  if (isMobile || !hasWebGL) {
    return <MobileView />
  }

  return (
    <div
      ref={containerRef}
      className="lms-3d-container"
      role="region"
      aria-label="Interactive LMS Demo"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeFeature.title} - {activeFeature.description}
      </div>

      {isInView && (
        <Canvas className="lms-3d-canvas" aria-hidden="true">
          <Scene
            activeFeature={activeFeature}
            onFeatureChange={handleFeatureChange}
            setIsInteracting={setIsInteracting}
          />
        </Canvas>
      )}

      <div className="feature-selector">
        {features.map((feature) => (
          <button
            key={feature.id}
            className={`feature-btn ${
              activeFeature.id === feature.id ? 'active' : ''
            }`}
            onClick={() => handleFeatureChange(feature.id)}
            style={{
              borderColor:
                activeFeature.id === feature.id ? feature.highlightColor : '#ccc'
            }}
          >
            <span className="feature-icon">{feature.icon}</span>
            <span className="feature-title">{feature.title}</span>
          </button>
        ))}
      </div>

      <div className="sr-only">
        <h3>LMS Features</h3>
        <ul>
          {features.map((f) => (
            <li key={f.id}>
              <strong>{f.title}:</strong> {f.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LMS3DScene
