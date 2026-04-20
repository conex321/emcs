/**
 * EMCS Full Site Data Extractor
 * 
 * Reads courses.js, pricing.js, activities.js, en.json, and en-storefronts.json
 * then assembles everything into a single comprehensive JSON file.
 * 
 * Usage: node extract-site-data.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Helper: transpile ES module exports into a plain object ───
function extractJsExports(filePath) {
  let src = readFileSync(filePath, 'utf-8');

  // Strip import statements
  src = src.replace(/^import\s+.*$/gm, '');

  // Convert export patterns to plain JS
  src = src.replace(/^export\s+const\s+/gm, 'const ');
  src = src.replace(/^export\s+function\s+/gm, 'function ');
  src = src.replace(/^export\s+default\s+\{/gm, 'const __default__ = {');
  src = src.replace(/^export\s+default\s+/gm, 'const __default__ = ');

  // Collect every top-level const/function name
  const names = [];
  const constRe = /^(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=/gm;
  const funcRe = /^function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/gm;
  let m;
  while ((m = constRe.exec(src)) !== null) names.push(m[1]);
  while ((m = funcRe.exec(src)) !== null) names.push(m[1]);

  // Wrap in a function and return all collected constants
  // We convert functions to strings so they serialise to JSON
  const returnObj = names.map(n => `"${n}": (typeof ${n} === 'function' ? ${n}.toString() : ${n})`).join(', ');
  const wrapper = `
    (function() {
      ${src}
      return { ${returnObj} };
    })()
  `;

  try {
    return eval(wrapper);
  } catch (e) {
    console.warn(`⚠  Could not eval ${filePath}: ${e.message}`);
    console.warn(`   First 200 chars of wrapper: ${wrapper.substring(0, 200)}`);
    return {};
  }
}

// ─── Load data sources ───
console.log('📂 Loading data sources...');

const enJson = JSON.parse(readFileSync(join(__dirname, 'src/locales/en.json'), 'utf-8'));
const enStorefronts = JSON.parse(readFileSync(join(__dirname, 'src/locales/en-storefronts.json'), 'utf-8'));

const coursesExports = extractJsExports(join(__dirname, 'src/data/courses.js'));
const pricingExports = extractJsExports(join(__dirname, 'src/config/pricing.js'));

let activitiesExports = {};
try {
  activitiesExports = extractJsExports(join(__dirname, 'src/activities.js'));
} catch {
  try {
    activitiesExports = extractJsExports(join(__dirname, 'src/data/activities.js'));
  } catch {
    console.warn('⚠  activities.js not found or could not be parsed');
  }
}

// ─── Assemble the master JSON ───
console.log('🔧 Assembling master JSON...');

const masterJson = {
  _meta: {
    generatedAt: new Date().toISOString(),
    source: 'EMCS Platform — Full Site Data Export',
    description: 'Comprehensive JSON containing all textual content, course catalog, pricing, activities, and UI content from every page of the EMCS website.',
    school: {
      name: 'Toronto EMCS',
      legalName: 'Toronto EMCS Inc.',
      bsid: '886229',
      accreditation: 'Ontario Ministry of Education Inspected Private School',
      website: 'https://emcs.ca'
    }
  },

  // ──────────────────────────────────────────
  // SECTION 1: SITE-WIDE CONTENT (from en.json)
  // ──────────────────────────────────────────
  siteContent: {
    hero: enJson.hero,
    stats: enJson.stats,
    trustIndicators: enJson.trustIndicators,
    programPathways: enJson.programPathways,
    whyChooseEmcs: enJson.why,
    callToAction: enJson.cta,
    navigation: enJson.nav,
    footer: enJson.footer,
    accreditation: enJson.accreditation,
  },

  // ──────────────────────────────────────────
  // SECTION 2: PAGE-BY-PAGE CONTENT
  // ──────────────────────────────────────────
  pages: {
    home: {
      howItWorks: enJson.home?.howItWorks,
      popularCourses: enJson.home?.popularCourses,
      universityAcceptance: enJson.home?.universityAcceptance,
      lmsPlatform: enJson.home?.lms3d,
      featuredPrograms: enJson.home?.featuredPrograms,
      heroSubtitleV2: enJson.home?.heroSubtitleV2,
      taglineLearn: enJson.home?.taglineLearn,
    },
    about: enJson.about,
    programs: enJson.programs,
    primaryFoundation: enJson.primaryFoundation,
    middleSchool: enJson.middleSchool,
    highSchool: enJson.highSchool,
    creditCourses: enJson.creditCourses,
    practiceCourses: enJson.practiceCourses,
    international: enJson.international,
    ossdRequirements: enJson.ossd,
    studentSupport: enJson.support,
    faq: enJson.faq,
    tuition: enJson.tuition,
    tuitionPage: enJson.tuitionPage,
    contact: enJson.contact,
    academicPrep: enJson.academicPrep,
    officialOntario: enJson.officialOntario,
    gradePage: enJson.gradePage,
    schedulePage: enJson.schedulePage,
    comparePage: enJson.comparePage,
    portals: enJson.portals,
    subjects: enJson.subjects,
    activities: enJson.activities,
    coursePage: enJson.coursePage,
  },

  // ──────────────────────────────────────────
  // SECTION 3: STOREFRONT & E-COMMERCE CONTENT
  // ──────────────────────────────────────────
  storefront: {
    uiContent: enJson.storefront,
    storefronts: enStorefronts.storefronts,
    gradePage: enStorefronts.gradePage,
    courseCard: enStorefronts.courseCard,
    coursePage: enStorefronts.coursePage,
    cart: enStorefronts.cart,
    checkout: enStorefronts.checkout,
    errors: enStorefronts.errors,
    callToActions: enStorefronts.cta,
    labels: enStorefronts.labels,
    activityFeedback: enStorefronts.activities,
    accessibility: enStorefronts.accessibility,
  },

  // ──────────────────────────────────────────
  // SECTION 4: FULL COURSE CATALOG
  // ──────────────────────────────────────────
  courseCatalog: {
    _summary: {
      totalCourses: Object.keys(coursesExports.courses || {}).length,
      description: 'Every course offered by EMCS, including course code, title, grade, type, prerequisite, full description, teaching strategies, curriculum focus, unit breakdowns, evaluation structure, accommodations, resources, and FAQs.',
    },
    courses: coursesExports.courses || {},
  },

  // ──────────────────────────────────────────
  // SECTION 5: PRICING & BUNDLES
  // ──────────────────────────────────────────
  pricing: {
    _summary: {
      description: 'All pricing tiers, promotional discounts, bundle configurations, registration/entrance fees, and commission structures.',
    },
    primaryFoundationLegacy: pricingExports.PRIMARY_FOUNDATION_LEGACY || {},
    gradeLevelPricing: pricingExports.GRADE_LEVEL_PRICING || {},
    promotions: pricingExports.PROMOTIONS || pricingExports.promotions || {},
    commissions: pricingExports.COMMISSIONS || pricingExports.commissions || {},
    bundleConfig: pricingExports.BUNDLE_CONFIG || pricingExports.bundleConfig || {},
    couponConfig: pricingExports.COUPON_CONFIG || pricingExports.couponConfig || {},
    registrationFees: pricingExports.REGISTRATION_FEES || pricingExports.registrationFees || {},
    // Include any remaining exports
    _allPricingExports: Object.keys(pricingExports).reduce((acc, key) => {
      if (!['PRIMARY_FOUNDATION_LEGACY', 'GRADE_LEVEL_PRICING', 'PROMOTIONS', 'promotions', 'COMMISSIONS', 'commissions', 'BUNDLE_CONFIG', 'bundleConfig', 'COUPON_CONFIG', 'couponConfig', 'REGISTRATION_FEES', 'registrationFees'].includes(key)) {
        acc[key] = pricingExports[key];
      }
      return acc;
    }, {}),
  },

  // ──────────────────────────────────────────
  // SECTION 6: INTERACTIVE ACTIVITIES
  // ──────────────────────────────────────────
  activities: {
    _summary: {
      totalActivities: Object.keys(activitiesExports.activities || activitiesExports || {}).length,
      description: 'Interactive learning activities with questions, feedback, hints, and curriculum mapping.',
    },
    items: activitiesExports.activities || activitiesExports || {},
  },
};

// ─── Write output ───
const outputPath = join(__dirname, 'emcs-complete-site-data.json');
writeFileSync(outputPath, JSON.stringify(masterJson, null, 2), 'utf-8');

const stats = readFileSync(outputPath);
const sizeMB = (stats.length / 1024 / 1024).toFixed(2);

console.log(`\n✅ Done! Written to: ${outputPath}`);
console.log(`📊 File size: ${sizeMB} MB`);
console.log(`📋 Courses: ${masterJson.courseCatalog._summary.totalCourses}`);
console.log(`💰 Pricing tiers: ${Object.keys(masterJson.pricing.gradeLevelPricing).length}`);
console.log(`📄 Pages exported: ${Object.keys(masterJson.pages).length}`);
