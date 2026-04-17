import { createContext, useContext, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import navigationConfig from '../config/navigation.json'

const StorefrontContext = createContext(null)

// Get storefront from path
function getStorefrontFromPath(pathname) {
    if (pathname.startsWith('/credit') || pathname.startsWith('/official-ontario')) return 'credit'
    if (pathname.startsWith('/non-credit') || pathname.startsWith('/academic-prep')) return 'non-credit'
    return null
}

export function StorefrontProvider({ children }) {
    const location = useLocation()
    const [activeStorefront, setActiveStorefront] = useState(null)

    // Determine storefront from URL
    const currentStorefront = useMemo(() => {
        const fromPath = getStorefrontFromPath(location.pathname)
        return fromPath || activeStorefront
    }, [location.pathname, activeStorefront])

    // Get storefront config
    const storefrontConfig = useMemo(() => {
        if (!currentStorefront) return null
        const key = currentStorefront === 'credit' ? 'credit' : 'nonCredit'
        return navigationConfig.navigation.storefronts[key]
    }, [currentStorefront])

    // Get available grades for current storefront
    const availableGrades = useMemo(() => {
        if (!storefrontConfig) return []
        return storefrontConfig.grades
    }, [storefrontConfig])

    // Get subjects
    const subjects = useMemo(() => {
        return navigationConfig.subjects.default
    }, [])

    // Get color scheme
    const colorScheme = useMemo(() => {
        if (!storefrontConfig) {
            return {
                primary: '#1B4332',
                secondary: '#2D6A4F',
                light: '#f0fdf4',
                text: '#ffffff'
            }
        }
        return storefrontConfig.color
    }, [storefrontConfig])

    const value = {
        currentStorefront,
        setActiveStorefront,
        storefrontConfig,
        availableGrades,
        subjects,
        colorScheme,
        isCredit: currentStorefront === 'credit',
        isNonCredit: currentStorefront === 'non-credit',
        navigationConfig: navigationConfig.navigation,
    }

    return (
        <StorefrontContext.Provider value={value}>
            {children}
        </StorefrontContext.Provider>
    )
}

export function useStorefront() {
    const context = useContext(StorefrontContext)
    if (!context) {
        throw new Error('useStorefront must be used within a StorefrontProvider')
    }
    return context
}

export default StorefrontContext
