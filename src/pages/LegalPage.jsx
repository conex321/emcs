import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import './LegalPage.css'

const LEGAL_CONTENT = {
    '/privacy-policy': {
        title: 'Privacy Policy',
        subtitle: 'How EMCS collects, uses, and protects student and family information.',
        sections: [
            {
                heading: 'Information We Collect',
                paragraphs: [
                    'We collect the information you provide during inquiries, account creation, checkout, and student registration. This may include parent contact details, student identification details, academic background, uploaded supporting documents, and order history.',
                    'We also collect limited technical data needed to operate the website securely, such as authentication events and transactional records tied to your account.',
                ],
            },
            {
                heading: 'How We Use Information',
                paragraphs: [
                    'We use this information to provide admissions support, create accounts, process enrollments, communicate about orders, and administer student access to EMCS services.',
                    'Uploaded documents and enrollment records are used only for registration review, academic operations, and compliance-related school processes.',
                ],
            },
            {
                heading: 'Storage and Access',
                paragraphs: [
                    'EMCS stores operational data in Supabase-backed systems with role-based access controls. Administrative access is limited to authorized staff who need the information to support registration, enrollment, or compliance workflows.',
                    'Sensitive systems such as payments and external learning platforms may use separate providers when they are fully configured.',
                ],
            },
            {
                heading: 'Questions or Requests',
                paragraphs: [
                    'If you need help updating your information or have privacy questions, contact EMCS at contact@emcs.ca.',
                ],
            },
        ],
    },
    '/terms-of-service': {
        title: 'Terms of Service',
        subtitle: 'The basic rules for using EMCS enrollment, portal, and student-support services.',
        sections: [
            {
                heading: 'Use of the Platform',
                paragraphs: [
                    'EMCS provides information, registration, and portal access for families exploring or participating in EMCS programs. You agree to provide accurate registration details and to keep your account credentials secure.',
                    'Families are responsible for reviewing program details, prerequisites, and school communications before enrolling in a course or program.',
                ],
            },
            {
                heading: 'Orders and Enrollment',
                paragraphs: [
                    'Submitting an order does not guarantee immediate academic activation in every case. Enrollment, portal access, and academic review may depend on registration completeness, supporting documents, and school approval steps.',
                    'Where payment integrations or external systems are still being configured, EMCS may follow up manually to complete the final operational steps.',
                ],
            },
            {
                heading: 'Student Records and Documents',
                paragraphs: [
                    'Families may be asked to submit supporting documents such as report cards, identification, or other verification materials. These documents must be accurate and belong to the student being registered.',
                    'EMCS may use submitted documents to review placement, eligibility, and registration readiness.',
                ],
            },
            {
                heading: 'Contact and Support',
                paragraphs: [
                    'Questions about these terms or an active registration can be sent to contact@emcs.ca. EMCS may update operational details on the website as services evolve.',
                ],
            },
        ],
    },
}

function LegalPage() {
    const location = useLocation()
    const content = useMemo(() => LEGAL_CONTENT[location.pathname] || LEGAL_CONTENT['/privacy-policy'], [location.pathname])

    return (
        <div className="legal-page">
            <section className="legal-hero">
                <div className="container">
                    <h1>{content.title}</h1>
                    <p>{content.subtitle}</p>
                </div>
            </section>

            <section className="legal-content section">
                <div className="container legal-layout">
                    {content.sections.map((section) => (
                        <article key={section.heading} className="legal-card card">
                            <h2>{section.heading}</h2>
                            {section.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default LegalPage
