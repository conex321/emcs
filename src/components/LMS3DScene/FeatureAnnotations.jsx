import { Html } from '@react-three/drei'
import { useState } from 'react'

function FeatureAnnotations({ features, activeFeature, onFeatureChange }) {
  const [hoveredId, setHoveredId] = useState(null)

  const positions = {
    browsing: [1.8, 0.6, 0],
    learning: [1.8, 0.2, 0],
    progress: [1.8, -0.2, 0],
    support: [1.8, -0.6, 0]
  }

  return (
    <>
      {features.map((feature) => (
        <Html
          key={feature.id}
          position={positions[feature.id]}
          distanceFactor={5}
        >
          <button
            className={`feature-hotspot ${activeFeature.id === feature.id ? 'active' : ''} ${hoveredId === feature.id ? 'hovered' : ''}`}
            onClick={() => onFeatureChange(feature.id)}
            onMouseEnter={() => setHoveredId(feature.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              borderColor: activeFeature.id === feature.id ? feature.highlightColor : '#ccc',
              backgroundColor: activeFeature.id === feature.id ? feature.highlightColor : '#fff'
            }}
            aria-label={feature.title}
          >
            <span className="hotspot-icon">{feature.icon}</span>
            {(activeFeature.id === feature.id || hoveredId === feature.id) && (
              <span className="hotspot-label">{feature.title}</span>
            )}
          </button>
        </Html>
      ))}
    </>
  )
}

export default FeatureAnnotations
