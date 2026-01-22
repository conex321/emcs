import { useTranslation } from 'react-i18next'

export const useFeatureTransition = () => {
  const { t } = useTranslation()

  const features = [
    {
      id: 'browsing',
      title: t('home.lms3d.browsing.title'),
      description: t('home.lms3d.browsing.desc'),
      cameraPosition: [0, 0.5, 5],
      highlightColor: '#AA0304',
      icon: '📚'
    },
    {
      id: 'learning',
      title: t('home.lms3d.learning.title'),
      description: t('home.lms3d.learning.desc'),
      cameraPosition: [0.5, 0.3, 4.5],
      highlightColor: '#1976d2',
      icon: '🎓'
    },
    {
      id: 'progress',
      title: t('home.lms3d.progress.title'),
      description: t('home.lms3d.progress.desc'),
      cameraPosition: [-0.5, 0.5, 5],
      highlightColor: '#AA0304',
      icon: '📈'
    },
    {
      id: 'support',
      title: t('home.lms3d.support.title'),
      description: t('home.lms3d.support.desc'),
      cameraPosition: [0, 0.2, 4.8],
      highlightColor: '#9c27b0',
      icon: '💬'
    }
  ]

  return { features }
}
