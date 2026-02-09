/**
 * EMCS Pricing & Promotion Engine Configuration
 *
 * This module defines all pricing rules, discounts, bundles,
 * and commission structures for the EMCS platform.
 */

// =========================================
// GRADE-LEVEL PRICING CONFIGURATION
// =========================================

export const GRADE_LEVEL_PRICING = {
  '1-5': {
    registration: 50,
    entranceTest: 0,
    schedule: {
      start: 'September 5, 2026',
      end: 'May 30, 2027'
    },
    subjects: [
      'Mathematics',
      'Language',
      'The Arts',
      'Science & Technology',
      'Health & Physical Education',
      'Social Studies'
    ],
    academicPrep: {
      perCourse: 150,
      listPrice: 150,
      salePrice: 75,        // 50% off
      fullYear: 325,        // All 6 subjects
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: [
        'All learning materials',
        'Student and parent login credentials',
        '24/7 access to course content',
        'Learn at your own pace'
      ]
    },
    officialOntario: {
      perCourse: 250,
      fullYear: 600,        // All 6 subjects
      delivery: 'Live Classes with Ontario Certified Teachers',
      whatYouGet: [
        'Live classes with certified teachers',
        'All learning materials',
        'Required assessments and evaluations',
        'Official Ontario report card'
      ]
    }
  },
  '6-8': {
    registration: 50,
    entranceTest: 50,
    schedule: {
      start: 'September 5, 2026',
      end: 'May 30, 2027'
    },
    subjects: [
      'Mathematics',
      'Language',
      'The Arts',
      'Science & Technology',
      'Health & Physical Education',
      'Social Studies'
    ],
    academicPrep: {
      perCourse: 150,
      listPrice: 150,
      salePrice: 75,        // 50% off
      fullYear: 325,        // All 6 subjects
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: [
        'All learning materials',
        'Student and parent login credentials',
        '24/7 access to course content',
        'Learn at your own pace'
      ]
    },
    officialOntario: {
      perCourse: 250,
      fullYear: 600,        // All 6 subjects
      delivery: 'Live Classes with Ontario Certified Teachers',
      whatYouGet: [
        'Live classes with certified teachers',
        'All learning materials',
        'Required assessments and evaluations',
        'Official Ontario report card'
      ]
    }
  },
  '9-12': {
    registration: 100,
    entranceTest: 50,
    schedule: {
      start: 'September 5, 2026',
      end: 'May 30, 2027'
    },
    subjects: [
      'Mathematics',
      'English',
      'Science',
      'Social Sciences',
      'Business Studies',
      'The Arts',
      'French'
    ],
    academicPrep: {
      perCourse: 150,
      listPrice: 150,
      salePrice: 75,        // 50% off
      fullYear: null,        // Varies by number of courses chosen
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: [
        'All learning materials',
        'Student and parent login credentials',
        '24/7 access to course content',
        'Learn at your own pace'
      ]
    },
    officialOntario: {
      perCourse: 250,
      fullYear: 3500,        // 7-8 credit annual program
      delivery: 'Live Classes with Ontario Certified Teachers',
      whatYouGet: [
        'Live classes with certified teachers',
        'All learning materials',
        'Required assessments and evaluations',
        'Official Ontario report card',
        'OSSD credits toward graduation'
      ]
    }
  },

  // =========================================
  // PER-GRADE TIMETABLES (Grades 9-12)
  // =========================================

  '9': {
    registration: 100,
    entranceTest: 50,
    schedule: { start: 'September 5, 2026', end: 'May 30, 2027' },
    frenchNote: 'Students who have completed Grade 8 in their home country are not required to take French as a Second Language. An equivalent credit will be granted.',
    timetable: {
      academicPrep: {
        courses: [
          { code: 'ENG1D', name: 'English', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'MTH1W', name: 'Mathematics', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'SNC1W', name: 'Science', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'PPL1O', name: 'Health & Physical Education', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'AVI1O', name: 'Visual Arts', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'ICS1O', name: 'Exploring Computer Studies', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
        ],
        totalCredits: 6,
        totalListPrice: 1800,
        totalSalePrice: 900,
        discountPercent: 50,
        delivery: 'Self-Learning via LMS Platform',
      },
      officialOntario: {
        courses: [
          { code: 'ENG1D', name: 'English', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'MTH1W', name: 'Mathematics', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'SNC1W', name: 'Science', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'CGC1D', name: 'Issues in Canadian Geography', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'PPL1O', name: 'Health & Physical Education', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'AVI1O', name: 'Visual Arts', type: 'Compulsory (Arts)', credit: 1, price: 700 },
          { code: 'TEJ1O', name: 'Exploring Computer Technology', type: 'Elective', credit: 1, price: 700 },
          { code: 'BBI1O', name: 'Introduction to Business', type: 'Elective', credit: 1, price: 700 },
        ],
        totalCredits: 8,
        totalPrice: 5600,
        discountTuition: 4200,
        schedule: '6 hours / week / 3 days',
        delivery: 'Live Classes with Ontario Certified Teachers',
        discountNote: 'The discounted tuition fee is applicable only to the one-year (8-credit) program.',
      },
    },
    academicPrep: {
      perCourse: 300, listPrice: 300, salePrice: 150, fullYear: 900,
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: ['All learning materials', 'Student and parent login credentials', '24/7 access to course content', 'Learn at your own pace']
    },
    officialOntario: {
      perCourse: 700, fullYear: 4200,
      delivery: 'Live Classes with Ontario Certified Teachers',
      whatYouGet: ['Live classes with certified teachers', 'All learning materials', 'Required assessments and evaluations', 'Official Ontario report card', 'OSSD credits toward graduation']
    },
  },

  '10': {
    registration: 100,
    entranceTest: 50,
    schedule: { start: 'September 5, 2026', end: 'May 30, 2027' },
    frenchNote: 'Students who have completed Grade 9 in their home country are not required to take French as a Second Language. An equivalent credit will be granted.',
    timetable: {
      academicPrep: {
        courses: [
          { code: 'ENG2D', name: 'English', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'MPM2D', name: 'Principles of Mathematics', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'SNC2D', name: 'Science', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'CHC2D', name: 'Canadian History', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'AVI2O', name: 'Visual Arts', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'ICS2O', name: 'Introduction to Computer Studies', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
        ],
        totalCredits: 6,
        totalListPrice: 1800,
        totalSalePrice: 900,
        discountPercent: 50,
        delivery: 'Self-Learning via LMS Platform',
      },
      officialOntario: {
        courses: [
          { code: 'ENG2D', name: 'English', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'MPM2D', name: 'Principles of Mathematics', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'SNC2D', name: 'Science', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'CHC2D', name: 'Canadian History', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'CHV2O', name: 'Civics', type: 'Compulsory', credit: 0.5, price: 700 },
          { code: 'GLC2O', name: 'Career Studies', type: 'Compulsory', credit: 0.5, price: 700 },
          { code: 'TEJ2O', name: 'Computer Engineering Technology', type: 'Compulsory (Group 3)', credit: 1, price: 700 },
          { code: 'BBI2O', name: 'Introduction to Business', type: 'Elective', credit: 1, price: 700 },
        ],
        totalCredits: 8,
        totalPrice: 5600,
        discountTuition: 4200,
        schedule: '6 hours / week / 3 days',
        delivery: 'Live Classes with Ontario Certified Teachers',
        discountNote: 'The discounted tuition fee is applicable only to the one-year (8-credit) program.',
      },
    },
    academicPrep: {
      perCourse: 300, listPrice: 300, salePrice: 150, fullYear: 900,
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: ['All learning materials', 'Student and parent login credentials', '24/7 access to course content', 'Learn at your own pace']
    },
    officialOntario: {
      perCourse: 700, fullYear: 4200,
      delivery: 'Live Classes with Ontario Certified Teachers',
      whatYouGet: ['Live classes with certified teachers', 'All learning materials', 'Required assessments and evaluations', 'Official Ontario report card', 'OSSD credits toward graduation']
    },
  },

  '11': {
    registration: 100,
    entranceTest: 50,
    schedule: { start: 'September 5, 2026', end: 'May 30, 2027' },
    frenchNote: 'Students who have completed Grade 10 in their home country are not required to take French as a Second Language. An equivalent credit will be granted.',
    timetable: {
      academicPrep: {
        courses: [
          { code: 'ENG3U', name: 'English', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'MCR3U', name: 'Functions', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'SPH3U', name: 'Physics', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'ICS3U', name: 'Computer Science', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'BAF3M', name: 'Financial Accounting Fundamentals', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
        ],
        totalCredits: 5,
        totalListPrice: 1500,
        totalSalePrice: 750,
        discountPercent: 50,
        delivery: 'Self-Learning via LMS Platform',
      },
      officialOntario: {
        courses: [
          { code: 'ENG3U', name: 'English', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'MCR3U', name: 'Functions', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'HSP3U', name: 'Anthropology, Psychology & Sociology', type: 'Compulsory (Group 1)', credit: 1, price: 700 },
          { code: 'BAF3M', name: 'Financial Accounting Fundamentals', type: 'Compulsory (Group 2)', credit: 1, price: 700 },
          { code: 'SBI3U', name: 'Biology', type: 'Elective', credit: 1, price: 700 },
          { code: 'ICS3U', name: 'Computer Science', type: 'Elective', credit: 1, price: 700 },
          { code: 'SPH3U', name: 'Physics', type: 'Elective', credit: 1, price: 700 },
        ],
        totalCredits: 7,
        totalPrice: 4900,
        discountTuition: 3800,
        schedule: '6 hours / week / 3 days',
        delivery: 'Live Classes with Ontario Certified Teachers',
        discountNote: 'The discounted tuition fee is applicable only to the one-year (7-credit) program.',
      },
    },
    academicPrep: {
      perCourse: 300, listPrice: 300, salePrice: 150, fullYear: 750,
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: ['All learning materials', 'Student and parent login credentials', '24/7 access to course content', 'Learn at your own pace']
    },
    officialOntario: {
      perCourse: 700, fullYear: 3800,
      delivery: 'Live Classes with Ontario Certified Teachers',
      whatYouGet: ['Live classes with certified teachers', 'All learning materials', 'Required assessments and evaluations', 'Official Ontario report card', 'OSSD credits toward graduation']
    },
  },

  '12': {
    registration: 100,
    entranceTest: 50,
    schedule: { start: 'September 5, 2026', end: 'May 30, 2027' },
    frenchNote: 'Students who have completed Grade 10 in their home country are not required to take French as a Second Language. An equivalent credit will be granted.',
    notes: ['MCV4U will be taken after MHF4U is completed.'],
    timetable: {
      academicPrep: {
        courses: [
          { code: 'ENG4U', name: 'English', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'MHF4U', name: 'Advanced Functions', type: 'Compulsory', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'MCV4U', name: 'Calculus and Vectors', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'ICS4U', name: 'Computer Science', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
          { code: 'BBB4M', name: 'International Business Fundamentals', type: 'Elective', credit: 1, listPrice: 300, salePrice: 150 },
        ],
        totalCredits: 5,
        totalListPrice: 1500,
        totalSalePrice: 750,
        discountPercent: 50,
        delivery: 'Self-Learning via LMS Platform',
      },
      officialOntario: {
        courses: [
          { code: 'ENG4U', name: 'English', type: 'Compulsory', credit: 1, price: 700 },
          { code: 'MHF4U', name: 'Advanced Functions', type: 'Elective', credit: 1, price: 700 },
          { code: 'MCV4U', name: 'Calculus and Vectors', type: 'Elective', credit: 1, price: 700 },
          { code: 'ICS4U', name: 'Computer Science', type: 'Elective', credit: 1, price: 700 },
          { code: 'BBB4M', name: 'International Business Fundamentals', type: 'Elective', credit: 1, price: 700 },
          { code: 'SCH4U', name: 'Chemistry', type: 'Elective', credit: 1, price: 700 },
          { code: 'BOH4M', name: 'Business Leadership', type: 'Elective', credit: 1, price: 700 },
        ],
        totalCredits: 7,
        totalPrice: 4900,
        discountTuition: 3800,
        schedule: '6 hours / week / 3 days',
        delivery: 'Live Classes with Ontario Certified Teachers',
        discountNote: 'The discounted tuition fee is applicable only to the one-year (7-credit) program.',
      },
    },
    academicPrep: {
      perCourse: 300, listPrice: 300, salePrice: 150, fullYear: 750,
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: ['All learning materials', 'Student and parent login credentials', '24/7 access to course content', 'Learn at your own pace']
    },
    officialOntario: {
      perCourse: 700, fullYear: 3800,
      delivery: 'Live Classes with Ontario Certified Teachers',
      whatYouGet: ['Live classes with certified teachers', 'All learning materials', 'Required assessments and evaluations', 'Official Ontario report card', 'OSSD credits toward graduation']
    },
  },
};

// Helper function to get pricing for a specific grade
export function getPricingForGrade(grade) {
  const gradeNum = parseInt(grade, 10);
  // Check for per-grade entry first (Grades 9-12 have individual timetables)
  if (GRADE_LEVEL_PRICING[String(gradeNum)]) {
    return GRADE_LEVEL_PRICING[String(gradeNum)];
  }
  if (gradeNum >= 1 && gradeNum <= 5) return GRADE_LEVEL_PRICING['1-5'];
  if (gradeNum >= 6 && gradeNum <= 8) return GRADE_LEVEL_PRICING['6-8'];
  if (gradeNum >= 9 && gradeNum <= 12) return GRADE_LEVEL_PRICING['9-12'];
  return null;
}

// Helper to check if a grade is high school (has timetable data)
export function isHighSchool(grade) {
  return parseInt(grade, 10) >= 9;
}

// =========================================
// PRICING CONFIGURATION (Legacy - maintain for backward compatibility)
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
  GRADE_LEVEL_PRICING,
  getPricingForGrade,
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
