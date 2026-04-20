/**
 * EMCS Pricing & Promotion Engine Configuration
 *
 * Pricing model (revamped April 2026):
 *
 *   NON-ACADEMIC ONTARIO RECORD (all grades 1-12)
 *     - $50 per course, $300 for 6-course bundle
 *
 *   UPGRADE TO ONTARIO RECORD (all grades 1-12)
 *     - +$350 per course on top of the $50 already paid  (total $400/course)
 *     - $1,800 for 6-course bundle upgrade
 *
 *   ACADEMIC ONTARIO RECORD (credit-bearing)
 *     - G1-8 self-paced:  $350/course, $1,800 for 6
 *     - G9-12 self-paced: $400/course, $1,800 for 6
 *     - Live teacher:     $4,500 / year (6 courses) — all bands
 *     - G9-12 single-credit standalone (cart has exactly 1): $450
 *
 * Backward-compat aliases:
 *   The legacy `academicPrep.*` and `officialOntario.*` fields are preserved
 *   as aliases of the new fields so existing callers (GradeGroupPanel,
 *   HighSchoolTimetable, SubjectCardGrid, Tuition, GradePage, etc.) keep
 *   working. They are marked @deprecated and will be removed once every
 *   call site migrates to the canonical names.
 */

// =========================================
// GRADE-LEVEL PRICING CONFIGURATION
// =========================================

const SCHEDULE = { start: 'September 5, 2026', end: 'May 30, 2027' };
const ELEM_MID_SUBJECTS = [
  'Mathematics',
  'Language',
  'The Arts',
  'Science & Technology',
  'Health & Physical Education',
  'Social Studies',
];
const HIGH_SUBJECTS = [
  'Mathematics',
  'English',
  'Science',
  'Social Sciences',
  'Business Studies',
  'The Arts',
  'French',
];

// Shared new-model pricing shared across all grade bands
const NON_ACADEMIC = { perCourse: 50, bundle6: 300 };
const UPGRADE_TO_ONTARIO = {
  addOnPerCourse: 350,          // the delta paid on top of Non-Academic
  totalPerCourse: 400,          // $50 + $350 for display
  bundle6: 1800,
};
const LIVE_TEACHER = { annual: 4500, courses: 6, perCourseShare: 750 };

// Non-Academic learning-outcome blurbs (unchanged)
const NON_ACADEMIC_WHAT_YOU_GET = [
  'All learning materials',
  'Student and parent login credentials',
  '24/7 access to course content',
  'Learn at your own pace',
];
const OFFICIAL_WHAT_YOU_GET_ELEM = [
  'Live classes with certified teachers',
  'All learning materials',
  'Required assessments and evaluations',
  'Official Ontario report card',
];
const OFFICIAL_WHAT_YOU_GET_HIGH = [
  'Live classes with certified teachers',
  'All learning materials',
  'Required assessments and evaluations',
  'Official Ontario report card',
  'OSSD credits toward graduation',
];

/**
 * Build a grade-band config with both the new canonical shape and
 * the legacy aliases for backward compatibility.
 */
function buildBand({
  registration,
  entranceTest,
  subjects,
  selfPacedPerCourse,     // $350 for G1-8, $400 for G9-12
  selfPacedBundle6,       // $1,800 across all bands
  singleCreditStandalone, // $450 for G9-12, null otherwise
  officialWhatYouGet,
  // optional overrides
  fullYearFallback = null,
  notes,
  frenchNote,
}) {
  const band = {
    registration,
    entranceTest,
    schedule: SCHEDULE,
    subjects,
    notes,
    frenchNote,

    // ---- New canonical pricing ----
    nonAcademicOntarioRecord: {
      ...NON_ACADEMIC,
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: NON_ACADEMIC_WHAT_YOU_GET,
    },
    upgradeToOntarioRecord: {
      ...UPGRADE_TO_ONTARIO,
      delivery: 'Upgrade existing Non-Academic course to credit-bearing Ontario Record',
    },
    academicOntarioRecord: {
      selfPaced: {
        perCourse: selfPacedPerCourse,
        bundle6: selfPacedBundle6,
        ...(singleCreditStandalone ? { singleCreditStandalone } : {}),
        delivery: 'Self-Learning via LMS Platform (credit-bearing, Ontario Record)',
        whatYouGet: officialWhatYouGet,
      },
      liveTeacher: {
        ...LIVE_TEACHER,
        delivery: 'Live Classes with Ontario Certified Teachers',
        whatYouGet: officialWhatYouGet,
      },
    },

    // ---- Legacy aliases (deprecated — do not use in new code) ----
    // @deprecated use nonAcademicOntarioRecord.perCourse
    academicPrep: {
      perCourse: NON_ACADEMIC.perCourse,
      listPrice: NON_ACADEMIC.perCourse,     // no list/sale distinction anymore
      salePrice: NON_ACADEMIC.perCourse,     // list === sale in new model
      fullYear: fullYearFallback !== null ? fullYearFallback : NON_ACADEMIC.bundle6,
      delivery: 'Self-Learning via LMS Platform',
      whatYouGet: NON_ACADEMIC_WHAT_YOU_GET,
    },
    // @deprecated use academicOntarioRecord.selfPaced.*
    officialOntario: {
      perCourse: selfPacedPerCourse,
      fullYear: selfPacedBundle6,
      delivery: 'Self-Learning via LMS Platform (credit-bearing, Ontario Record)',
      whatYouGet: officialWhatYouGet,
    },
  };
  return band;
}

/**
 * Build a per-grade timetable for Grades 9-12.
 * Per-course prices: $50 non-academic, $400 official self-paced (both uniform across G9-12).
 * Half-credits priced proportionally.
 */
function buildTimetable({ courses, gradeLabel }) {
  const buildAcademicPrepRow = (c) => {
    const credit = c.credit ?? 1;
    const price = credit === 1 ? 50 : Math.round(50 * credit);
    return { ...c, listPrice: price, salePrice: price };
  };
  const buildOfficialRow = (c) => {
    const credit = c.credit ?? 1;
    const price = credit === 1 ? 400 : Math.round(400 * credit);
    return { ...c, price };
  };
  const apRows = courses.map(buildAcademicPrepRow);
  const ooRows = courses.map(buildOfficialRow);
  const totalCredits = courses.reduce((s, c) => s + (c.credit ?? 1), 0);
  const totalListPrice = apRows.reduce((s, r) => s + r.listPrice, 0);
  const totalOfficialPrice = ooRows.reduce((s, r) => s + r.price, 0);

  return {
    academicPrep: {
      courses: apRows,
      totalCredits,
      totalListPrice,
      totalSalePrice: totalListPrice,   // list === sale in new model
      discountPercent: 0,
      delivery: 'Self-Learning via LMS Platform',
      bundle6Price: 300,                 // if student buys full 6-course Non-Academic bundle
    },
    officialOntario: {
      courses: ooRows,
      totalCredits,
      totalPrice: totalOfficialPrice,
      discountTuition: 1800,             // 6-course bundle price (Academic Ontario Record self-paced)
      liveTeacherAnnual: 4500,
      singleCreditStandalone: 450,
      schedule: '6 hours / week / 3 days',
      delivery: 'Live Classes with Ontario Certified Teachers',
      discountNote: `Bundle tuition ($1,800) applies to any 6-course combination. Single-credit standalone is $450. Live-teacher pathway is $4,500/year for the full 6-course ${gradeLabel} program.`,
    },
  };
}

export const GRADE_LEVEL_PRICING = {
  '1-5': buildBand({
    registration: 50,
    entranceTest: 0,
    subjects: ELEM_MID_SUBJECTS,
    selfPacedPerCourse: 350,
    selfPacedBundle6: 1800,
    singleCreditStandalone: null,
    officialWhatYouGet: OFFICIAL_WHAT_YOU_GET_ELEM,
  }),
  '6-8': buildBand({
    registration: 50,
    entranceTest: 50,
    subjects: ELEM_MID_SUBJECTS,
    selfPacedPerCourse: 350,
    selfPacedBundle6: 1800,
    singleCreditStandalone: null,
    officialWhatYouGet: OFFICIAL_WHAT_YOU_GET_ELEM,
  }),
  '9-12': buildBand({
    registration: 100,
    entranceTest: 50,
    subjects: HIGH_SUBJECTS,
    selfPacedPerCourse: 400,
    selfPacedBundle6: 1800,
    singleCreditStandalone: 450,
    officialWhatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH,
    fullYearFallback: 300,   // Non-Academic bundle6 for high-school grade pages
  }),

  // =========================================
  // PER-GRADE TIMETABLES (Grades 9-12)
  // =========================================

  '9': {
    registration: 100,
    entranceTest: 50,
    schedule: SCHEDULE,
    frenchNote: 'Students who have completed Grade 8 in their home country are not required to take French as a Second Language. An equivalent credit will be granted.',
    timetable: buildTimetable({
      gradeLabel: 'Grade 9',
      courses: [
        { code: 'ENG1D', name: 'English, Grade 9 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'MTH1W', name: 'Mathematics, Grade 9 (De-streamed)', type: 'Compulsory', credit: 1 },
        { code: 'SNC1W', name: 'Science, Grade 9 (De-streamed)', type: 'Compulsory', credit: 1 },
        { code: 'CGC1D', name: 'Issues in Canadian Geography, Grade 9 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'FSF1D', name: 'Core French, Grade 9 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'PPL1O', name: 'Healthy Active Living Education, Grade 9 (Open)', type: 'Compulsory', credit: 1 },
        { code: 'AVI1O', name: 'Visual Arts, Grade 9 (Open)', type: 'Compulsory', credit: 1 },
        { code: 'BTT1O', name: 'Information and Communication Technology in Business, Grade 9 (Open)', type: 'Optional', credit: 1 },
      ],
    }),
    subjects: ELEM_MID_SUBJECTS,
    nonAcademicOntarioRecord: { ...NON_ACADEMIC, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    upgradeToOntarioRecord: { ...UPGRADE_TO_ONTARIO, delivery: 'Upgrade existing Non-Academic course to credit-bearing Ontario Record' },
    academicOntarioRecord: {
      selfPaced: { perCourse: 400, bundle6: 1800, singleCreditStandalone: 450, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
      liveTeacher: { ...LIVE_TEACHER, delivery: 'Live Classes with Ontario Certified Teachers', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
    },
    // Legacy aliases
    academicPrep: { perCourse: 50, listPrice: 50, salePrice: 50, fullYear: 300, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    officialOntario: { perCourse: 400, fullYear: 1800, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
  },

  '10': {
    registration: 100,
    entranceTest: 50,
    schedule: SCHEDULE,
    frenchNote: 'Students who have completed Grade 9 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted.',
    timetable: buildTimetable({
      gradeLabel: 'Grade 10',
      courses: [
        { code: 'ENG2D', name: 'English, Grade 10 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'MPM2D', name: 'Principles of Mathematics, Grade 10 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'SNC2D', name: 'Science, Grade 10 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'CHC2D', name: 'Canadian History Since World War I, Grade 10 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'CHV2O', name: 'Civics and Citizenship, Grade 10 (Open)', type: 'Compulsory', credit: 0.5 },
        { code: 'GLC2O', name: 'Career Studies, Grade 10 (Open)', type: 'Compulsory', credit: 0.5 },
        { code: 'FSF2D', name: 'Core French, Grade 10 (Academic)', type: 'Compulsory', credit: 1 },
        { code: 'PPL2O', name: 'Healthy Active Living Education, Grade 10 (Open)', type: 'Optional', credit: 1 },
        { code: 'TIJ2O', name: 'Exploring Technologies, Grade 10 (Open)', type: 'Optional', credit: 1 },
      ],
    }),
    nonAcademicOntarioRecord: { ...NON_ACADEMIC, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    upgradeToOntarioRecord: { ...UPGRADE_TO_ONTARIO, delivery: 'Upgrade existing Non-Academic course to credit-bearing Ontario Record' },
    academicOntarioRecord: {
      selfPaced: { perCourse: 400, bundle6: 1800, singleCreditStandalone: 450, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
      liveTeacher: { ...LIVE_TEACHER, delivery: 'Live Classes with Ontario Certified Teachers', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
    },
    academicPrep: { perCourse: 50, listPrice: 50, salePrice: 50, fullYear: 300, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    officialOntario: { perCourse: 400, fullYear: 1800, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
  },

  '11': {
    registration: 100,
    entranceTest: 50,
    schedule: SCHEDULE,
    frenchNote: 'Students who have completed Grade 10 in their home country are not required to take French as a Second Language. An equivalent credit will be granted.',
    timetable: buildTimetable({
      gradeLabel: 'Grade 11',
      courses: [
        { code: 'ENG3U', name: 'English, Grade 11 (University)', type: 'Compulsory', credit: 1 },
        { code: 'MCR3U', name: 'Functions, Grade 11 (University)', type: 'Compulsory', credit: 1 },
        { code: 'SCH3U', name: 'Chemistry, Grade 11 (University)', type: 'Optional', credit: 1 },
        { code: 'SBI3U', name: 'Biology, Grade 11 (University)', type: 'Optional', credit: 1 },
        { code: 'SPH3U', name: 'Physics, Grade 11 (University)', type: 'Optional', credit: 1 },
        { code: 'BAF3M', name: 'Financial Accounting Fundamentals, Grade 11 (University or College)', type: 'Optional', credit: 1 },
        { code: 'ICS3U', name: 'Introduction to Computer Science, Grade 11 (University)', type: 'Optional', credit: 1 },
      ],
    }),
    nonAcademicOntarioRecord: { ...NON_ACADEMIC, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    upgradeToOntarioRecord: { ...UPGRADE_TO_ONTARIO, delivery: 'Upgrade existing Non-Academic course to credit-bearing Ontario Record' },
    academicOntarioRecord: {
      selfPaced: { perCourse: 400, bundle6: 1800, singleCreditStandalone: 450, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
      liveTeacher: { ...LIVE_TEACHER, delivery: 'Live Classes with Ontario Certified Teachers', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
    },
    academicPrep: { perCourse: 50, listPrice: 50, salePrice: 50, fullYear: 300, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    officialOntario: { perCourse: 400, fullYear: 1800, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
  },

  '12': {
    registration: 100,
    entranceTest: 50,
    schedule: SCHEDULE,
    frenchNote: 'Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted.',
    notes: ['MCV4U will be taken after MHF4U is completed.'],
    timetable: buildTimetable({
      gradeLabel: 'Grade 12',
      courses: [
        { code: 'ENG4U', name: 'English, Grade 12 (University)', type: 'Compulsory', credit: 1 },
        { code: 'MHF4U', name: 'Advanced Functions, Grade 12 (University)', type: 'Compulsory', credit: 1 },
        { code: 'MCV4U', name: 'Calculus and Vectors, Grade 12 (University)', type: 'Optional', credit: 1 },
        { code: 'SCH4U', name: 'Chemistry, Grade 12 (University)', type: 'Optional', credit: 1 },
        { code: 'SBI4U', name: 'Biology, Grade 12 (University)', type: 'Optional', credit: 1 },
        { code: 'SPH4U', name: 'Physics, Grade 12 (University)', type: 'Optional', credit: 1 },
        { code: 'SES4U', name: 'Earth and Space Science, Grade 12 (University)', type: 'Optional', credit: 1 },
        { code: 'BBB4M', name: 'International Business Fundamentals, Grade 12 (University or College)', type: 'Optional', credit: 1 },
      ],
    }),
    nonAcademicOntarioRecord: { ...NON_ACADEMIC, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    upgradeToOntarioRecord: { ...UPGRADE_TO_ONTARIO, delivery: 'Upgrade existing Non-Academic course to credit-bearing Ontario Record' },
    academicOntarioRecord: {
      selfPaced: { perCourse: 400, bundle6: 1800, singleCreditStandalone: 450, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
      liveTeacher: { ...LIVE_TEACHER, delivery: 'Live Classes with Ontario Certified Teachers', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
    },
    academicPrep: { perCourse: 50, listPrice: 50, salePrice: 50, fullYear: 300, delivery: 'Self-Learning via LMS Platform', whatYouGet: NON_ACADEMIC_WHAT_YOU_GET },
    officialOntario: { perCourse: 400, fullYear: 1800, delivery: 'Self-Learning via LMS Platform (credit-bearing)', whatYouGet: OFFICIAL_WHAT_YOU_GET_HIGH },
  },
};

// Helper function to get pricing for a specific grade
export function getPricingForGrade(grade) {
  const gradeNum = parseInt(grade, 10);
  if (GRADE_LEVEL_PRICING[String(gradeNum)]) {
    return GRADE_LEVEL_PRICING[String(gradeNum)];
  }
  if (gradeNum >= 1 && gradeNum <= 5) return GRADE_LEVEL_PRICING['1-5'];
  if (gradeNum >= 6 && gradeNum <= 8) return GRADE_LEVEL_PRICING['6-8'];
  if (gradeNum >= 9 && gradeNum <= 12) return GRADE_LEVEL_PRICING['9-12'];
  return null;
}

/** Returns the total per-course cost if a Non-Academic course is upgraded. */
export function getUpgradeTotalPerCourse() {
  return NON_ACADEMIC.perCourse + UPGRADE_TO_ONTARIO.addOnPerCourse;  // $50 + $350 = $400
}

// Helper to check if a grade is high school (has timetable data)
export function isHighSchool(grade) {
  return parseInt(grade, 10) >= 9;
}

// =========================================
// PRICING CONFIGURATION
// =========================================

export const PRICING_CONFIG = {
  nonCredit: {
    minPrice: 50,
    maxPrice: 50,
    bundleDiscount: 0,           // no bundle discount — 6 × $50 = $300
    currency: 'CAD',
  },
  credit: {
    basePrice: 400,
    minPrice: 350,               // G1-8 per-course rate
    maxPrice: 450,               // G9-12 single-credit standalone
    currency: 'CAD',
  },
  upgrade: {
    nonCreditToCredit: {
      minFee: 350,
      maxFee: 350,
      defaultFee: 350,           // additive delta on top of the $50 already paid
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
  creditCommission: 52,
  nonCreditCommission: 10,
  commissionCurrency: 'CAD',
  payoutThreshold: 100,
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
 * Calculate bundle price for a complete grade program.
 * In the new model, bundle prices are explicit (see GRADE_LEVEL_PRICING),
 * so this helper is kept for backward compatibility and simply sums listPrice.
 */
export function calculateGradeBundlePrice(grade, storefront, courses) {
  const gradeCourses = courses.filter(c =>
    c.grade === grade && c.storefront === storefront
  );

  const individualTotal = gradeCourses.reduce((sum, c) =>
    sum + (c.product?.pricing?.listPrice || 0), 0
  );

  const discountRate = storefront === 'credit'
    ? PRICING_CONFIG.credit.bundleDiscount || 0
    : PRICING_CONFIG.nonCredit.bundleDiscount || 0;

  return {
    bundlePrice: individualTotal * (1 - discountRate),
    savings: individualTotal * discountRate,
    savingsPercent: Math.round(discountRate * 100),
    courses: gradeCourses,
    displayText: discountRate > 0
      ? `Save ${Math.round(discountRate * 100)}% with Complete Grade ${grade} Program`
      : `Complete Grade ${grade} Program`,
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
 * Calculate upgrade path from non-credit to credit.
 * Upgrade fee is the additive delta ($350) paid on top of the $50 already spent
 * on the Non-Academic course. Net total per course after upgrade: $400.
 */
export function calculateUpgradePath(nonCreditCourse, creditEquivalent, userHasPurchased) {
  if (!creditEquivalent) {
    return {
      available: false,
      reason: 'No credit equivalent available for this course',
    };
  }

  const upgradeFee = PRICING_CONFIG.upgrade.nonCreditToCredit.defaultFee; // $350

  if (userHasPurchased) {
    return {
      available: true,
      upgradeFee,
      creditCoursePrice: creditEquivalent.product?.pricing?.listPrice || 400,
      totalToPay: upgradeFee,
      totalAfterUpgrade: NON_ACADEMIC.perCourse + upgradeFee, // $400
      savings: nonCreditCourse.pricePaid || nonCreditCourse.product?.pricing?.basePrice || NON_ACADEMIC.perCourse,
      creditCourse: creditEquivalent,
      displayText: `Upgrade to Ontario Record for just $${upgradeFee} (total $${NON_ACADEMIC.perCourse + upgradeFee})`,
    };
  }

  return {
    available: true,
    upgradeFee: 0,
    creditCoursePrice: creditEquivalent.product?.pricing?.listPrice || 400,
    totalToPay: creditEquivalent.product?.pricing?.listPrice || 400,
    savings: 0,
    creditCourse: creditEquivalent,
    displayText: 'Enroll in Ontario Record Course',
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
    listing.displayFormat = 'STANDARD';
    listing.priceNote = 'Non-Academic Ontario Record';
    listing.showListPrice = listing.listPrice !== listing.basePrice;
  } else {
    listing.displayFormat = 'STANDARD';
    listing.priceNote = 'Academic Ontario Record — credit-bearing';
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
// CART RULES (G9-12 single-credit surcharge)
// =========================================

/**
 * Determine the adjusted per-credit price for G9-12 Academic Ontario self-paced credits,
 * given the total count of such credits in the cart.
 *
 * - 1 credit:   $450 (standalone surcharge)
 * - 2-5 credits: $400 each (standard per-course rate)
 * - 6+ credits: $1,800 bundle total (= $300 avg per credit)
 */
export function getHighSchoolSelfPacedPriceRule(numCreditsInCart) {
  if (numCreditsInCart <= 0) return { perCredit: 0, total: 0, rule: 'none' };
  if (numCreditsInCart === 1) {
    return { perCredit: 450, total: 450, rule: 'single-credit-standalone' };
  }
  if (numCreditsInCart >= 6) {
    return { perCredit: 1800 / numCreditsInCart, total: 1800, rule: 'bundle-6-cap' };
  }
  return { perCredit: 400, total: 400 * numCreditsInCart, rule: 'standard' };
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
  getUpgradeTotalPerCourse,
  getHighSchoolSelfPacedPriceRule,
  isHighSchool,
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
