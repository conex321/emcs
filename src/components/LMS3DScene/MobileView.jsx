import { useState } from 'react'
import { useFeatureTransition } from './hooks/useFeatureTransition'

function MobileView() {
  const { features } = useFeatureTransition()
  const [activeIndex, setActiveIndex] = useState(0)

  const handleDotClick = (index) => {
    setActiveIndex(index)
  }

  const activeFeature = features[activeIndex]

  return (
    <div className="lms-mobile-view">
      <div className="mobile-carousel">
        <div className="mobile-card active" style={{ borderColor: activeFeature.highlightColor }}>
          <div className="mobile-card-icon" style={{ backgroundColor: activeFeature.highlightColor }}>
            <span>{activeFeature.icon}</span>
          </div>
          <div className="mobile-card-content">
            <h3>{activeFeature.title}</h3>
            <p>{activeFeature.description}</p>
          </div>
        </div>
      </div>
      <div className="mobile-dots">
        {features.map((feature, idx) => (
          <button
            key={feature.id}
            className={`mobile-dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`View ${feature.title}`}
            style={{ backgroundColor: idx === activeIndex ? activeFeature.highlightColor : '#ccc' }}
          />
        ))}
      </div>
    </div>
  )
}

export default MobileView
