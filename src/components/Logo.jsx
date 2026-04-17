import './Logo.css'

const PRIMARY = '#1B4332'
const GOLD = '#D4AF37'
const FONT_STACK = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

function Logo({ variant = 'full', className = '' }) {
    if (variant === 'mark') {
        return (
            <svg
                className={`logo-svg logo-svg-mark ${className}`}
                viewBox="0 0 64 64"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="EMCS"
            >
                <rect width="64" height="64" rx="12" fill={PRIMARY} />
                <text
                    x="32"
                    y="40"
                    textAnchor="middle"
                    fontFamily={FONT_STACK}
                    fontWeight="700"
                    fontSize="22"
                    letterSpacing="1.5"
                    fill="#FFFFFF"
                >EMCS</text>
                <line x1="18" y1="48" x2="46" y2="48" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        )
    }

    return (
        <svg
            className={`logo-svg logo-svg-full ${className}`}
            viewBox="0 0 140 40"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="EMCS"
        >
            <text
                x="0"
                y="28"
                fontFamily={FONT_STACK}
                fontWeight="700"
                fontSize="28"
                letterSpacing="2.5"
                fill={PRIMARY}
            >EMCS</text>
            <line x1="1" y1="37" x2="34" y2="37" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}

export default Logo
