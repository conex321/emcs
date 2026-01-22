/**
 * EMCS Pricing & Promotion Engine Configuration
 *
 * This module defines all pricing rules, discounts, bundles,
 * and commission structures for the EMCS platform.
 */

// =========================================
// PRICING CONFIGURATION
// =========================================

export const PRICING_CONFIG = {
  nonCredit: {
    minPrice: 100,
    maxPrice: 150,
    listPriceMultiplier: 2.5, // Show $250 list, actual $100
    bundleDiscount: 0.20,     // 20% off for complete grade bundle
    currency: 'CAD',
  },
  credit: {
    basePrice: 3000,
    minPrice: 1200,           // After max discount
    maxPrice: 3000,
    bundleDiscount: 0.15,     // 15% off for full year bundle
    currency: 'CAD',
  },
  upgrade: {
    nonCreditToCredit: {
      minFee: 300,
      maxFee: 500,
      defaultFee: 350,
    }
  }
};

// =========================================
// COUPON CONFIGURATION
// =========================================

export const COUPON_CONFIG = {
  maxDiscountPercent: 60,
  minDiscountPercent: 10,
  allowStacking: false,
  agentCodePrefix: 'AGENT-',
  promoCodePrefix: 'PROMO-',
  couponTypes: {
    PERCENT: 'PERCENT',
    FIXED: 'FIXED',
  },
};

// =========================================
// AGENT COMMISSION CONFIGURATION
// =========================================

export const AGENT_CONFIG = {
  creditCommission: 52,       // $52 per credit student
  nonCreditCommission: 10,    // $10 per non-credit student
  commissionCurrency: 'CAD',
  payoutThreshold: 100,       // Minimum payout amount
  payoutSchedule: 'MONTHLY',
};

// =========================================
// PRODUCT TYPE DEFINITIONS
// =========================================

export const PRODUCT_TYPES = {
  CREDIT_COURSE: {
    type: 'CREDIT_COURSE',
    storefront: 'credit',
    includes: [
      'liveClasses',
      'zoomSessions',
      'certifiedTeacher',
      'assignments',
      'tests',
      'finalExam',
      'reportCard',
      'ossdCredit',
    ],
    excludes: [],
    requiredDisclaimer: null,
  },
  NON_CREDIT_COURSE: {
    type: 'NON_CREDIT_COURSE',
    storefront: 'non-credit',
    includes: [
      'videoLessons',
      'homeworkPractice',
      'interactiveActivities',
    ],
    excludes: [
      'tests',
      'assessments',
      'reportCard',
      'ossdCredit',
      'liveClasses',
    ],
    requiredDisclaimer: 'This is a non-credit course. No tests, no assessments, no report card, no OSSD credit.',
  },
};

// =========================================
// PRICING FUNCTIONS
// =========================================

/**
 * Determine product type based on course storefront
 */
export function determineProductType(course) {
  return course.storefront === 'credit'
    ? PRODUCT_TYPES.CREDIT_COURSE
    : PRODUCT_TYPES.NON_CREDIT_COURSE;
}

/**
 * Calculate bundle price for a complete grade program
 */
export function calculateGradeBundlePrice(grade, storefront, courses) {
  const gradeCourses = courses.filter(c =>
    c.grade === grade && c.storefront === storefront
  );

  const individualTotal = gradeCourses.reduce((sum, c) =>
    sum + (c.product?.pricing?.listPrice || 0), 0
  );

  const discountRate = storefront === 'credit'
    ? PRICING_CONFIG.credit.bundleDiscount
    : PRICING_CONFIG.nonCredit.bundleDiscount;

  return {
    bundlePrice: individualTotal * (1 - discountRate),
    savings: individualTotal * discountRate,
    savingsPercent: Math.round(discountRate * 100),
    courses: gradeCourses,
    displayText: `Save ${Math.round(discountRate * 100)}% with Complete Grade ${grade} Program`,
  };
}

/**
 * Apply credit bundle rules (auto-include related non-credit)
 */
export function applyCreditBundleRules(cartItem, cart, findRelatedNonCredit) {
  if (cartItem.type !== 'CREDIT_COURSE') return cartItem;

  const relatedNonCredit = findRelatedNonCredit(cartItem);

  if (relatedNonCredit && !cart.items.some(i => i.id === relatedNonCredit.id)) {
    return {
      ...cartItem,
      bundledItems: [
        {
          ...relatedNonCredit,
          price: 0,
          originalPrice: relatedNonCredit.product?.pricing?.listPrice || 0,
          bundleReason: 'FREE with credit course purchase',
          displayAs: 'BONUS_INCLUDED',
        }
      ],
    };
  }

  return cartItem;
}

/**
 * Calculate upgrade path from non-credit to credit
 */
export function calculateUpgradePath(nonCreditCourse, creditEquivalent, userHasPurchased) {
  if (!creditEquivalent) {
    return {
      available: false,
      reason: 'No credit equivalent available for this course',
    };
  }

  if (userHasPurchased) {
    const upgradeFee = PRICING_CONFIG.upgrade.nonCreditToCredit.defaultFee;

    return {
      available: true,
      upgradeFee: upgradeFee,
      creditCoursePrice: creditEquivalent.product?.pricing?.listPrice || 3000,
      totalToPay: upgradeFee,
      savings: nonCreditCourse.pricePaid || nonCreditCourse.product?.pricing?.basePrice || 100,
      creditCourse: creditEquivalent,
      displayText: `Upgrade to Credit for just $${upgradeFee}`,
    };
  }

  return {
    available: true,
    upgradeFee: 0,
    creditCoursePrice: creditEquivalent.product?.pricing?.listPrice || 3000,
    totalToPay: creditEquivalent.product?.pricing?.listPrice || 3000,
    savings: 0,
    creditCourse: creditEquivalent,
    displayText: 'Enroll in Credit Course',
  };
}

/**
 * Validate coupon code
 */
export function validateCoupon(coupon, cart, user) {
  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, error: 'Coupon has expired' };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, error: 'Coupon usage limit reached' };
  }

  if (coupon.minCartValue && cart.subtotal < coupon.minCartValue) {
    return {
      valid: false,
      error: `Minimum order of $${coupon.minCartValue} required`
    };
  }

  if (coupon.restrictToStorefront &&
      !cart.items.some(i => i.storefront === coupon.restrictToStorefront)) {
    return {
      valid: false,
      error: `Coupon only valid for ${coupon.restrictToStorefront} courses`
    };
  }

  return { valid: true, coupon };
}

/**
 * Apply coupon to cart
 */
export function applyCoupon(coupon, cart) {
  const validation = validateCoupon(coupon, cart);

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  let discount = 0;

  if (coupon.type === COUPON_CONFIG.couponTypes.PERCENT) {
    const effectivePercent = Math.min(
      coupon.value,
      COUPON_CONFIG.maxDiscountPercent
    );
    discount = cart.subtotal * (effectivePercent / 100);
  } else if (coupon.type === COUPON_CONFIG.couponTypes.FIXED) {
    discount = Math.min(coupon.value, cart.subtotal * 0.6);
  }

  return {
    success: true,
    cart: {
      ...cart,
      appliedCoupon: coupon,
      discount: discount,
      total: cart.subtotal - discount,
    },
    displayText: `${coupon.code}: -$${discount.toFixed(2)} (${coupon.description || 'Discount applied'})`,
  };
}

/**
 * Calculate agent commission for an order
 */
export function calculateAgentCommission(order, agentId) {
  if (!agentId) {
    return null;
  }

  let totalCommission = 0;
  const commissionItems = [];

  for (const item of order.items) {
    const commission = item.storefront === 'credit'
      ? AGENT_CONFIG.creditCommission
      : AGENT_CONFIG.nonCreditCommission;

    totalCommission += commission;
    commissionItems.push({
      courseId: item.id,
      courseName: item.title,
      storefront: item.storefront,
      commission: commission,
    });
  }

  return {
    agentId: agentId,
    orderId: order.id,
    studentId: order.userId,
    totalCommission: totalCommission,
    currency: AGENT_CONFIG.commissionCurrency,
    items: commissionItems,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Format price for display
 */
export function formatPriceDisplay(course, appliedDiscount = null) {
  const pricing = course.product?.pricing || {};

  const listing = {
    listPrice: pricing.listPrice || 0,
    basePrice: pricing.basePrice || pricing.listPrice || 0,
    currency: pricing.currency || 'CAD',
    showListPrice: true,
  };

  if (appliedDiscount) {
    listing.discountedPrice = listing.listPrice - appliedDiscount.amount;
    listing.savings = appliedDiscount.amount;
    listing.savingsPercent = Math.round(
      (appliedDiscount.amount / listing.listPrice) * 100
    );
    listing.discountLabel = appliedDiscount.label;
  }

  if (course.storefront === 'non-credit') {
    listing.displayFormat = 'STRIKETHROUGH';
    listing.priceNote = 'Limited time offer';
    listing.showListPrice = listing.listPrice !== listing.basePrice;
  } else {
    listing.displayFormat = 'STANDARD';
    listing.priceNote = 'Live online with certified teacher';
  }

  return listing;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount, currency = 'CAD') {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// =========================================
// SCHOOL MEMBERSHIP (FUTURE)
// =========================================

export const SCHOOL_MEMBERSHIP_CONFIG = {
  annualPrice: 1000,
  perStudentPrice: null,
  grades: ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  storefront: 'non-credit',
  features: [
    'Unlimited student accounts',
    'Full K-12 practice access',
    'School admin dashboard',
    'Progress reporting',
    'Teacher tools',
  ],
  parentUpcharge: {
    available: true,
    price: 50,
    description: 'Parent access to track student progress at home',
  },
  status: 'FEATURE_DEFERRED',
  targetRelease: '2025-Q2',
};

export default {
  PRICING_CONFIG,
  COUPON_CONFIG,
  AGENT_CONFIG,
  PRODUCT_TYPES,
  SCHOOL_MEMBERSHIP_CONFIG,
  determineProductType,
  calculateGradeBundlePrice,
  applyCreditBundleRules,
  calculateUpgradePath,
  validateCoupon,
  applyCoupon,
  calculateAgentCommission,
  formatPriceDisplay,
  formatCurrency,
};
