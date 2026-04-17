import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './ProgramCompare.css'

const BANDS = ['elementary', 'middle', 'high']

const ROW_KEYS = [
    'purpose', 'record', 'credential', 'curriculum', 'delivery',
    'assessment', 'focus', 'progression', 'outcome',
    'fullYearPriceLow', 'perCoursePriceLow', 'perCoursePriceHigh',
    'registrationFee', 'entranceTestFee', 'schedule',
]

// Rows applicable per band
const ROWS_BY_BAND = {
    elementary: ['purpose', 'record', 'credential', 'curriculum', 'delivery', 'assessment', 'focus', 'progression', 'outcome', 'fullYearPriceLow', 'perCoursePriceLow', 'registrationFee', 'entranceTestFee', 'schedule'],
    middle: ['purpose', 'record', 'credential', 'curriculum', 'delivery', 'assessment', 'focus', 'progression', 'outcome', 'fullYearPriceLow', 'perCoursePriceLow', 'registrationFee', 'entranceTestFee', 'schedule'],
    high: ['purpose', 'record', 'credential', 'curriculum', 'delivery', 'assessment', 'focus', 'progression', 'outcome', 'perCoursePriceHigh', 'registrationFee', 'entranceTestFee', 'schedule'],
}

function ProgramCompare() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [activeBand, setActiveBand] = useState('high')
    const [quizOpen, setQuizOpen] = useState(false)
    const [quizStep, setQuizStep] = useState(0)
    const [quizAnswers, setQuizAnswers] = useState({})
    const [quizResult, setQuizResult] = useState(null)

    const rows = ROWS_BY_BAND[activeBand]

    const questions = t('comparePage.quiz.questions', { returnObjects: true }) || []

    const handleAnswer = (qIdx, value) => {
        const next = { ...quizAnswers, [qIdx]: value }
        setQuizAnswers(next)
        if (qIdx + 1 < questions.length) {
            setQuizStep(qIdx + 1)
        } else {
            setQuizResult(computeResult(next))
        }
    }

    const computeResult = (answers) => {
        const grade = answers[0]
        const needsRecord = answers[1]
        const readiness = answers[2]
        const goal = answers[3]

        // High school with OSSD goal → Official Ontario
        if (grade === 'high' && (goal === 'ossd' || goal === 'credit') && readiness === 'ready') {
            return 'official'
        }
        // High school unsure → High School Pathways hub
        if (grade === 'high') {
            return 'highSchool'
        }
        // Needs record + ready for credit → Official
        if (needsRecord === 'yes' && goal === 'credit') {
            return 'official'
        }
        // OSSD goal → Official
        if (goal === 'ossd') {
            return 'official'
        }
        // Default: Academic Prep
        return 'academic'
    }

    const resetQuiz = () => {
        setQuizStep(0)
        setQuizAnswers({})
        setQuizResult(null)
    }

    const exploreResult = () => {
        if (quizResult === 'official') navigate('/official-ontario')
        else if (quizResult === 'highSchool') navigate('/programs/high-school')
        else navigate('/academic-prep')
    }

    return (
        <div className="program-compare-page">
            <section className="compare-hero">
                <div className="container">
                    <h1>{t('comparePage.hero.title', 'Academic Preparation Program vs. Official Ontario Program')}</h1>
                    <p>{t('comparePage.hero.subtitle', 'Choose the pathway that fits your goals.')}</p>
                </div>
            </section>

            <section className="compare-selector-section">
                <div className="container">
                    <label className="compare-selector-label">{t('comparePage.selectorLabel', 'Select grade band:')}</label>
                    <div className="compare-band-tabs">
                        {BANDS.map(b => (
                            <button
                                key={b}
                                className={`compare-band-tab ${activeBand === b ? 'active' : ''}`}
                                onClick={() => setActiveBand(b)}
                            >
                                {t(`comparePage.bands.${b}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="compare-matrix-section">
                <div className="container">
                    <div className="compare-matrix-wrapper">
                        <table className="compare-matrix">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="th-academic">Academic Preparation Program<br /><small>(Non-Ontario student record)</small></th>
                                    <th className="th-official">Official Ontario Program<br /><small>(Ontario student record)</small></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(rowKey => (
                                    <tr key={rowKey}>
                                        <td className="row-label">{t(`comparePage.rows.${rowKey}.label`)}</td>
                                        <td>{t(`comparePage.rows.${rowKey}.academic`)}</td>
                                        <td>{t(`comparePage.rows.${rowKey}.official`)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Quiz */}
            <section className="compare-quiz-section">
                <div className="container">
                    <div className="quiz-card">
                        <h2>{t('comparePage.quiz.heading', 'Not sure? Take our 60-second program quiz')}</h2>
                        <p>{t('comparePage.quiz.subtitle', 'Answer 4 quick questions and we will recommend the best pathway for your student.')}</p>

                        {!quizOpen && !quizResult && (
                            <button className="btn btn-primary btn-lg" onClick={() => setQuizOpen(true)}>
                                {t('comparePage.quiz.start', 'Start Quiz')}
                            </button>
                        )}

                        {quizOpen && !quizResult && questions[quizStep] && (
                            <div className="quiz-step">
                                <div className="quiz-progress">
                                    Question {quizStep + 1} of {questions.length}
                                </div>
                                <h3>{questions[quizStep].q}</h3>
                                <div className="quiz-options">
                                    {(questions[quizStep].options || []).map(opt => (
                                        <button
                                            key={opt.value}
                                            className={`quiz-option ${quizAnswers[quizStep] === opt.value ? 'selected' : ''}`}
                                            onClick={() => handleAnswer(quizStep, opt.value)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                {quizStep > 0 && (
                                    <button className="btn btn-outline" onClick={() => setQuizStep(quizStep - 1)}>
                                        ← {t('comparePage.quiz.back', 'Back')}
                                    </button>
                                )}
                            </div>
                        )}

                        {quizResult && (
                            <div className="quiz-result">
                                <span className="quiz-result__badge">{t('comparePage.quiz.result', 'Recommendation')}</span>
                                <h3>{t(`comparePage.quiz.results.${quizResult}.title`)}</h3>
                                <p>{t(`comparePage.quiz.results.${quizResult}.body`)}</p>
                                <div className="quiz-result__buttons">
                                    <button className="btn btn-primary btn-lg" onClick={exploreResult}>
                                        {quizResult === 'academic' && t('comparePage.quiz.exploreAcademic', 'Explore Academic Preparation Program')}
                                        {quizResult === 'official' && t('comparePage.quiz.exploreOfficial', 'Explore Official Ontario Program')}
                                        {quizResult === 'highSchool' && t('comparePage.quiz.exploreHighSchool', 'Explore High School Pathways')}
                                    </button>
                                    <button className="btn btn-outline btn-lg" onClick={resetQuiz}>
                                        {t('comparePage.quiz.retake', 'Retake Quiz')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="compare-cta-section">
                <div className="container">
                    <Link to="/contact" className="btn btn-accent btn-lg">
                        {t('comparePage.cta', 'Speak with an Advisor')}
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default ProgramCompare
