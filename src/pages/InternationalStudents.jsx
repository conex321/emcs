import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './InternationalStudents.css'

function InternationalStudents() {
    const { t, i18n } = useTranslation()

    const steps = [
        { num: 1, icon: '📝', title: t('international.step1') },
        { num: 2, icon: '📧', title: t('international.step2') },
        { num: 3, icon: '📄', title: t('international.step3') },
        { num: 4, icon: '💳', title: t('international.step4') },
        { num: 5, icon: '🎓', title: t('international.step5') }
    ]

    const benefits = [
        { icon: '🌍', title: t('international.benefits.anywhere.title'), desc: t('international.benefits.anywhere.desc') },
        { icon: '📜', title: t('international.benefits.noPermit.title'), desc: t('international.benefits.noPermit.desc') },
        { icon: '🎓', title: t('international.benefits.diploma.title'), desc: t('international.benefits.diploma.desc') },
        { icon: '🏫', title: t('international.benefits.university.title'), desc: t('international.benefits.university.desc') }
    ]

    const whyChoose = [
        {
            icon: '✓',
            title: i18n.language === 'vi' ? 'Được Bộ Giáo Dục Ontario Kiểm Tra' : 'Ontario Ministry Inspected',
            desc: i18n.language === 'vi' ? 'BSID: 665588 - Học bạ chính thức được các trường đại học toàn cầu công nhận' : 'BSID: 665588 - Official transcripts recognized by universities worldwide'
        },
        {
            icon: '💻',
            title: i18n.language === 'vi' ? '100% Trực Tuyến' : '100% Online',
            desc: i18n.language === 'vi' ? 'Không cần chuyển chỗ ở đến Canada - học từ bất cứ đâu' : 'No relocation to Canada required - study from anywhere'
        },
        {
            icon: '👨‍🏫',
            title: i18n.language === 'vi' ? 'Lớp Học Trực Tiếp' : 'Live Classes',
            desc: i18n.language === 'vi' ? '6 giờ/tuần lớp học Zoom với giáo viên có chứng chỉ Ontario' : '6 hours/week live Zoom classes with Ontario Certified Teachers'
        },
        {
            icon: '📤',
            title: i18n.language === 'vi' ? 'Gửi Hồ Sơ Trực Tiếp' : 'Direct Transcript Delivery',
            desc: i18n.language === 'vi' ? 'Học bạ chính thức gửi trực tiếp đến các trường đại học' : 'Official transcripts sent directly to universities'
        }
    ]

    return (
        <div className="international-page">
            {/* Hero */}
            <section className="international-hero">
                <div className="container">
                    <div className="hero-content animate-fade-in-up">
                        <div className="hero-flag">🇨🇦</div>
                        <h1>{t('international.title')}</h1>
                        <p>{t('international.subtitle')}</p>
                        <div className="hero-highlight">
                            <span className="highlight-icon">✓</span>
                            <span>{t('international.noPermit')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose EMCS */}
            <section className="why-international section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{i18n.language === 'vi' ? 'Tại Sao Chọn EMCS?' : 'Why Choose EMCS?'}</h2>
                    </div>
                    <div className="why-grid">
                        {whyChoose.map((item, index) => (
                            <div key={index} className="why-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="why-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnerships */}
            <section className="partnerships-section section bg-light">
                <div className="container">
                    <div className="partnership-card card">
                        <div className="partnership-content">
                            <h3>{i18n.language === 'vi' ? 'Chương Trình OSSD Liên Kết với Tập Đoàn Giáo Dục Việt Anh' : 'Joint OSSD Program with Viet Anh Education Group'}</h3>
                            <p>
                                {i18n.language === 'vi'
                                    ? 'EMC đã hợp tác với Tập Đoàn Giáo Dục Việt Anh để giúp học sinh Việt Nam đạt được cả OSSD và Bằng Tốt Nghiệp THPT Việt Nam. Sự hợp tác tiên phong này cho phép học sinh nhận tín chỉ OSSD mà không cần chuyển đến Canada.'
                                    : 'EMC has partnered with Viet Anh Education Group Corporation to enable students in Vietnam to attain both the OSSD and the Vietnamese High School Diploma. This pioneering collaboration allows students to obtain OSSD credits without relocating to Canada.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="benefits-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{i18n.language === 'vi' ? 'Lợi Ích Cho Học Sinh Quốc Tế' : 'Benefits for International Students'}</h2>
                    </div>
                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="benefit-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Registration Steps */}
            <section className="steps-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('international.howTo.title')}</h2>
                        <p className="section-subtitle">{t('international.howTo.subtitle')}</p>
                    </div>
                    <div className="steps-timeline">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="step-number">{step.num}</div>
                                <div className="step-icon">{step.icon}</div>
                                <div className="step-title">{step.title}</div>
                                {index < steps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="pricing-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('international.tuition.title')}</h2>
                        <p className="section-subtitle">{t('international.tuition.subtitle')}</p>
                    </div>
                    <div className="pricing-cards">
                        <div className="pricing-card card">
                            <div className="pricing-header">
                                <h3>{t('international.tuition.perCourse.title')}</h3>
                                <div className="price">$3,500 <span>CAD</span></div>
                            </div>
                            <ul className="pricing-features">
                                {t('international.tuition.perCourse.features', { returnObjects: true }).map((feature, i) => (
                                    <li key={i}><span className="check">✓</span> {feature}</li>
                                ))}
                            </ul>
                            <Link to="/official-ontario" className="btn btn-primary btn-lg">{i18n.language === 'vi' ? 'Xem Khóa Học' : 'Browse Courses'}</Link>
                        </div>
                        <div className="pricing-card card featured">
                            <div className="featured-badge">{t('international.tuition.package.bestValue')}</div>
                            <div className="pricing-header">
                                <h3>{t('international.tuition.package.title')}</h3>
                                <div className="price">{t('international.tuition.package.contactQuote')}</div>
                            </div>
                            <ul className="pricing-features">
                                {t('international.tuition.package.features', { returnObjects: true }).map((feature, i) => (
                                    <li key={i}><span className="check">✓</span> {feature}</li>
                                ))}
                            </ul>
                            <Link to="/contact" className="btn btn-accent btn-lg">{t('nav.contact')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documents Required */}
            <section className="documents-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{i18n.language === 'vi' ? 'Hồ Sơ Cần Thiết' : 'Documents Required'}</h2>
                    </div>
                    <div className="documents-grid">
                        <div className="document-card card">
                            <span className="doc-icon">📋</span>
                            <h4>{i18n.language === 'vi' ? 'Đơn Đăng Ký' : 'Application Form'}</h4>
                            <p>{i18n.language === 'vi' ? 'Hoàn thành đăng ký trực tuyến' : 'Complete online registration'}</p>
                        </div>
                        <div className="document-card card">
                            <span className="doc-icon">📄</span>
                            <h4>{i18n.language === 'vi' ? 'Học Bạ' : 'Transcripts'}</h4>
                            <p>{i18n.language === 'vi' ? 'Học bạ các năm học trước (bản dịch tiếng Anh)' : 'Previous school transcripts (English translation)'}</p>
                        </div>
                        <div className="document-card card">
                            <span className="doc-icon">🪪</span>
                            <h4>{i18n.language === 'vi' ? 'Giấy Tờ Tùy Thân' : 'ID Document'}</h4>
                            <p>{i18n.language === 'vi' ? 'Hộ chiếu hoặc giấy tờ tùy thân hợp lệ' : 'Passport or valid identification'}</p>
                        </div>
                        <div className="document-card card">
                            <span className="doc-icon">📝</span>
                            <h4>{i18n.language === 'vi' ? 'Đánh Giá Tiếng Anh' : 'English Assessment'}</h4>
                            <p>{i18n.language === 'vi' ? 'Đánh giá trình độ tiếng Anh (nếu cần)' : 'English proficiency assessment (if required)'}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="international-cta">
                <div className="container text-center">
                    <h2>{t('international.cta.title')}</h2>
                    <p>{t('international.cta.subtitle')}</p>
                    <div className="cta-buttons">
                        <Link to="/official-ontario" className="btn btn-accent btn-lg">{i18n.language === 'vi' ? 'Xem Khóa Học Có Tín Chỉ' : 'Browse Credit Courses'}</Link>
                        <Link to="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>{t('nav.contact')}</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default InternationalStudents
