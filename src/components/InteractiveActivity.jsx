import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { checkAnswer, getRandomEncouragement } from '../data/activities'
import './InteractiveActivity.css'

function InteractiveActivity({ activity, onComplete }) {
    const { t } = useTranslation()
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [inputAnswer, setInputAnswer] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [result, setResult] = useState(null)
    const [attempts, setAttempts] = useState(0)
    const [showHint, setShowHint] = useState(false)

    // Reset state when activity changes
    useEffect(() => {
        setSelectedAnswer(null)
        setInputAnswer('')
        setIsSubmitted(false)
        setResult(null)
        setAttempts(0)
        setShowHint(false)
    }, [activity?.activityId])

    if (!activity) {
        return <div className="activity-error">{t('activities.ui.notFound', 'Activity not found')}</div>
    }

    const handleChoiceSelect = (value) => {
        if (isSubmitted) return
        setSelectedAnswer(value)
    }

    const handleInputChange = (e) => {
        if (isSubmitted) return
        setInputAnswer(e.target.value)
    }

    const handleSubmit = () => {
        const answer = activity.type === 'numericInput' ? inputAnswer : selectedAnswer

        if (answer === null && inputAnswer === '') {
            return
        }

        const checkResult = checkAnswer(activity, answer)
        setResult(checkResult)
        setIsSubmitted(true)
        setAttempts(prev => prev + 1)

        // Show hint after failed attempts
        if (!checkResult.correct && attempts >= 1) {
            setShowHint(true)
        }
    }

    const handleTryAgain = () => {
        setIsSubmitted(false)
        setResult(null)
        setSelectedAnswer(null)
        setInputAnswer('')
    }

    const handleNext = () => {
        if (onComplete) {
            onComplete({
                activityId: activity.activityId,
                correct: result?.correct,
                attempts: attempts,
            })
        }
    }

    const encouragement = result ?
        getRandomEncouragement(result.feedback) : ''

    return (
        <div className={`interactive-activity ${activity.difficulty}`}>
            {/* Header */}
            <div className="activity-header">
                <span className="activity-grade">{t('nav.gradePrefix', 'Grade') + ' '}{activity.grade}</span>
                <span className="activity-topic">{activity.topic}</span>
            </div>

            {/* Main Content */}
            <div className="activity-content">
                {/* Media */}
                {activity.media?.image && (
                    <div className="activity-media">
                        <img
                            src={activity.media.image}
                            alt={activity.media.imageAlt || 'Activity illustration'}
                            onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                            }}
                        />
                        <div className="image-placeholder" style={{ display: 'none' }}>
                            <span className="placeholder-icon">🖼️</span>
                            <span>{activity.media.imageAlt}</span>
                        </div>
                    </div>
                )}

                {/* Prompt */}
                <div className="activity-prompt">
                    <h2>{activity.prompt.text}</h2>
                    {activity.prompt.subtext && (
                        <p className="prompt-subtext">{activity.prompt.subtext}</p>
                    )}
                    {activity.prompt.voiceover && (
                        <button className="voiceover-btn" aria-label={t('activities.ui.listenToQuestion', 'Listen to question')}>
                            🔊
                        </button>
                    )}
                </div>

                {/* Answer Area */}
                <div className="activity-answer">
                    {/* Multiple Choice */}
                    {activity.type === 'multipleChoice' && (
                        <div className="choices-grid">
                            {activity.choices?.map((choice, index) => (
                                <button
                                    key={index}
                                    className={`choice-btn ${
                                        selectedAnswer === choice.value ? 'selected' : ''
                                    } ${
                                        isSubmitted && choice.value === activity.answer ? 'correct' : ''
                                    } ${
                                        isSubmitted && selectedAnswer === choice.value && choice.value !== activity.answer ? 'incorrect' : ''
                                    }`}
                                    onClick={() => handleChoiceSelect(choice.value)}
                                    disabled={isSubmitted}
                                >
                                    {choice.image ? (
                                        <img src={choice.image} alt={choice.display} />
                                    ) : (
                                        <span className="choice-value">{choice.display}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Numeric Input */}
                    {activity.type === 'numericInput' && (
                        <div className="numeric-input-wrapper">
                            <input
                                type="text"
                                className={`numeric-input ${
                                    isSubmitted ? (result?.correct ? 'correct' : 'incorrect') : ''
                                }`}
                                value={inputAnswer}
                                onChange={handleInputChange}
                                placeholder="?"
                                disabled={isSubmitted}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Hint */}
                {showHint && activity.feedback.incorrect.hint && (
                    <div className="activity-hint">
                        <span className="hint-icon">💡</span>
                        <p>{activity.feedback.incorrect.hint}</p>
                    </div>
                )}

                {/* Feedback */}
                {isSubmitted && result && (
                    <div className={`activity-feedback ${result.correct ? 'correct' : 'incorrect'}`}>
                        <div className="feedback-icon">
                            {result.correct ? '⭐' : '🔄'}
                        </div>
                        <div className="feedback-text">
                            <p className="feedback-main">{result.feedback.text}</p>
                            {encouragement && (
                                <p className="feedback-encouragement">{encouragement}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="activity-actions">
                {!isSubmitted ? (
                    <button
                        className="btn btn-accent btn-lg"
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null && inputAnswer === ''}
                    >
                        {t('activities.ui.checkAnswer', 'Check Answer')}
                    </button>
                ) : result?.correct ? (
                    <button
                        className="btn btn-accent btn-lg"
                        onClick={handleNext}
                    >
                        {t('activities.ui.nextQuestion', 'Next Question →')}
                    </button>
                ) : attempts < (activity.feedback.incorrect.showCorrectAfter || 3) ? (
                    <button
                        className="btn btn-secondary btn-lg"
                        onClick={handleTryAgain}
                    >
                        {t('activities.ui.tryAgain', 'Try Again')}
                    </button>
                ) : (
                    <div className="show-answer">
                        <p>{t('activities.ui.correctAnswerIs', 'The correct answer is: ')}<strong>{activity.answer}</strong></p>
                        <button
                            className="btn btn-accent btn-lg"
                            onClick={handleNext}
                        >
                            {t('activities.ui.nextQuestion', 'Next Question →')}
                        </button>
                    </div>
                )}
            </div>

            {/* Progress indicator */}
            <div className="activity-meta">
                <span className="meta-skill">{activity.skill}</span>
                {attempts > 0 && (
                    <span className="meta-attempts">{t('activities.ui.attempt', 'Attempt')} {attempts}</span>
                )}
            </div>
        </div>
    )
}

export default InteractiveActivity
