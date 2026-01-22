import { Html } from '@react-three/drei'

function ScreenContent({ activeFeature }) {
  const renderScreen = () => {
    switch (activeFeature.id) {
      case 'browsing':
        return (
          <div className="screen-ui browsing-ovs">
            <div className="ovs-header">
              <div className="ovs-logo">OVS</div>
              <div className="ovs-search">
                <input placeholder="Search courses..." />
              </div>
            </div>
            <div className="ovs-course-grid">
              <div className="ovs-course-card">
                <div className="course-badge">GRADE 12</div>
                <h4>ENG4U</h4>
                <p>English</p>
                <button className="ovs-btn-primary">Enroll Now</button>
              </div>
              <div className="ovs-course-card">
                <div className="course-badge">GRADE 12</div>
                <h4>MHF4U</h4>
                <p>Advanced Functions</p>
                <button className="ovs-btn-primary">Enroll Now</button>
              </div>
              <div className="ovs-course-card">
                <div className="course-badge">GRADE 12</div>
                <h4>SBI4U</h4>
                <p>Biology</p>
                <button className="ovs-btn-primary">Enroll Now</button>
              </div>
              <div className="ovs-course-card">
                <div className="course-badge">GRADE 12</div>
                <h4>SCH4U</h4>
                <p>Chemistry</p>
                <button className="ovs-btn-primary">Enroll Now</button>
              </div>
            </div>
          </div>
        )
      case 'learning':
        return (
          <div className="screen-ui learning-ovs">
            <div className="ovs-video-container">
              <div className="video-wrapper">
                <div className="play-button">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.9)" />
                    <polygon points="16,12 16,28 28,20" fill="#AA0304" />
                  </svg>
                </div>
                <div className="video-info">
                  <h4>Lesson 3.2: Quadratic Functions</h4>
                  <span className="video-duration">12:45</span>
                </div>
              </div>
            </div>
            <div className="ovs-lesson-sidebar">
              <div className="lesson-progress-item completed">
                <span className="check-icon">✓</span>
                <span>Introduction</span>
              </div>
              <div className="lesson-progress-item completed">
                <span className="check-icon">✓</span>
                <span>Basic Concepts</span>
              </div>
              <div className="lesson-progress-item active">
                <span className="play-icon-small">▶</span>
                <span>Quadratic Functions</span>
              </div>
              <div className="lesson-progress-item">
                <span className="number-icon">4</span>
                <span>Practice Quiz</span>
              </div>
              <div className="lesson-progress-item">
                <span className="number-icon">5</span>
                <span>Assignment</span>
              </div>
            </div>
          </div>
        )
      case 'progress':
        return (
          <div className="screen-ui progress-ovs">
            <div className="ovs-dashboard-header">
              <h3>Student Dashboard</h3>
              <span className="semester-badge">Fall 2024</span>
            </div>
            <div className="ovs-stats-row">
              <div className="ovs-stat-card">
                <div className="stat-number">92%</div>
                <div className="stat-label">Overall Average</div>
              </div>
              <div className="ovs-stat-card">
                <div className="stat-number">5/6</div>
                <div className="stat-label">Courses Complete</div>
              </div>
              <div className="ovs-stat-card">
                <div className="stat-number">18</div>
                <div className="stat-label">Credits Earned</div>
              </div>
            </div>
            <div className="ovs-course-list">
              <div className="course-progress-item">
                <div className="course-info-compact">
                  <strong>ENG4U</strong>
                  <span>95%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-fill" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="course-progress-item">
                <div className="course-info-compact">
                  <strong>MHF4U</strong>
                  <span>88%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-fill" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'support':
        return (
          <div className="screen-ui support-ovs">
            <div className="ovs-chat-header">
              <div className="teacher-avatar">
                <div className="avatar-circle">MS</div>
              </div>
              <div className="teacher-info">
                <h4>Ms. Sarah Chen</h4>
                <span className="online-status">● Online</span>
              </div>
            </div>
            <div className="ovs-chat-messages">
              <div className="chat-message received">
                <div className="message-bubble">
                  Hello! How can I help you today?
                </div>
                <span className="message-time">2:34 PM</span>
              </div>
              <div className="chat-message sent">
                <div className="message-bubble">
                  I have a question about the assignment deadline.
                </div>
                <span className="message-time">2:35 PM</span>
              </div>
              <div className="chat-message received">
                <div className="message-bubble">
                  Of course! Which assignment are you asking about?
                </div>
                <span className="message-time">2:35 PM</span>
              </div>
            </div>
            <div className="ovs-chat-input">
              <input placeholder="Type your message..." />
              <button className="send-btn">Send</button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Html
      transform
      distanceFactor={1.55}
      position={[0, 0, 0.07]}
      style={{
        width: '380px',
        height: '220px',
        transition: 'opacity 0.3s',
        pointerEvents: 'none'
      }}
    >
      {renderScreen()}
    </Html>
  )
}

export default ScreenContent
