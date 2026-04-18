import { createContext, useContext, useReducer, useState, useEffect } from 'react'
import supabase from '../services/supabaseClient'

// Initial state
const initialState = {
    items: [],
    appliedCoupon: null,
    agentCode: null,
    subtotal: 0,
    discount: 0,
    total: 0,
}

// Action types
const ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    APPLY_COUPON: 'APPLY_COUPON',
    REMOVE_COUPON: 'REMOVE_COUPON',
    CLEAR_CART: 'CLEAR_CART',
    LOAD_CART: 'LOAD_CART',
}

// Find related non-credit course for bundling
function findRelatedNonCredit(creditCourse, allCourses) {
    // Match by grade and subject
    return allCourses.find(c =>
        c.storefront === 'non-credit' &&
        c.grade === creditCourse.grade &&
        c.subject === creditCourse.subject
    )
}

// Calculate totals
function calculateTotals(items, appliedCoupon) {
    const subtotal = items.reduce((sum, item) => {
        if (item.isBundled) return sum // Don't count bundled items
        return sum + (item.price || 0)
    }, 0)

    let discount = 0
    if (appliedCoupon) {
        const couponType = String(appliedCoupon.type || '').toLowerCase()

        if (couponType === 'percent' || couponType === 'percentage' || couponType === 'percent_off' || appliedCoupon.type === 'PERCENT') {
            const effectivePercent = Math.min(
                Number(appliedCoupon.value) || 0,
                Number(appliedCoupon.max_discount) || 60
            )
            discount = subtotal * (effectivePercent / 100)
        } else if (couponType === 'fixed' || appliedCoupon.type === 'FIXED') {
            discount = Math.min(Number(appliedCoupon.value) || 0, subtotal * 0.6)
        }
    }

    return {
        subtotal,
        discount,
        total: subtotal - discount,
    }
}

// Reducer
function cartReducer(state, action) {
    switch (action.type) {
        case ACTIONS.ADD_ITEM: {
            const { item, allCourses } = action.payload

            // Check if already in cart
            if (state.items.find(i => i.id === item.id)) {
                return state
            }

            let newItems = [...state.items, item]

            // If credit course, auto-add related non-credit as bundle
            if (item.storefront === 'credit' && allCourses) {
                const relatedNonCredit = findRelatedNonCredit(item, allCourses)
                if (relatedNonCredit && !state.items.find(i => i.id === relatedNonCredit.id)) {
                    newItems.push({
                        ...relatedNonCredit,
                        price: 0,
                        originalPrice: relatedNonCredit.product?.pricing?.listPrice || 0,
                        isBundled: true,
                        bundledWith: item.id,
                        bundleReason: 'FREE with credit course purchase',
                    })
                }
            }

            const totals = calculateTotals(newItems, state.appliedCoupon)
            return { ...state, items: newItems, ...totals }
        }

        case ACTIONS.REMOVE_ITEM: {
            const { itemId } = action.payload
            const itemToRemove = state.items.find(i => i.id === itemId)

            // Don't allow removing bundled items directly
            if (itemToRemove?.isBundled) {
                return state
            }

            // Remove item and any bundled items
            let newItems = state.items.filter(i =>
                i.id !== itemId && i.bundledWith !== itemId
            )

            const totals = calculateTotals(newItems, state.appliedCoupon)
            return { ...state, items: newItems, ...totals }
        }

        case ACTIONS.APPLY_COUPON: {
            const { coupon } = action.payload
            const totals = calculateTotals(state.items, coupon)

            // Extract agent code if applicable
            let agentCode = state.agentCode
            if (coupon.code?.startsWith('AGENT-')) {
                agentCode = coupon.code.replace('AGENT-', '')
            }

            return {
                ...state,
                appliedCoupon: coupon,
                agentCode,
                ...totals
            }
        }

        case ACTIONS.REMOVE_COUPON: {
            const totals = calculateTotals(state.items, null)
            return {
                ...state,
                appliedCoupon: null,
                agentCode: null,
                ...totals
            }
        }

        case ACTIONS.CLEAR_CART: {
            return initialState
        }

        case ACTIONS.LOAD_CART: {
            return action.payload
        }

        default:
            return state
    }
}

// Create context
const CartContext = createContext(null)

// Provider component
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('emcs-cart')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                dispatch({ type: ACTIONS.LOAD_CART, payload: parsed })
            } catch (e) {
                console.error('Failed to load cart:', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage on changes — only after initial load
    useEffect(() => {
        if (!isLoaded) return
        localStorage.setItem('emcs-cart', JSON.stringify(state))
    }, [state, isLoaded])

    // Actions
    const addItem = (item, allCourses = []) => {
        dispatch({ type: ACTIONS.ADD_ITEM, payload: { item, allCourses } })
    }

    const removeItem = (itemId) => {
        dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { itemId } })
    }

    const applyCoupon = async (couponCode) => {
        const normalizedCode = couponCode.trim().toUpperCase()

        if (!normalizedCode) {
            return { success: false, error: 'Invalid coupon code' }
        }

        try {
            const { data: coupon, error } = await supabase
                .from('coupons')
                .select(`
                    code,
                    type,
                    value,
                    description,
                    max_discount,
                    max_uses,
                    use_count,
                    expires_at,
                    starts_at,
                    is_active,
                    agent_id
                `)
                .eq('code', normalizedCode)
                .eq('is_active', true)
                .maybeSingle()

            if (error) {
                throw error
            }

            if (!coupon) {
                return { success: false, error: 'Invalid coupon code' }
            }

            if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
                return { success: false, error: 'Coupon is not active yet' }
            }

            if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
                return { success: false, error: 'Coupon has expired' }
            }

            if (coupon.max_uses && coupon.use_count >= coupon.max_uses) {
                return { success: false, error: 'Coupon usage limit reached' }
            }

            dispatch({
                type: ACTIONS.APPLY_COUPON,
                payload: {
                    coupon: {
                        ...coupon,
                        description: coupon.description || 'Discount applied',
                    },
                },
            })

            return {
                success: true,
                coupon: {
                    ...coupon,
                    description: coupon.description || 'Discount applied',
                },
            }
        } catch (error) {
            console.error('Coupon lookup failed:', error)
            return {
                success: false,
                error: 'Coupon verification is unavailable right now. Please try again later.',
            }
        }
    }

    const removeCoupon = () => {
        dispatch({ type: ACTIONS.REMOVE_COUPON })
    }

    const clearCart = () => {
        dispatch({ type: ACTIONS.CLEAR_CART })
    }

    const getItemCount = () => {
        return state.items.filter(i => !i.isBundled).length
    }

    const value = {
        ...state,
        addItem,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
        getItemCount,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

// Hook to use cart
export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export default CartContext
