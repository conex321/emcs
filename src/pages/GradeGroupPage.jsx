import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GradeGroupPanel from '../components/storefront/GradeGroupPanel'
import './GradeGroupPage.css'

const VALID_SLUGS = ['elementary', 'middle', 'high']

const GROUP_HEROES = {
    elementary: { title: 'Elementary (Grades 1 to 5)', subtitle: 'Build strong foundations in core subjects aligned with the Ontario Curriculum.' },
    middle: { title: 'Middle School (Grades 6 to 8)', subtitle: 'Prepare for the Grade 9 academic bridge with rigorous Ontario-aligned learning.' },
    high: { title: 'High School (Grades 9 to 12)', subtitle: 'Flexible Learning Pathways. Learn First. Decide Later. Succeed Safely.' },
}

function GradeGroupPage({ storefront = 'academic-prep' }) {
    const { groupSlug } = useParams()
    const { t } = useTranslation()

    if (!VALID_SLUGS.includes(groupSlug)) {
        return (
            <div className="grade-group-page grade-group-page--error">
                <div className="container">
                    <h1>{t('gradePage.invalidGrade', 'Invalid Grade Group')}</h1>
                    <p>We could not find a grade group matching "{groupSlug}".</p>
                    <Link to={`/${storefront}`} className="btn btn-primary">Return to {storefront === 'academic-prep' ? 'Academic Prep' : 'Official Ontario'}</Link>
                </div>
            </div>
        )
    }

    const hero = GROUP_HEROES[groupSlug]

    return (
        <div className="grade-group-page">
            <section className="grade-group-page__hero">
                <div className="container">
                    <nav className="grade-group-page__breadcrumbs">
                        <Link to={`/${storefront}`}>
                            {storefront === 'academic-prep' ? 'Academic Preparation Program' : 'Official Ontario Program'}
                        </Link>
                        <span> / </span>
                        <span>{hero.title}</span>
                    </nav>
                    <h1>{hero.title}</h1>
                    <p className="grade-group-page__hero-subtitle">{hero.subtitle}</p>
                </div>
            </section>

            <section className="grade-group-page__body">
                <div className="container">
                    <GradeGroupPanel groupSlug={groupSlug} context="both" />
                </div>
            </section>
        </div>
    )
}

export default GradeGroupPage
