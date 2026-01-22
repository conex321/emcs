import { useTranslation } from 'react-i18next'
import './LanguageToggle.css'

function LanguageToggle() {
    const { i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en'
        i18n.changeLanguage(newLang)
    }

    return (
        <button className="language-toggle" onClick={toggleLanguage} aria-label="Toggle language">
            <span className={`lang-option ${i18n.language === 'en' ? 'active' : ''}`}>EN</span>
            <span className="lang-divider">/</span>
            <span className={`lang-option ${i18n.language === 'vi' ? 'active' : ''}`}>VI</span>
        </button>
    )
}

export default LanguageToggle
