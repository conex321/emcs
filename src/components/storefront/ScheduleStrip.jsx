import { useTranslation } from 'react-i18next'
import './ScheduleStrip.css'

function ScheduleStrip({ variant = 'default', showContinuous = true }) {
    const { t } = useTranslation()

    return (
        <div className={`schedule-strip schedule-strip--${variant}`}>
            <div className="schedule-strip__icon" aria-hidden="true">📅</div>
            <div className="schedule-strip__body">
                <div className="schedule-strip__primary">
                    {t('storefronts.schedule.standard', 'Schedule: September 5, 2026 to May 30, 2027 (39 instructional weeks)')}
                </div>
                {showContinuous && (
                    <div className="schedule-strip__secondary">
                        {t('storefronts.schedule.continuous', 'Continuous enrollment is also available — start any day of the year.')}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ScheduleStrip
