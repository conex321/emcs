import { createContext, useContext, useReducer, useEffect } from 'react'
import { PRICING_CONFIG, applyCoupon as applyCouponLogic, calculateAgentCommission } from '../config/pricing'

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
        if (appliedCoupon.type === 'PERCENT') {
            const effectivePercent = Math.min(appliedCoupon.value, 60)
            discount = subtotal * (effectivePercent / 100)
        } else if (appliedCoupon.type === 'FIXED') {
            discount = Math.min(appliedCoupon.value, subtotal * 0.6)
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
    }, [])

    // Save cart to localStorage on changes
    useEffect(() => {
        localStorage.setItem('emcs-cart', JSON.stringify(state))
    }, [state])

    // Actions
    const addItem = (item, allCourses = []) => {
        dispatch({ type: ACTIONS.ADD_ITEM, payload: { item, allCourses } })
    }

    const removeItem = (itemId) => {
        dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { itemId } })
    }

    const applyCoupon = (couponCode) => {
        // Mock coupon validation - in production this would call an API
        const mockCoupons = {
            'PROMO-SAVE50': { code: 'PROMO-SAVE50', type: 'PERCENT', value: 50, description: '50% off' },
            'PROMO-SAVE40': { code: 'PROMO-SAVE40', type: 'PERCENT', value: 40, description: '40% off' },
            'AGENT-SMITH50': { code: 'AGENT-SMITH50', type: 'PERCENT', value: 50, description: 'Agent discount 50%' },
            'AGENT-DEMO60': { code: 'AGENT-DEMO60', type: 'PERCENT', value: 60, description: 'Agent discount 60%' },
            'WELCOME100': { code: 'WELCOME100', type: 'FIXED', value: 100, description: '$100 off' },
        }

        const coupon = mockCoupons[couponCode.toUpperCase()]
        if (!coupon) {
            return { success: false, error: 'Invalid coupon code' }
        }

        dispatch({ type: ACTIONS.APPLY_COUPON, payload: { coupon } })
        return { success: true, coupon }
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
