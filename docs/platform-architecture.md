# EMCS K-12 Education Platform Architecture
## Complete Redesign Documentation

**Brand:** EMCS (Excellence Maple Canadian School)
**Value Proposition:** Ontario-certified online education for K-12 students worldwide
**Primary Audiences:** Parents (buyers), Students (users), Agents/Partners, Schools

---

# A) SITEMAP / INFORMATION ARCHITECTURE (YAML)

```yaml
# EMCS Platform Information Architecture
# Two-Storefront Model: Non-credit & Credit

site:
  name: "EMCS - Excellence Maple Canadian School"
  tagline: "Ontario-Certified Education for Global Learners"

top_nav:
  - label: "Non-credit"
    color: "#2F80ED"
    path: "/non-credit"
    description: "Self-paced video courses with homework - no tests, no OSSD credit"
    grades:
      - K
      - 1
      - 2
      - 3
      - 4
      - 5
      - 6
      - 7
      - 8
      - 9
      - 10
      - 11
      - 12
    subjects_per_grade:
      - Math
      - Science
      - English

  - label: "Credit"
    color: "#F2C94C"
    path: "/credit"
    description: "Ontario credit courses - live online with Canadian teachers"
    grades:
      - 9
      - 10
      - 11
      - 12
    subjects_per_grade:
      - Math
      - Science
      - English

secondary_nav:
  - label: "About"
    path: "/about"
  - label: "OSSD Requirements"
    path: "/ossd-requirements"
  - label: "International Students"
    path: "/admissions/international"
  - label: "FAQ"
    path: "/faq"
  - label: "Contact"
    path: "/contact"

utility_nav:
  - label: "Login"
    path: "/login"
  - label: "Register"
    path: "/register"
  - label: "Cart"
    path: "/cart"
    icon: "shopping-cart"
  - label: "Language"
    options: ["EN", "VI"]

page_structure:
  homepage:
    path: "/"
    sections:
      - hero_with_storefront_selector
      - value_proposition
      - featured_grade_programs
      - how_it_works
      - testimonials
      - university_partners
      - cta_section

  non_credit_landing:
    path: "/non-credit"
    layout:
      - hero:
          title: "Non-credit Learning Programs"
          subtitle: "Self-paced video courses with homework practice"
          disclaimer: "No tests, no assessments, no report card, no OSSD credit"
      - grade_selector:
          layout: "horizontal_tabs"
          grades: ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
      - default_view: "grade_1"

  credit_landing:
    path: "/credit"
    layout:
      - hero:
          title: "Ontario Credit Courses"
          subtitle: "Live online classes with certified Canadian teachers"
          badge: "Ministry of Education Approved"
      - grade_selector:
          layout: "horizontal_tabs"
          grades: ["9", "10", "11", "12"]
      - default_view: "grade_12"

  grade_page:
    path: "/{storefront}/grade/{grade}"
    example: "/non-credit/grade/3"
    layout:
      header:
        - grade_selector_tabs
        - subject_tabs: ["Math", "Science", "English"]
      hero_cta:
        text: "Complete Grade {X} Program"
        description: "Bundle all subjects at a discounted price"
      sections:
        - bundle_card:
            title: "Complete Grade {X} Program"
            includes: "All Math, Science, English courses"
            pricing: "bundle_discount_applied"
        - individual_courses_grid:
            layout: "3_column"
            filter_by: "subject_tab"
            sort: "recommended_first"

  subject_page:
    path: "/{storefront}/grade/{grade}/{subject}"
    example: "/credit/grade/12/math"
    layout:
      - breadcrumb: "Credit > Grade 12 > Math"
      - subject_hero:
          title: "Grade 12 Math Courses"
          subject: "Math"
          grade: "12"
      - courses_list:
          - course_card_with_details

  course_detail:
    path: "/{storefront}/course/{course_code}"
    example: "/credit/course/MHF4U"
    layout:
      - breadcrumb
      - course_hero:
          - title
          - course_code
          - credit_status_badge
      - sidebar:
          - quick_facts
          - pricing_card
          - cta_buttons
      - main_content:
          - overview
          - learning_outcomes
          - units_accordion
          - prerequisites
          - delivery_method
          - schedule_info (credit only)
          - teacher_info (credit only)
          - faqs
      - related_courses

  cart_page:
    path: "/cart"
    layout:
      - cart_items_list
      - bundle_recommendations
      - upgrade_offers
      - coupon_input
      - cart_summary
      - checkout_button

  checkout_page:
    path: "/checkout"
    layout:
      - checkout_progress_indicator
      - steps:
          - parent_details
          - student_details
          - payment_method
          - confirmation

  user_dashboard:
    path: "/dashboard"
    layout:
      - enrolled_courses
      - progress_tracking
      - upcoming_classes (credit)
      - certificates
      - account_settings

subjects_default:
  - Math
  - Science
  - English

grade_content_types:
  elementary: # K-5
    - interactive_activities
    - video_lessons
    - practice_worksheets
    - progress_badges
  middle: # 6-8
    - video_lessons
    - homework_assignments
    - practice_quizzes
    - project_based_learning
  secondary: # 9-12
    - comprehensive_units
    - live_sessions (credit)
    - assignments
    - assessments (credit)
    - final_exam (credit)
```

---

# B) TOP NAV & MENU CONFIG (JSON)

```json
{
  "navigation": {
    "brand": {
      "name": "EMCS",
      "logo": "/images/logo-shield.png",
      "tagline": "Excellence Maple Canadian School",
      "href": "/"
    },
    "storefronts": {
      "nonCredit": {
        "label": "Non-credit",
        "href": "/non-credit",
        "color": {
          "primary": "#2F80ED",
          "secondary": "#1A5DC9",
          "light": "#E3F2FD",
          "text": "#FFFFFF"
        },
        "badge": null,
        "grades": ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        "subjects": ["Math", "Science", "English"],
        "menuConfig": {
          "showGradeDropdown": true,
          "groupBy": "level",
          "levels": {
            "elementary": {
              "label": "Elementary (K-5)",
              "grades": ["K", "1", "2", "3", "4", "5"],
              "icon": "school"
            },
            "middle": {
              "label": "Middle School (6-8)",
              "grades": ["6", "7", "8"],
              "icon": "menu_book"
            },
            "secondary": {
              "label": "High School (9-12)",
              "grades": ["9", "10", "11", "12"],
              "icon": "graduation_cap"
            }
          }
        }
      },
      "credit": {
        "label": "Credit",
        "href": "/credit",
        "color": {
          "primary": "#F2C94C",
          "secondary": "#D4AF37",
          "light": "#FFF8E1",
          "text": "#1B4332"
        },
        "badge": "Ontario OSSD",
        "grades": ["9", "10", "11", "12"],
        "subjects": ["Math", "Science", "English"],
        "menuConfig": {
          "showGradeDropdown": true,
          "groupBy": null,
          "showScheduleInfo": true,
          "scheduleNote": "Live classes: 6 hrs/week"
        }
      }
    },
    "secondaryLinks": [
      {
        "label": "About",
        "href": "/about",
        "dropdown": null
      },
      {
        "label": "Programs",
        "href": "#",
        "dropdown": [
          { "label": "OSSD Requirements", "href": "/ossd-requirements", "icon": "certificate" },
          { "label": "IB Diploma", "href": "/programs/ib", "icon": "globe" },
          { "label": "AP Courses", "href": "/programs/ap", "icon": "star" },
          { "label": "ESL Programs", "href": "/programs/esl", "icon": "translate" }
        ]
      },
      {
        "label": "International Students",
        "href": "/admissions/international",
        "dropdown": null
      },
      {
        "label": "Support",
        "href": "#",
        "dropdown": [
          { "label": "FAQ", "href": "/faq" },
          { "label": "Contact Us", "href": "/contact" },
          { "label": "Student Support", "href": "/student-support" }
        ]
      }
    ],
    "utilityNav": {
      "language": {
        "current": "EN",
        "options": [
          { "code": "en", "label": "English", "flag": "🇨🇦" },
          { "code": "vi", "label": "Tiếng Việt", "flag": "🇻🇳" }
        ]
      },
      "auth": {
        "login": {
          "label": "Login",
          "href": "/login",
          "variant": "text"
        },
        "register": {
          "label": "Get Started",
          "href": "/register",
          "variant": "primary"
        }
      },
      "cart": {
        "label": "Cart",
        "href": "/cart",
        "icon": "shopping_cart",
        "showBadge": true
      }
    },
    "mobileMenu": {
      "breakpoint": "768px",
      "layout": "fullscreen",
      "showStorefrontTabs": true,
      "primaryActions": ["register", "login"],
      "showLanguageToggle": true
    }
  },
  "gradeTabs": {
    "nonCredit": {
      "elementary": {
        "grades": ["K", "1", "2", "3", "4", "5"],
        "style": "playful",
        "colorScheme": "bright"
      },
      "middle": {
        "grades": ["6", "7", "8"],
        "style": "balanced",
        "colorScheme": "moderate"
      },
      "secondary": {
        "grades": ["9", "10", "11", "12"],
        "style": "professional",
        "colorScheme": "subtle"
      }
    },
    "credit": {
      "grades": ["9", "10", "11", "12"],
      "style": "professional",
      "showOntarioCode": true
    }
  },
  "subjectTabs": {
    "default": ["Math", "Science", "English"],
    "icons": {
      "Math": "calculate",
      "Science": "science",
      "English": "menu_book"
    },
    "colors": {
      "Math": "#6366F1",
      "Science": "#10B981",
      "English": "#F59E0B"
    }
  }
}
```

---

# C) COURSE PAGE SCHEMA (JSON Schema) + EXAMPLES

## JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://emcs.ca/schemas/course.json",
  "title": "EMCS Course Schema",
  "description": "Schema for both Credit and Non-credit course definitions",
  "type": "object",
  "required": [
    "id",
    "code",
    "title",
    "grade",
    "subject",
    "storefront",
    "overview",
    "learningOutcomes",
    "product"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique course identifier (UUID)",
      "pattern": "^[a-f0-9-]{36}$"
    },
    "code": {
      "type": "string",
      "description": "Course code (Ontario code for credit, internal for non-credit)",
      "examples": ["MHF4U", "NC-G3-MATH-101"]
    },
    "title": {
      "type": "string",
      "minLength": 5,
      "maxLength": 100,
      "examples": ["Advanced Functions", "Grade 3 Math Foundations"]
    },
    "grade": {
      "type": "string",
      "enum": ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    },
    "subject": {
      "type": "string",
      "enum": ["Math", "Science", "English"]
    },
    "storefront": {
      "type": "string",
      "enum": ["credit", "non-credit"],
      "description": "Which storefront this course belongs to"
    },
    "ontarioCode": {
      "type": "string",
      "description": "Official Ontario curriculum code (credit courses only)",
      "pattern": "^[A-Z]{3}[0-9][A-Z]$",
      "examples": ["MHF4U", "ENG4U", "SBI4U"]
    },
    "courseType": {
      "type": "string",
      "enum": ["University", "University/College", "College", "Workplace", "Open"],
      "description": "Ontario pathway designation (credit courses only)"
    },
    "prerequisites": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "code": { "type": "string" },
          "title": { "type": "string" },
          "required": { "type": "boolean" },
          "alternatives": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      },
      "description": "List of prerequisite courses"
    },
    "overview": {
      "type": "string",
      "minLength": 100,
      "maxLength": 1000,
      "description": "Course description for parents/students"
    },
    "learningOutcomes": {
      "type": "array",
      "minItems": 3,
      "maxItems": 10,
      "items": {
        "type": "string",
        "minLength": 20
      },
      "description": "What students will learn/achieve"
    },
    "units": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description"],
        "properties": {
          "unitNumber": { "type": "integer", "minimum": 1 },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "hours": { "type": "number", "minimum": 1 },
          "topics": {
            "type": "array",
            "items": { "type": "string" }
          },
          "ontarioCurriculumRef": {
            "type": "string",
            "description": "Reference to Ontario curriculum expectation codes"
          }
        }
      }
    },
    "creditStatus": {
      "type": "object",
      "properties": {
        "isCredit": { "type": "boolean" },
        "creditValue": {
          "type": "number",
          "enum": [0, 0.5, 1],
          "description": "Ontario credit value (0 for non-credit)"
        },
        "ossdEligible": { "type": "boolean" },
        "disclaimer": {
          "type": "string",
          "description": "Required disclaimer text for non-credit courses"
        }
      },
      "required": ["isCredit", "creditValue", "ossdEligible"]
    },
    "delivery": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "enum": ["live-online", "self-paced", "hybrid"]
        },
        "platform": {
          "type": "string",
          "enum": ["Zoom", "LMS", "Both"],
          "description": "Primary delivery platform"
        },
        "schedule": {
          "type": "object",
          "properties": {
            "hoursPerWeek": { "type": "number" },
            "daysPerWeek": { "type": "integer" },
            "hoursPerSession": { "type": "number" },
            "totalWeeks": { "type": "integer" },
            "totalHours": { "type": "number" },
            "flexibleSchedule": { "type": "boolean" }
          }
        },
        "includes": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "video-lessons",
              "live-sessions",
              "homework",
              "practice-activities",
              "quizzes",
              "assignments",
              "tests",
              "final-exam",
              "report-card",
              "certificate"
            ]
          }
        }
      },
      "required": ["method", "includes"]
    },
    "product": {
      "type": "object",
      "required": ["sku", "pricing"],
      "properties": {
        "sku": {
          "type": "string",
          "description": "Product SKU for e-commerce"
        },
        "pricing": {
          "type": "object",
          "required": ["listPrice", "currency"],
          "properties": {
            "listPrice": {
              "type": "number",
              "minimum": 0,
              "description": "Display price before discounts"
            },
            "basePrice": {
              "type": "number",
              "description": "Actual base price (may differ from list for marketing)"
            },
            "currency": {
              "type": "string",
              "enum": ["CAD", "USD"],
              "default": "CAD"
            },
            "discountable": { "type": "boolean", "default": true },
            "maxDiscountPercent": {
              "type": "number",
              "minimum": 0,
              "maximum": 100
            }
          }
        },
        "upgradePath": {
          "type": "object",
          "description": "For non-credit courses: path to credit version",
          "properties": {
            "targetCourseId": { "type": "string" },
            "upgradeFee": { "type": "number" },
            "upgradeDisclaimer": { "type": "string" }
          }
        },
        "bundleIncludes": {
          "type": "array",
          "description": "For credit courses: related non-credit courses included free",
          "items": {
            "type": "object",
            "properties": {
              "courseId": { "type": "string" },
              "priceOverride": { "type": "number", "default": 0 }
            }
          }
        }
      }
    },
    "media": {
      "type": "object",
      "properties": {
        "thumbnail": { "type": "string", "format": "uri" },
        "heroImage": { "type": "string", "format": "uri" },
        "previewVideo": { "type": "string", "format": "uri" },
        "syllabusPdf": { "type": "string", "format": "uri" }
      }
    },
    "seo": {
      "type": "object",
      "properties": {
        "metaTitle": { "type": "string", "maxLength": 60 },
        "metaDescription": { "type": "string", "maxLength": 160 },
        "keywords": {
          "type": "array",
          "items": { "type": "string" }
        },
        "canonicalUrl": { "type": "string", "format": "uri" }
      }
    },
    "status": {
      "type": "string",
      "enum": ["draft", "published", "archived"],
      "default": "draft"
    },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

## Example Course Instances

### Credit Course Example (Grade 12 Advanced Functions)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "code": "MHF4U",
  "title": "Advanced Functions",
  "grade": "12",
  "subject": "Math",
  "storefront": "credit",
  "ontarioCode": "MHF4U",
  "courseType": "University",
  "prerequisites": [
    {
      "code": "MCR3U",
      "title": "Grade 11 Functions",
      "required": true,
      "alternatives": ["MCT4C"]
    }
  ],
  "overview": "Grade 12 Advanced Functions extends your experience with functions through in-depth study of polynomial, rational, logarithmic, and trigonometric functions. You'll develop techniques for combining functions, broaden your understanding of rates of change, and build skills essential for university-level mathematics and related programs.",
  "learningOutcomes": [
    "Analyze and graph polynomial functions of degree greater than 2",
    "Solve polynomial equations and inequalities",
    "Demonstrate understanding of rational functions through analysis and graphing",
    "Apply trigonometric identities and solve trigonometric equations",
    "Explore exponential and logarithmic functions and their applications",
    "Make connections between algebraic and graphical representations"
  ],
  "units": [
    {
      "unitNumber": 1,
      "title": "Polynomial Functions",
      "description": "Investigate properties and graphs of polynomial functions",
      "hours": 20,
      "topics": ["Polynomial characteristics", "Graphing techniques", "Transformations"],
      "ontarioCurriculumRef": "A1, A2, A3"
    },
    {
      "unitNumber": 2,
      "title": "Polynomial Equations and Inequalities",
      "description": "Solve polynomial equations using various methods",
      "hours": 15,
      "topics": ["Factor theorem", "Polynomial division", "Solving inequalities"]
    },
    {
      "unitNumber": 3,
      "title": "Rational Functions",
      "description": "Analyze rational functions and their graphs",
      "hours": 15,
      "topics": ["Asymptotes", "Graphing rational functions", "Applications"]
    },
    {
      "unitNumber": 4,
      "title": "Trigonometry",
      "description": "Advanced trigonometric concepts and identities",
      "hours": 25,
      "topics": ["Radian measure", "Trigonometric identities", "Solving equations"]
    },
    {
      "unitNumber": 5,
      "title": "Trigonometric Functions",
      "description": "Graphing and transforming trigonometric functions",
      "hours": 15,
      "topics": ["Sinusoidal functions", "Transformations", "Applications"]
    },
    {
      "unitNumber": 6,
      "title": "Exponential and Logarithmic Functions",
      "description": "Explore exponential growth/decay and logarithms",
      "hours": 20,
      "topics": ["Exponential functions", "Logarithmic functions", "Applications"]
    }
  ],
  "creditStatus": {
    "isCredit": true,
    "creditValue": 1,
    "ossdEligible": true,
    "disclaimer": null
  },
  "delivery": {
    "method": "live-online",
    "platform": "Zoom",
    "schedule": {
      "hoursPerWeek": 6,
      "daysPerWeek": 3,
      "hoursPerSession": 2,
      "totalWeeks": 18,
      "totalHours": 110,
      "flexibleSchedule": false
    },
    "includes": [
      "live-sessions",
      "video-lessons",
      "homework",
      "assignments",
      "quizzes",
      "tests",
      "final-exam",
      "report-card"
    ]
  },
  "product": {
    "sku": "CREDIT-MHF4U-2025",
    "pricing": {
      "listPrice": 3000,
      "basePrice": 3000,
      "currency": "CAD",
      "discountable": true,
      "maxDiscountPercent": 60
    },
    "bundleIncludes": [
      {
        "courseId": "550e8400-e29b-41d4-a716-446655440101",
        "priceOverride": 0
      }
    ]
  },
  "media": {
    "thumbnail": "/images/courses/mhf4u-thumb.jpg",
    "heroImage": "/images/courses/mhf4u-hero.jpg",
    "previewVideo": "https://vimeo.com/emcs/mhf4u-preview",
    "syllabusPdf": "/docs/syllabi/MHF4U-syllabus.pdf"
  },
  "seo": {
    "metaTitle": "Grade 12 Advanced Functions (MHF4U) | EMCS Ontario Credit Course",
    "metaDescription": "Earn Ontario credit in Advanced Functions. Live online classes with certified teachers. Prepare for university calculus and STEM programs.",
    "keywords": ["MHF4U", "advanced functions", "grade 12 math", "Ontario credit", "university prep math"]
  },
  "status": "published",
  "createdAt": "2024-01-15T00:00:00Z",
  "updatedAt": "2025-01-02T00:00:00Z"
}
```

### Non-credit Course Example (Grade 3 Math)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440201",
  "code": "NC-G3-MATH-101",
  "title": "Grade 3 Math Foundations",
  "grade": "3",
  "subject": "Math",
  "storefront": "non-credit",
  "ontarioCode": null,
  "courseType": null,
  "prerequisites": [],
  "overview": "Build a strong foundation in Grade 3 mathematics through engaging video lessons and interactive practice activities. Your child will develop number sense, learn multiplication and division basics, explore geometry, and strengthen problem-solving skills aligned to Ontario curriculum expectations.",
  "learningOutcomes": [
    "Understand place value to 1,000 and perform multi-digit addition and subtraction",
    "Learn multiplication facts to 7x7 and understand division as sharing",
    "Tell time to the nearest minute and calculate elapsed time",
    "Identify and describe geometric shapes and their properties",
    "Collect data and create simple graphs",
    "Solve word problems using multiple strategies"
  ],
  "units": [
    {
      "unitNumber": 1,
      "title": "Number Sense and Numeration",
      "description": "Place value, comparing numbers, and operations",
      "hours": 15,
      "topics": ["Place value to 1,000", "Addition and subtraction", "Mental math strategies"]
    },
    {
      "unitNumber": 2,
      "title": "Multiplication and Division",
      "description": "Introduction to multiplication and division concepts",
      "hours": 20,
      "topics": ["Multiplication as groups", "Division as sharing", "Fact families"]
    },
    {
      "unitNumber": 3,
      "title": "Measurement",
      "description": "Time, length, mass, and capacity",
      "hours": 12,
      "topics": ["Telling time", "Measuring length", "Perimeter basics"]
    },
    {
      "unitNumber": 4,
      "title": "Geometry",
      "description": "2D and 3D shapes",
      "hours": 10,
      "topics": ["Shape properties", "Symmetry", "Location and movement"]
    },
    {
      "unitNumber": 5,
      "title": "Data Management",
      "description": "Collecting and organizing data",
      "hours": 8,
      "topics": ["Surveys", "Bar graphs", "Interpreting data"]
    }
  ],
  "creditStatus": {
    "isCredit": false,
    "creditValue": 0,
    "ossdEligible": false,
    "disclaimer": "This is a non-credit course. It does not include tests, assessments, report cards, or OSSD credit. For Ontario credit, please see our Credit courses."
  },
  "delivery": {
    "method": "self-paced",
    "platform": "LMS",
    "schedule": {
      "hoursPerWeek": null,
      "daysPerWeek": null,
      "hoursPerSession": null,
      "totalWeeks": null,
      "totalHours": 65,
      "flexibleSchedule": true
    },
    "includes": [
      "video-lessons",
      "practice-activities",
      "homework"
    ]
  },
  "product": {
    "sku": "NC-G3-MATH-2025",
    "pricing": {
      "listPrice": 250,
      "basePrice": 100,
      "currency": "CAD",
      "discountable": true,
      "maxDiscountPercent": 60
    },
    "upgradePath": {
      "targetCourseId": null,
      "upgradeFee": null,
      "upgradeDisclaimer": "Grade 3 does not have a credit equivalent"
    }
  },
  "media": {
    "thumbnail": "/images/courses/g3-math-thumb.jpg",
    "heroImage": "/images/courses/g3-math-hero.jpg",
    "previewVideo": "https://vimeo.com/emcs/g3-math-preview"
  },
  "seo": {
    "metaTitle": "Grade 3 Math Practice | EMCS Non-credit Learning",
    "metaDescription": "Fun, engaging Grade 3 math practice with video lessons and interactive activities. Self-paced learning aligned to Ontario curriculum.",
    "keywords": ["grade 3 math", "elementary math", "math practice", "Ontario curriculum", "self-paced learning"]
  },
  "status": "published",
  "createdAt": "2024-06-01T00:00:00Z",
  "updatedAt": "2025-01-02T00:00:00Z"
}
```

---

# D) PRODUCT & PRICING RULES (Pseudo-logic)

```javascript
// =========================================
// EMCS PRICING & PROMOTION ENGINE
// =========================================

// -----------------------------------------
// 1. BASE PRICING RULES
// -----------------------------------------

const PRICING_CONFIG = {
  nonCredit: {
    minPrice: 100,
    maxPrice: 150,
    listPriceMultiplier: 2.5, // Show $250 list, actual $100
    bundleDiscount: 0.20,     // 20% off for complete grade bundle
  },
  credit: {
    basePrice: 3000,
    minPrice: 1200,           // After max discount
    maxPrice: 3000,
    bundleDiscount: 0.15,     // 15% off for full year bundle
  },
  upgrade: {
    nonCreditToCredit: {
      minFee: 300,
      maxFee: 500,
      defaultFee: 350,
    }
  }
};

// -----------------------------------------
// 2. STOREFRONT PRODUCT TYPE RULES
// -----------------------------------------

function determineProductType(course) {
  if (course.storefront === 'credit') {
    return {
      type: 'CREDIT_COURSE',
      includes: {
        liveClasses: true,
        zoomSessions: true,
        certifiedTeacher: true,
        assignments: true,
        tests: true,
        finalExam: true,
        reportCard: true,
        ossdCredit: true,
      },
      excludes: [],
      requiredDisclaimer: null,
    };
  } else {
    return {
      type: 'NON_CREDIT_COURSE',
      includes: {
        videoLessons: true,
        homeworkPractice: true,
        interactiveActivities: true,
      },
      excludes: [
        'tests',
        'assessments',
        'reportCard',
        'ossdCredit',
        'liveClasses',
      ],
      requiredDisclaimer:
        'This is a non-credit course. No tests, no assessments, no report card, no OSSD credit.',
    };
  }
}

// -----------------------------------------
// 3. BUNDLE LOGIC
// -----------------------------------------

// Credit course auto-includes related non-credit
function applyCreditBundleRules(cartItem, cart) {
  if (cartItem.type !== 'CREDIT_COURSE') return cartItem;

  const relatedNonCredit = findRelatedNonCredit(cartItem);

  if (relatedNonCredit && !cart.contains(relatedNonCredit.id)) {
    return {
      ...cartItem,
      bundledItems: [
        {
          ...relatedNonCredit,
          price: 0,
          originalPrice: relatedNonCredit.price,
          bundleReason: 'FREE with credit course purchase',
          displayAs: 'BONUS_INCLUDED',
        }
      ],
    };
  }

  return cartItem;
}

// Complete grade bundle pricing
function calculateGradeBundlePrice(grade, storefront, courses) {
  const gradeCourses = courses.filter(c =>
    c.grade === grade && c.storefront === storefront
  );

  const individualTotal = gradeCourses.reduce((sum, c) => sum + c.price, 0);
  const discountRate = storefront === 'credit'
    ? PRICING_CONFIG.credit.bundleDiscount
    : PRICING_CONFIG.nonCredit.bundleDiscount;

  return {
    bundlePrice: individualTotal * (1 - discountRate),
    savings: individualTotal * discountRate,
    savingsPercent: discountRate * 100,
    courses: gradeCourses,
    displayText: `Save ${discountRate * 100}% with Complete Grade ${grade} Program`,
  };
}

// -----------------------------------------
// 4. UPGRADE RULES (Non-credit → Credit)
// -----------------------------------------

function calculateUpgradePath(nonCreditCourseId, userId) {
  const nonCreditCourse = getCourse(nonCreditCourseId);
  const creditEquivalent = findCreditEquivalent(nonCreditCourse);

  if (!creditEquivalent) {
    return {
      available: false,
      reason: 'No credit equivalent available for this course',
    };
  }

  const userHasPurchased = checkUserPurchase(userId, nonCreditCourseId);

  if (userHasPurchased) {
    // User already owns non-credit - offer upgrade fee only
    const upgradeFee = PRICING_CONFIG.upgrade.nonCreditToCredit.defaultFee;

    return {
      available: true,
      upgradeFee: upgradeFee,
      creditCoursePrice: creditEquivalent.price,
      totalToPay: upgradeFee,  // Only pay the difference
      savings: nonCreditCourse.pricePaid,
      creditCourse: creditEquivalent,
      displayText: `Upgrade to Credit for just $${upgradeFee}`,
    };
  } else {
    // User doesn't own non-credit - standard credit purchase
    return {
      available: true,
      upgradeFee: 0,
      creditCoursePrice: creditEquivalent.price,
      totalToPay: creditEquivalent.price,
      savings: 0,
      creditCourse: creditEquivalent,
      displayText: 'Enroll in Credit Course',
    };
  }
}

// Prevent double-charging on upgrade
function processUpgrade(userId, nonCreditCourseId) {
  const upgrade = calculateUpgradePath(nonCreditCourseId, userId);

  if (!upgrade.available) {
    throw new Error(upgrade.reason);
  }

  // Create upgrade order
  const order = {
    type: 'UPGRADE',
    originalCourseId: nonCreditCourseId,
    newCourseId: upgrade.creditCourse.id,
    chargeAmount: upgrade.totalToPay,
    creditApplied: upgrade.savings,
    note: 'Non-credit purchase credited toward credit enrollment',
  };

  // Deactivate non-credit enrollment
  deactivateEnrollment(userId, nonCreditCourseId, 'UPGRADED_TO_CREDIT');

  // Create credit enrollment
  createEnrollment(userId, upgrade.creditCourse.id, order);

  return order;
}

// -----------------------------------------
// 5. COUPON & DISCOUNT RULES
// -----------------------------------------

const COUPON_CONFIG = {
  maxDiscountPercent: 60,
  minDiscountPercent: 10,
  allowStacking: false,
  agentCodePrefix: 'AGENT-',
  promoCodePrefix: 'PROMO-',
};

function validateCoupon(code, cart, user) {
  const coupon = getCoupon(code);

  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }

  if (coupon.expiresAt < new Date()) {
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

function applyCoupon(code, cart) {
  const validation = validateCoupon(code, cart);

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const coupon = validation.coupon;

  // Check if already has coupon (no stacking)
  if (cart.appliedCoupon && !COUPON_CONFIG.allowStacking) {
    // Replace existing coupon
    removeCoupon(cart);
  }

  let discount = 0;

  if (coupon.type === 'PERCENT') {
    // Cap at max discount
    const effectivePercent = Math.min(
      coupon.value,
      COUPON_CONFIG.maxDiscountPercent
    );
    discount = cart.subtotal * (effectivePercent / 100);
  } else if (coupon.type === 'FIXED') {
    discount = Math.min(coupon.value, cart.subtotal * 0.6); // Max 60% off
  }

  return {
    success: true,
    cart: {
      ...cart,
      appliedCoupon: coupon,
      discount: discount,
      subtotal: cart.subtotal,
      total: cart.subtotal - discount,
    },
    displayText: `${coupon.code}: -$${discount.toFixed(2)} (${coupon.description})`,
  };
}

// -----------------------------------------
// 6. AGENT COMMISSION TRACKING
// -----------------------------------------

const AGENT_CONFIG = {
  creditCommission: 52,       // $52 per credit student
  nonCreditCommission: 10,    // $10 per non-credit student
  commissionCurrency: 'CAD',
  payoutThreshold: 100,       // Minimum payout amount
  payoutSchedule: 'MONTHLY',
};

function processAgentCommission(order, couponCode) {
  if (!couponCode || !couponCode.startsWith(COUPON_CONFIG.agentCodePrefix)) {
    return null;
  }

  const agentId = extractAgentId(couponCode);
  const agent = getAgent(agentId);

  if (!agent || !agent.active) {
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
      courseId: item.courseId,
      courseName: item.title,
      storefront: item.storefront,
      commission: commission,
    });
  }

  // Record commission
  const commissionRecord = {
    agentId: agent.id,
    orderId: order.id,
    studentId: order.userId,
    totalCommission: totalCommission,
    currency: AGENT_CONFIG.commissionCurrency,
    items: commissionItems,
    status: 'PENDING',
    createdAt: new Date(),
  };

  saveCommission(commissionRecord);

  return commissionRecord;
}

// -----------------------------------------
// 7. PRICING DISPLAY RULES
// -----------------------------------------

function formatPriceDisplay(course, appliedDiscount = null) {
  const listing = {
    listPrice: course.product.pricing.listPrice,
    currency: course.product.pricing.currency,
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

  // Non-credit courses show strikethrough price
  if (course.storefront === 'non-credit') {
    listing.displayFormat = 'STRIKETHROUGH';
    listing.priceNote = 'Limited time offer';
  } else {
    listing.displayFormat = 'STANDARD';
    listing.priceNote = 'Live online with certified teacher';
  }

  return listing;
}

// -----------------------------------------
// 8. SCHOOL MEMBERSHIP (FUTURE)
// -----------------------------------------

const SCHOOL_MEMBERSHIP_CONFIG = {
  annualPrice: 1000,
  perStudentPrice: null,  // Included in annual
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
};

function calculateSchoolPricing(schoolId, options) {
  // Implementation for school membership pricing
  // Deferred to backlog
  return {
    status: 'FEATURE_DEFERRED',
    targetRelease: '2025-Q2',
  };
}
```

---

# E) CHECKOUT & PAYMENT FLOWS

## Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CHECKOUT FLOW OVERVIEW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────────────┐ │
│  │  CART   │───▶│   DETAILS   │───▶│   PAYMENT   │───▶│  CONFIRMATION   │ │
│  └─────────┘    └─────────────┘    └─────────────┘    └──────────────────┘ │
│      │                │                  │                    │             │
│   • Items         • Parent            • Card             • Receipt          │
│   • Bundles       • Student           • Flywire          • Enrollment       │
│   • Coupons       • Account           • Review           • Next Steps       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 1: Cart Review

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SHOPPING CART                                                    [Continue] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ [Credit Badge] Advanced Functions (MHF4U)              Grade 12        │ │
│  │ Live online • 6 hrs/week • Ontario Credit                              │ │
│  │                                                          $3,000.00 CAD │ │
│  │                                                          [Remove]      │ │
│  │                                                                        │ │
│  │   ✓ BONUS INCLUDED: Grade 12 Math Practice (Non-credit)        FREE   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ [Non-credit Badge] Grade 3 Math Foundations                            │ │
│  │ Self-paced • Video lessons + practice                                  │ │
│  │ ⓘ No tests, assessments, report card, or OSSD credit                  │ │
│  │                                                 $250.00  $100.00 CAD   │ │
│  │                                                 ▔▔▔▔▔▔▔▔  [Remove]    │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌──────────────────────────────────────────┐                               │
│  │  💡 UPGRADE AVAILABLE                    │                               │
│  │  Get Grade 3 Credit Course for +$350    │  [View Upgrade]               │
│  └──────────────────────────────────────────┘                               │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Have a coupon code?  [________________] [Apply]                        ││
│  │ ✓ AGENT-SMITH50 applied: 50% off credit courses                        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                                              Subtotal:        $3,100.00 CAD │
│                                              Discount (50%):  -$1,500.00    │
│                                              ─────────────────────────────  │
│                                              TOTAL:           $1,600.00 CAD │
│                                                                              │
│                                              [Proceed to Checkout →]        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 2: Parent & Student Details

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT                                           Step 2 of 4: Details    │
│  ━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━●○○                               │
│  Cart              Details              Payment         Confirmation        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PARENT/GUARDIAN INFORMATION (Account Holder)                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  First Name *              Last Name *                                 ││
│  │  [________________]        [________________]                           ││
│  │                                                                        ││
│  │  Email *                   Phone *                                     ││
│  │  [________________]        [________________]                           ││
│  │                                                                        ││
│  │  Country *                 Province/State                              ││
│  │  [Canada          ▼]       [Ontario        ▼]                          ││
│  │                                                                        ││
│  │  ☐ Create an account to track enrollment and progress                  ││
│  │    Password: [________________]  Confirm: [________________]           ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  STUDENT INFORMATION                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Student 1 (for MHF4U, Grade 12 Math Practice)                         ││
│  │  First Name *              Last Name *                                 ││
│  │  [________________]        [________________]                           ││
│  │                                                                        ││
│  │  Date of Birth *           Current Grade                               ││
│  │  [__/__/____]              [12            ▼]                           ││
│  │                                                                        ││
│  │  Previous School (optional)                                            ││
│  │  [________________________________________________]                    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Student 2 (for Grade 3 Math Foundations)                              ││
│  │  First Name *              Last Name *                                 ││
│  │  [________________]        [________________]                           ││
│  │                                                                        ││
│  │  Date of Birth *           Current Grade                               ││
│  │  [__/__/____]              [3             ▼]                           ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [← Back to Cart]                            [Continue to Payment →]        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 3: Payment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CHECKOUT                                           Step 3 of 4: Payment    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━○            │
│  Cart              Details              Payment         Confirmation        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────┐  ┌────────────────────────────────────────┐│
│  │                             │  │  ORDER SUMMARY                         ││
│  │  SELECT PAYMENT METHOD      │  │  ─────────────────────────────────────  ││
│  │                             │  │                                        ││
│  │  ○ Credit/Debit Card        │  │  MHF4U (Credit)           $3,000.00   ││
│  │    [VISA] [MC]              │  │    ✓ Grade 12 Math Practice    FREE   ││
│  │                             │  │  Grade 3 Math (Non-credit)   $100.00   ││
│  │  ○ Flywire                  │  │                                        ││
│  │    International payments   │  │  Subtotal                  $3,100.00   ││
│  │    Bank transfer, Alipay    │  │  Discount (AGENT-SMITH50) -$1,500.00   ││
│  │                             │  │  ─────────────────────────────────────  ││
│  └─────────────────────────────┘  │  TOTAL                     $1,600.00   ││
│                                   │                                 CAD    ││
│  ┌─────────────────────────────┐  │                                        ││
│  │  CARD DETAILS               │  │  Agent: SMITH (Commission: $62)       ││
│  │                             │  └────────────────────────────────────────┘│
│  │  Card Number                │                                            │
│  │  [____-____-____-____]      │  ┌────────────────────────────────────────┐│
│  │                             │  │  ☑ I agree to the Terms of Service    ││
│  │  Expiry        CVV          │  │    and Privacy Policy                 ││
│  │  [__/__]       [___]        │  │                                        ││
│  │                             │  │  ☑ I understand non-credit courses    ││
│  │  Name on Card               │  │    do not include assessments or      ││
│  │  [_____________________]    │  │    OSSD credit                        ││
│  │                             │  └────────────────────────────────────────┘│
│  │  ☐ Save card for future     │                                            │
│  └─────────────────────────────┘                                            │
│                                                                              │
│  🔒 Secure payment. Your card details are encrypted.                        │
│                                                                              │
│  [← Back]                                     [Pay $1,600.00 CAD →]         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step 3b: Flywire Flow (If Selected)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FLYWIRE INTERNATIONAL PAYMENT                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  You will be redirected to Flywire to complete your payment.                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Payment Amount: $1,600.00 CAD                                         ││
│  │  Payable to: Excellence Maple Canadian School Inc.                     ││
│  │  Reference: ORD-2025-00123                                             ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Available payment methods on Flywire:                                       │
│  • Bank Transfer                                                             │
│  • Alipay                                                                    │
│  • WeChat Pay                                                                │
│  • Credit Card (international)                                               │
│                                                                              │
│  [← Choose Different Method]               [Continue to Flywire →]          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

[User redirects to Flywire → Completes payment → Returns to EMCS confirmation]
```

### Step 4: Confirmation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ✓ PAYMENT SUCCESSFUL                       Step 4 of 4: Confirmation       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                        ┌─────────────────────┐                               │
│                        │         ✓           │                               │
│                        │    Thank you!       │                               │
│                        │  Order #ORD-00123   │                               │
│                        └─────────────────────┘                               │
│                                                                              │
│  A confirmation email has been sent to parent@email.com                      │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  WHAT'S NEXT?                                                          ││
│  │                                                                        ││
│  │  For CREDIT Courses (MHF4U):                                           ││
│  │  1. Check email for Zoom class schedule and link                       ││
│  │  2. Join orientation session within 48 hours                           ││
│  │  3. Meet your certified teacher                                        ││
│  │  4. Access course materials in the student portal                      ││
│  │                                                                        ││
│  │  For NON-CREDIT Courses (Grade 3 Math, Grade 12 Math Practice):        ││
│  │  1. Log in to the student portal                                       ││
│  │  2. Start learning immediately - courses are self-paced                ││
│  │  3. Track progress in your dashboard                                   ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  ORDER RECEIPT                                              [Print]    ││
│  │  ─────────────────────────────────────────────────────────────────     ││
│  │  Order Date: January 2, 2025                                           ││
│  │  Order Number: ORD-2025-00123                                          ││
│  │  Payment Method: Visa ****4242                                         ││
│  │                                                                        ││
│  │  Items:                                                                ││
│  │    Advanced Functions (MHF4U) - Credit       $3,000.00                 ││
│  │    Grade 12 Math Practice - BONUS                 FREE                 ││
│  │    Grade 3 Math Foundations                    $100.00                 ││
│  │                                                                        ││
│  │  Subtotal:                                   $3,100.00                 ││
│  │  Discount (AGENT-SMITH50):                  -$1,500.00                 ││
│  │  ─────────────────────────────────────────────────────────────────     ││
│  │  Total Paid:                                 $1,600.00 CAD             ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [Go to Student Dashboard]              [Browse More Courses]               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Analytics Events

```javascript
// Analytics events fired at each checkout step
const CHECKOUT_EVENTS = {
  // Cart events
  'view_cart': { step: 0, trigger: 'Cart page viewed' },
  'add_to_cart': { step: 0, trigger: 'Item added to cart' },
  'remove_from_cart': { step: 0, trigger: 'Item removed from cart' },
  'apply_coupon': { step: 0, trigger: 'Coupon code applied' },

  // Checkout events
  'begin_checkout': { step: 1, trigger: 'Proceed to checkout clicked' },
  'add_shipping_info': { step: 2, trigger: 'Details form completed' },
  'add_payment_info': { step: 3, trigger: 'Payment method selected' },
  'purchase': { step: 4, trigger: 'Payment successful' },

  // Error events
  'checkout_error': { trigger: 'Payment failed or validation error' },
  'coupon_error': { trigger: 'Invalid or expired coupon' },
};
```

---

# F) INTERACTIVE ACTIVITY SPEC (JSON) + GRADE-1 MATH SAMPLES

## Activity Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://emcs.ca/schemas/activity.json",
  "title": "Interactive Activity Schema",
  "description": "Schema for IXL-style interactive learning activities",
  "type": "object",
  "required": [
    "activityId",
    "grade",
    "subject",
    "topic",
    "type",
    "prompt",
    "answer",
    "feedback"
  ],
  "properties": {
    "activityId": {
      "type": "string",
      "pattern": "^ACT-[A-Z0-9]{8}$"
    },
    "grade": {
      "type": "string",
      "enum": ["K", "1", "2", "3", "4", "5"]
    },
    "subject": {
      "type": "string",
      "enum": ["Math", "Science", "English"]
    },
    "topic": {
      "type": "string",
      "description": "Curriculum topic/strand"
    },
    "skill": {
      "type": "string",
      "description": "Specific skill being practiced"
    },
    "difficulty": {
      "type": "string",
      "enum": ["easy", "medium", "hard"],
      "default": "medium"
    },
    "type": {
      "type": "string",
      "enum": [
        "multipleChoice",
        "numericInput",
        "dragAndDrop",
        "matching",
        "fillInBlank",
        "trueFalse",
        "sequencing",
        "counting",
        "selectAll"
      ]
    },
    "prompt": {
      "type": "object",
      "required": ["text"],
      "properties": {
        "text": {
          "type": "string",
          "description": "Main question text"
        },
        "subtext": {
          "type": "string",
          "description": "Additional instructions"
        },
        "voiceover": {
          "type": "boolean",
          "default": true,
          "description": "Enable text-to-speech for young learners"
        }
      }
    },
    "media": {
      "type": "object",
      "properties": {
        "image": {
          "type": "string",
          "format": "uri",
          "description": "Main illustration"
        },
        "imageAlt": {
          "type": "string",
          "description": "Accessible alt text"
        },
        "audio": {
          "type": "string",
          "format": "uri",
          "description": "Audio prompt or narration"
        },
        "animation": {
          "type": "string",
          "format": "uri",
          "description": "Lottie or GIF animation"
        },
        "video": {
          "type": "string",
          "format": "uri"
        }
      }
    },
    "choices": {
      "type": "array",
      "description": "For multiple choice questions",
      "items": {
        "type": "object",
        "required": ["value", "display"],
        "properties": {
          "value": {
            "type": ["string", "number"]
          },
          "display": {
            "type": "string",
            "description": "What user sees (can include emoji/image ref)"
          },
          "image": {
            "type": "string",
            "format": "uri"
          }
        }
      }
    },
    "answer": {
      "oneOf": [
        { "type": "string" },
        { "type": "number" },
        {
          "type": "array",
          "items": { "type": ["string", "number"] }
        },
        {
          "type": "object",
          "description": "For complex answers like matching pairs"
        }
      ],
      "description": "Correct answer(s)"
    },
    "acceptedAnswers": {
      "type": "array",
      "items": { "type": ["string", "number"] },
      "description": "Alternative acceptable answers"
    },
    "validation": {
      "type": "object",
      "properties": {
        "caseSensitive": { "type": "boolean", "default": false },
        "trimWhitespace": { "type": "boolean", "default": true },
        "numericTolerance": { "type": "number", "default": 0 }
      }
    },
    "feedback": {
      "type": "object",
      "required": ["correct", "incorrect"],
      "properties": {
        "correct": {
          "type": "object",
          "required": ["text"],
          "properties": {
            "text": { "type": "string" },
            "animation": { "type": "string", "enum": ["stars", "confetti", "thumbsUp", "checkmark"] },
            "sound": { "type": "string", "format": "uri" },
            "encouragement": {
              "type": "array",
              "items": { "type": "string" },
              "description": "Random encouraging messages"
            }
          }
        },
        "incorrect": {
          "type": "object",
          "required": ["text"],
          "properties": {
            "text": { "type": "string" },
            "hint": { "type": "string" },
            "showCorrectAfter": {
              "type": "integer",
              "default": 2,
              "description": "Show correct answer after N attempts"
            },
            "encouragement": {
              "type": "array",
              "items": { "type": "string" }
            }
          }
        },
        "partialCredit": {
          "type": "object",
          "properties": {
            "enabled": { "type": "boolean" },
            "text": { "type": "string" }
          }
        }
      }
    },
    "accessibility": {
      "type": "object",
      "properties": {
        "screenReaderText": { "type": "string" },
        "keyboardNavigable": { "type": "boolean", "default": true },
        "highContrastMode": { "type": "boolean", "default": true }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "ontarioCurriculum": {
          "type": "string",
          "description": "Ontario curriculum expectation code"
        },
        "estimatedTime": {
          "type": "integer",
          "description": "Expected seconds to complete"
        },
        "tags": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  }
}
```

## Grade 1 Math Activity Samples

### Sample 1: Counting Objects (Fire Trucks)

```json
{
  "activityId": "ACT-G1MATH001",
  "grade": "1",
  "subject": "Math",
  "topic": "Number Sense and Numeration",
  "skill": "Counting objects to 10",
  "difficulty": "easy",
  "type": "multipleChoice",
  "prompt": {
    "text": "How many fire trucks are there?",
    "subtext": "Count the fire trucks carefully.",
    "voiceover": true
  },
  "media": {
    "image": "/assets/activities/g1/counting/firetrucks-3.png",
    "imageAlt": "Three red fire trucks in a row",
    "animation": "/assets/animations/sparkle-hint.json"
  },
  "choices": [
    { "value": 1, "display": "1" },
    { "value": 2, "display": "2" },
    { "value": 3, "display": "3" },
    { "value": 4, "display": "4" }
  ],
  "answer": 3,
  "feedback": {
    "correct": {
      "text": "Great job! There are 3 fire trucks!",
      "animation": "stars",
      "sound": "/assets/sounds/success-chime.mp3",
      "encouragement": [
        "You're a counting superstar!",
        "Excellent counting!",
        "You got it right!"
      ]
    },
    "incorrect": {
      "text": "Not quite. Try counting again!",
      "hint": "Point to each fire truck as you count: 1, 2, 3...",
      "showCorrectAfter": 2,
      "encouragement": [
        "Keep trying!",
        "You can do it!",
        "Let's count together!"
      ]
    }
  },
  "accessibility": {
    "screenReaderText": "Image shows three red fire trucks. Question: How many fire trucks are there? Options: 1, 2, 3, or 4.",
    "keyboardNavigable": true,
    "highContrastMode": true
  },
  "metadata": {
    "ontarioCurriculum": "B1.1",
    "estimatedTime": 30,
    "tags": ["counting", "numbers-to-10", "vehicles"]
  }
}
```

### Sample 2: Addition with Pictures (Apples)

```json
{
  "activityId": "ACT-G1MATH002",
  "grade": "1",
  "subject": "Math",
  "topic": "Number Sense and Numeration",
  "skill": "Addition to 10",
  "difficulty": "medium",
  "type": "numericInput",
  "prompt": {
    "text": "There are 2 red apples and 3 green apples. How many apples are there in all?",
    "subtext": "Type your answer in the box.",
    "voiceover": true
  },
  "media": {
    "image": "/assets/activities/g1/addition/apples-2-plus-3.png",
    "imageAlt": "Two red apples on the left and three green apples on the right",
    "animation": "/assets/animations/apples-combine.json"
  },
  "choices": null,
  "answer": 5,
  "acceptedAnswers": [5, "5", "five", "Five"],
  "validation": {
    "caseSensitive": false,
    "trimWhitespace": true,
    "numericTolerance": 0
  },
  "feedback": {
    "correct": {
      "text": "Fantastic! 2 + 3 = 5. There are 5 apples altogether!",
      "animation": "confetti",
      "sound": "/assets/sounds/celebration.mp3",
      "encouragement": [
        "You're an addition expert!",
        "Super math skills!",
        "That's exactly right!"
      ]
    },
    "incorrect": {
      "text": "That's not quite right. Let's count together!",
      "hint": "Start with the red apples (2), then count on with the green apples: 3, 4, 5!",
      "showCorrectAfter": 3,
      "encouragement": [
        "Almost there!",
        "Try counting all the apples!",
        "Don't give up!"
      ]
    }
  },
  "accessibility": {
    "screenReaderText": "Image shows 2 red apples and 3 green apples. Question: How many apples are there in all? Enter a number.",
    "keyboardNavigable": true,
    "highContrastMode": true
  },
  "metadata": {
    "ontarioCurriculum": "B2.1",
    "estimatedTime": 45,
    "tags": ["addition", "numbers-to-10", "combining", "fruit"]
  }
}
```

### Sample 3: Comparing Numbers (More/Less)

```json
{
  "activityId": "ACT-G1MATH003",
  "grade": "1",
  "subject": "Math",
  "topic": "Number Sense and Numeration",
  "skill": "Comparing quantities",
  "difficulty": "medium",
  "type": "multipleChoice",
  "prompt": {
    "text": "Which group has MORE stars?",
    "subtext": "Look at both groups and pick the one with more.",
    "voiceover": true
  },
  "media": {
    "image": "/assets/activities/g1/comparing/stars-4-vs-7.png",
    "imageAlt": "Group A shows 4 yellow stars. Group B shows 7 yellow stars."
  },
  "choices": [
    {
      "value": "A",
      "display": "Group A",
      "image": "/assets/activities/g1/comparing/group-a-4stars.png"
    },
    {
      "value": "B",
      "display": "Group B",
      "image": "/assets/activities/g1/comparing/group-b-7stars.png"
    }
  ],
  "answer": "B",
  "feedback": {
    "correct": {
      "text": "You're right! Group B has MORE stars. 7 is more than 4!",
      "animation": "thumbsUp",
      "sound": "/assets/sounds/ding.mp3",
      "encouragement": [
        "Great comparing!",
        "You know your numbers!",
        "Super work!"
      ]
    },
    "incorrect": {
      "text": "Hmm, let's look again.",
      "hint": "Count the stars in each group. Group A has 4 stars. Group B has 7 stars. Which number is bigger?",
      "showCorrectAfter": 2,
      "encouragement": [
        "Count carefully!",
        "Which number is bigger?",
        "You've got this!"
      ]
    }
  },
  "accessibility": {
    "screenReaderText": "Two groups of stars. Group A has 4 stars. Group B has 7 stars. Question: Which group has more stars?",
    "keyboardNavigable": true,
    "highContrastMode": true
  },
  "metadata": {
    "ontarioCurriculum": "B1.3",
    "estimatedTime": 40,
    "tags": ["comparing", "more-less", "counting", "quantities"]
  }
}
```

---

# G) ACCESSIBILITY / SEO / PERFORMANCE CHECKLIST

## Accessibility (WCAG 2.2 AA)

### Keyboard Navigation
- [ ] All interactive elements accessible via keyboard (Tab, Enter, Space, Arrow keys)
- [ ] Visible focus indicators on all focusable elements (minimum 2px outline)
- [ ] Skip links at page top ("Skip to main content")
- [ ] Logical tab order follows visual reading order
- [ ] No keyboard traps - users can always navigate away
- [ ] Modal dialogs trap focus and return focus on close
- [ ] Dropdown menus navigable with arrow keys

### Screen Reader Support
- [ ] All images have meaningful alt text (decorative images: alt="")
- [ ] Form inputs have associated labels (explicit or aria-labelledby)
- [ ] Error messages programmatically associated with fields (aria-describedby)
- [ ] Live regions for dynamic content (aria-live="polite" for cart updates)
- [ ] Page landmarks defined (nav, main, aside, footer)
- [ ] Heading hierarchy is logical (h1 → h2 → h3, no skipped levels)
- [ ] ARIA roles for custom components (tabs, accordions, modals)
- [ ] Tables have proper headers (th with scope attribute)

### Visual Design
- [ ] Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text
- [ ] Credit vs Non-credit differentiation NOT solely by color (use badges, text)
- [ ] Text resizable to 200% without loss of content
- [ ] No content conveyed by color alone (form errors, status indicators)
- [ ] Focus indicators visible in both light and dark modes
- [ ] Touch targets minimum 44x44 pixels on mobile

### Forms & Interactions
- [ ] Clear error identification with suggestions for correction
- [ ] Success/error states announced to screen readers
- [ ] Required fields marked with visual indicator AND aria-required
- [ ] Autocomplete attributes on appropriate fields (name, email, cc)
- [ ] Timeout warnings with option to extend (checkout sessions)

### Interactive Activities (Grades K-5)
- [ ] Audio descriptions available for visual content
- [ ] Voiceover support for all prompts and feedback
- [ ] Alternative input methods for drag-and-drop (click to select)
- [ ] Pause/stop controls for animations
- [ ] Simple, clear language appropriate to grade level

## SEO Optimization

### Technical SEO
- [ ] Unique, descriptive title tags (max 60 characters)
  - Pattern: `{Course Name} | {Grade} | EMCS {Credit/Non-credit}`
- [ ] Meta descriptions (max 160 characters) with call-to-action
- [ ] Canonical URLs for all pages
- [ ] XML sitemap generated and submitted
- [ ] robots.txt properly configured
- [ ] SSL certificate installed (HTTPS only)
- [ ] 301 redirects for any changed URLs

### Structured Data (Schema.org)
- [ ] Course schema on course detail pages
  ```json
  {
    "@type": "Course",
    "name": "Advanced Functions (MHF4U)",
    "provider": { "@type": "Organization", "name": "EMCS" },
    "courseCode": "MHF4U",
    "educationalLevel": "Grade 12"
  }
  ```
- [ ] Product schema for pricing
- [ ] Organization schema on about page
- [ ] BreadcrumbList schema on all pages
- [ ] FAQ schema on FAQ pages

### Content SEO
- [ ] One h1 per page matching page purpose
- [ ] Descriptive URL slugs (`/credit/grade-12/math/mhf4u`)
- [ ] Internal linking between related courses
- [ ] Image filenames descriptive (`grade-12-advanced-functions.jpg`)
- [ ] Image dimensions specified (prevent layout shift)

### Performance SEO
- [ ] Core Web Vitals passing (LCP, CLS, INP)
- [ ] Mobile-friendly design (Google Mobile-Friendly Test)
- [ ] Page load under 3 seconds on 3G connection

## Performance Budgets

### Core Web Vitals Targets
| Metric | Target | Warning | Poor |
|--------|--------|---------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| FCP (First Contentful Paint) | ≤ 1.8s | ≤ 3.0s | > 3.0s |
| TTFB (Time to First Byte) | ≤ 800ms | ≤ 1.8s | > 1.8s |

### Resource Budgets
| Resource | Budget |
|----------|--------|
| Total page weight (initial) | ≤ 1.5 MB |
| JavaScript bundle | ≤ 300 KB (gzipped) |
| CSS bundle | ≤ 100 KB (gzipped) |
| Hero image | ≤ 200 KB |
| Total images per page | ≤ 500 KB |
| Web fonts | ≤ 100 KB |

### Optimization Checklist
- [ ] Images optimized (WebP with fallbacks, srcset for responsive)
- [ ] Lazy loading for below-fold images
- [ ] Critical CSS inlined in head
- [ ] Non-critical CSS loaded async
- [ ] JavaScript code-split by route
- [ ] Third-party scripts loaded async/defer
- [ ] Font display: swap for web fonts
- [ ] Preload critical resources
- [ ] Service worker for repeat visits
- [ ] CDN for static assets
- [ ] Gzip/Brotli compression enabled
- [ ] HTTP/2 enabled
- [ ] Browser caching headers configured

### Monitoring
- [ ] Google Search Console connected
- [ ] Real User Monitoring (RUM) implemented
- [ ] Lighthouse CI in deployment pipeline
- [ ] Core Web Vitals alerts configured

---

# H) ACCEPTANCE TESTS (Given/When/Then)

## Navigation Tests

### Test 1: Storefront Navigation - Credit
```gherkin
Feature: Credit Course Navigation

Scenario: Navigate to Grade 12 Credit Courses
  Given I am on the Home page
  When I click on "Credit" in the top navigation
  And I click on "Grade 12" tab
  Then I should see "Complete Grade 12 Program" bundle card
  And I should see subject tabs: Math, Science, English
  And I should see individual credit courses including:
    | Course Code | Course Name        |
    | MHF4U       | Advanced Functions |
    | MCV4U       | Calculus & Vectors |
    | ENG4U       | Grade 12 English   |
    | SBI4U       | Grade 12 Biology   |
  And each course should display an "Ontario Credit" badge
  And the page header should use the Credit color (#F2C94C)
```

### Test 2: Storefront Navigation - Non-credit
```gherkin
Feature: Non-credit Course Navigation

Scenario: Navigate to Grade 3 Non-credit Courses
  Given I am on the Home page
  When I click on "Non-credit" in the top navigation
  And I click on "Grade 3" tab
  And I click on "Math" subject tab
  Then I should see "Complete Grade 3 Program" bundle option
  And I should see Grade 3 Math courses
  And each course should display disclaimer text:
    | "No tests, no assessments, no report card, no OSSD credit" |
  And the page header should use the Non-credit color (#2F80ED)
```

### Test 3: Interactive Activity Access
```gherkin
Feature: Interactive Math Activity

Scenario: Open Grade 1 counting activity
  Given I am on Non-credit > Grade 1 > Math page
  When I click on a counting activity titled "Count the Fire Trucks"
  Then I should see:
    | Element           | Content                              |
    | Question text     | "How many fire trucks are there?"    |
    | Illustration      | Image of fire trucks                 |
    | Answer choices    | 1, 2, 3, 4                           |
  And the illustration should have alt text for accessibility
  And a voiceover/audio button should be available

Scenario: Submit correct answer
  Given I am viewing the counting activity
  When I select answer "3"
  Then I should see positive feedback "Great job! There are 3 fire trucks!"
  And I should see a celebration animation
  And my progress should be recorded

Scenario: Submit incorrect answer
  Given I am viewing the counting activity
  When I select answer "2"
  Then I should see encouraging feedback "Not quite. Try counting again!"
  And I should see a hint after 2 incorrect attempts
  And I should be able to try again
```

## Course Detail Tests

### Test 4: Credit Course Page Content
```gherkin
Feature: Credit Course Detail Page

Scenario: View MHF4U course details
  Given I am on the course detail page for MHF4U
  Then I should see all required sections:
    | Section              | Required Content                                    |
    | Title                | "Advanced Functions"                                |
    | Course Code          | "MHF4U"                                             |
    | Credit Badge         | "Ontario Credit"                                    |
    | Prerequisites        | "MCR3U, Grade 11 Functions"                         |
    | Overview             | Course description (100-500 words)                  |
    | Learning Outcomes    | At least 3 bullet points                            |
    | Units/Outline        | List of 5-6 units with hours                        |
    | Delivery Method      | "Live online (Zoom)"                                |
    | Schedule             | "6 hours/week, 3 days × 2 hours"                    |
    | Price                | "$3,000 CAD"                                        |
  And I should see CTAs: "Add to Cart", "Buy Now"
  And I should NOT see "This is a non-credit course" disclaimer
```

### Test 5: Non-credit Course Page Content
```gherkin
Feature: Non-credit Course Detail Page

Scenario: View Grade 3 Math non-credit course details
  Given I am on the course detail page for NC-G3-MATH-101
  Then I should see the required disclaimer prominently:
    | "This is a non-credit course. No tests, no assessments, no report card, no OSSD credit." |
  And I should see:
    | Field             | Value                        |
    | Delivery          | "Self-paced"                 |
    | Price (list)      | "$250 CAD" (strikethrough)   |
    | Price (actual)    | "$100 CAD"                   |
  And I should see CTAs: "Add to Cart", "Buy Now"
  And I should NOT see "Ontario Credit" badge
  And I should NOT see schedule information
```

## E-commerce & Bundle Tests

### Test 6: Credit Course Bundle Inclusion
```gherkin
Feature: Credit Course Auto-Bundle

Scenario: Credit course automatically includes related non-credit
  Given I have added "MHF4U (Credit)" to my cart
  When I view my cart
  Then I should see 2 line items:
    | Item                              | Price         |
    | Advanced Functions (MHF4U)        | $3,000.00     |
    | Grade 12 Math Practice (FREE)     | $0.00         |
  And the bonus item should show "Included with credit purchase"
  And the cart total should be $3,000.00

Scenario: Credit bundle item cannot be removed independently
  Given I have "MHF4U" with bundled "Grade 12 Math Practice" in cart
  When I try to remove "Grade 12 Math Practice"
  Then I should see message "This item is included free with your credit course"
  And the item should remain in cart
```

### Test 7: Non-credit to Credit Upgrade
```gherkin
Feature: Course Upgrade Path

Scenario: Upgrade non-credit to credit (already purchased)
  Given I have previously purchased "Grade 11 Math Practice (Non-credit)"
  And I am logged in to my account
  When I visit the Grade 11 Credit Math course page
  Then I should see "Upgrade to Credit" button
  And the upgrade price should be "$350" (not full $3,000)

  When I click "Upgrade to Credit"
  Then my cart should show:
    | Item                        | Price    |
    | Credit Upgrade: MCR3U       | $350.00  |
  And I should see note: "Your previous purchase credited"

Scenario: Prevent double-charging on upgrade
  Given I have "Grade 11 Math Practice" ($100) in cart
  And I have "MCR3U Credit Upgrade" ($350) in cart
  Then the system should warn "You already have the non-credit version in cart"
  And suggest removing the non-credit item
  And total should NOT include both full prices
```

## Coupon & Payment Tests

### Test 8: Coupon Application
```gherkin
Feature: Coupon System

Scenario: Apply valid agent discount code
  Given I have "MHF4U" ($3,000) in my cart
  When I enter coupon code "AGENT-SMITH50"
  And I click "Apply"
  Then the coupon should be accepted
  And I should see discount: "-$1,500.00 (50% off)"
  And the new total should be "$1,500.00"
  And the agent "SMITH" should be recorded for commission

Scenario: Apply expired coupon
  Given I have items in my cart
  When I enter an expired coupon code "WINTER2024"
  And I click "Apply"
  Then I should see error: "This coupon has expired"
  And the cart total should remain unchanged

Scenario: Attempt to stack coupons
  Given I have applied coupon "PROMO-SAVE40"
  When I try to apply another coupon "AGENT-SMITH50"
  Then I should see message: "Only one coupon can be used per order"
  And I should be offered to replace the existing coupon
```

### Test 9: Card Payment Success
```gherkin
Feature: Credit Card Payment

Scenario: Successful card payment
  Given I have completed checkout steps 1-2 (cart, details)
  And I am on the payment step
  When I select "Credit/Debit Card"
  And I enter valid card details:
    | Field        | Value                |
    | Card Number  | 4242 4242 4242 4242  |
    | Expiry       | 12/26                |
    | CVV          | 123                  |
    | Name         | John Parent          |
  And I check "I agree to Terms of Service"
  And I click "Pay $1,600.00 CAD"
  Then the payment should process successfully
  And I should see confirmation page with:
    | Order number         | ORD-2025-XXXXX |
    | Items purchased      | Listed         |
    | Total paid           | $1,600.00 CAD  |
    | Next steps           | Displayed      |
  And I should receive confirmation email
  And enrollments should be created for purchased courses

Scenario: Card payment failure
  Given I am on the payment step
  When I enter card with insufficient funds
  And I click "Pay"
  Then I should see error: "Payment declined. Please try a different card."
  And the order should NOT be created
  And I should remain on the payment page
```

### Test 10: Flywire Payment Flow
```gherkin
Feature: Flywire International Payment

Scenario: Complete Flywire payment
  Given I am on the payment step
  When I select "Flywire"
  And I click "Continue to Flywire"
  Then I should be redirected to Flywire portal
  And the order reference should be passed to Flywire

  When I complete payment on Flywire
  And I am redirected back to EMCS
  Then I should see the confirmation page
  And the order status should be "Paid"
  And enrollments should be created

Scenario: Flywire payment cancelled
  Given I was redirected to Flywire
  When I cancel and return to EMCS
  Then I should return to the payment step
  And my cart should still contain all items
  And I should be able to select a different payment method
```

## Receipt & Enrollment Tests

### Test 11: Receipt Generation
```gherkin
Feature: Order Receipt

Scenario: View and print receipt
  Given I have completed a purchase
  When I view the confirmation page
  Then I should see a printable receipt containing:
    | Field           | Value                                    |
    | Order Date      | Current date                             |
    | Order Number    | ORD-YYYY-NNNNN                           |
    | Buyer Name      | Parent name                              |
    | Student Name(s) | Listed                                   |
    | Items           | All purchased courses with prices        |
    | Discounts       | Applied coupon details                   |
    | Total Paid      | Final amount in CAD                      |
    | Payment Method  | Last 4 digits of card or "Flywire"       |
  And I should be able to download as PDF
  And receipt should be sent to email
```

### Test 12: Responsive Design
```gherkin
Feature: Responsive Layout

Scenario Outline: Pages render correctly at breakpoints
  Given I am viewing <page>
  When I resize the viewport to <width>px
  Then the layout should adapt without horizontal scroll
  And all content should remain accessible
  And navigation should be usable (hamburger menu on mobile)
  And CTAs should be tappable (min 44x44px)

  Examples:
    | page               | width |
    | Home               | 320   |
    | Home               | 768   |
    | Home               | 1024  |
    | Home               | 1440  |
    | Credit/Grade 12    | 320   |
    | Course Detail      | 375   |
    | Cart               | 768   |
    | Checkout           | 1024  |
```

---

# I) RELEASE PLAN & CUT-SCOPE OPTIONS

## Timeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RELEASE TIMELINE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  NOW ────────────────────────────────────────────────────────────────────▶  │
│   │                                                                          │
│   │  JAN 2-4: Sprint 0 - Setup & Foundation                                 │
│   │  ├─ Finalize IA and nav config                                          │
│   │  ├─ Set up routing structure                                            │
│   │  ├─ Create grade page template                                          │
│   │  └─ Implement storefront toggle                                         │
│   │                                                                          │
│   ▼                                                                          │
│  JAN 5 ──────────────────────────────────────── MVP MILESTONE               │
│   │  DELIVERABLES:                                                           │
│   │  ✓ Two-storefront navigation (Credit/Non-credit)                        │
│   │  ✓ Grade browsing pages (all grades)                                    │
│   │  ✓ Subject tabs (Math/Science/English)                                  │
│   │  ✓ Course detail page template                                          │
│   │  ✓ Cart functionality                                                   │
│   │  ✓ Checkout flow (card + Flywire)                                       │
│   │  ✓ Coupon system                                                        │
│   │  ✓ Agent tracking skeleton                                              │
│   │                                                                          │
│   │  JAN 6-12: Content & Polish Sprint                                      │
│   │  ├─ Populate course content (all grades)                                │
│   │  ├─ Unit/topic curriculum mapping                                       │
│   │  ├─ Copy finalization                                                   │
│   │  ├─ QA testing                                                          │
│   │  └─ Bug fixes                                                           │
│   │                                                                          │
│   ▼                                                                          │
│  JAN 15 ─────────────────────────────────────── LAUNCH MILESTONE            │
│   │  DELIVERABLES:                                                           │
│   │  ✓ All course content populated                                         │
│   │  ✓ Copy finalized and translated                                        │
│   │  ✓ Full QA pass completed                                               │
│   │  ✓ Analytics events firing                                              │
│   │  ✓ Production deployment                                                │
│   │                                                                          │
│   │  DEMO (This Friday): Interactive Activities                             │
│   │  ├─ 1-3 Grade 1 Math activities working                                 │
│   │  ├─ Counting objects activity                                           │
│   │  ├─ Addition with pictures activity                                     │
│   │  └─ Comparing numbers activity                                          │
│   │                                                                          │
│   ▼                                                                          │
│  POST-LAUNCH (Backlog)                                                       │
│   ├─ School membership product                                               │
│   ├─ User dashboard & progress tracking                                      │
│   ├─ Expanded activity library (all grades)                                  │
│   ├─ Teacher portal                                                          │
│   └─ Mobile app consideration                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## MVP Scope (Jan 5)

### Must Have (P0)
| Feature | Description | Status |
|---------|-------------|--------|
| Dual Storefront Nav | Credit/Non-credit top-level navigation | To Do |
| Grade Pages | All grades (K-12 Non-credit, 9-12 Credit) | To Do |
| Subject Tabs | Math, Science, English filtering | To Do |
| Course Detail Template | Display all course information | To Do |
| Bundle Card | "Complete Grade X Program" | To Do |
| Credit Badge | Ontario Credit indicator | To Do |
| Non-credit Disclaimer | Required disclaimer text | To Do |
| Shopping Cart | Add/remove items, quantity | To Do |
| Cart Auto-Bundle | Credit → includes free non-credit | To Do |
| Basic Checkout | 4-step flow | To Do |
| Card Payment | Visa/Mastercard integration | To Do |
| Flywire Integration | International payments | To Do |
| Coupon System | Apply/validate discount codes | To Do |
| Agent Tracking | Record agent codes on orders | To Do |
| Order Confirmation | Receipt and next steps | To Do |
| Mobile Responsive | All pages work on mobile | To Do |

### Should Have (P1) - Target for Launch (Jan 15)
| Feature | Description | Status |
|---------|-------------|--------|
| Full Course Content | All courses populated | To Do |
| Curriculum Mapping | Ontario curriculum references | To Do |
| i18n Updates | Vietnamese translations | To Do |
| Analytics Events | GA4 e-commerce tracking | To Do |
| Email Confirmations | Automated order emails | To Do |
| SEO Optimization | Meta tags, schema.org | To Do |
| Accessibility Audit | WCAG 2.2 AA compliance | To Do |
| Performance Tuning | Meet Core Web Vitals | To Do |

### Demo Feature (Friday)
| Feature | Description | Status |
|---------|-------------|--------|
| Activity Framework | Interactive activity component | To Do |
| Grade 1 Activity 1 | Counting fire trucks | To Do |
| Grade 1 Activity 2 | Addition with apples | To Do |
| Grade 1 Activity 3 | Comparing star groups | To Do |
| Feedback System | Correct/incorrect responses | To Do |
| Voiceover Support | Audio for young learners | To Do |

## Cut-Scope Options (If Needed)

### Can Defer Without Blocking Launch
| Feature | Reason Safe to Defer | Alternative |
|---------|---------------------|-------------|
| School Membership | New product, not in current flow | Add post-launch |
| User Dashboard | Can use email confirmation initially | Phase 2 |
| Progress Tracking | Non-credit doesn't require it | Add for credit students |
| Interactive Activities (beyond demo) | Core purchase flow works without | Add activities incrementally |
| Teacher Portal | Internal tool, not customer-facing | Spreadsheet interim |
| Mobile App | Web works on mobile | Consider after launch |

### Risk Mitigation if Behind Schedule

**Jan 3 Checkpoint:**
- If cart/checkout not ready: Focus 100% on payment flow
- Skip bundle auto-add, do manually in cart

**Jan 4 Checkpoint:**
- If Flywire not ready: Launch with card-only, add Flywire week 2
- If coupon system complex: Support single-use codes only

**Jan 10 Checkpoint (for Jan 15):**
- If content not complete: Launch with Grade 9-12 only, add elementary grades
- If translations incomplete: Launch English-only, add Vietnamese post-launch

## Post-Launch Backlog (Prioritized)

### Phase 2 (Q1 2025)
1. **User Dashboard** - View enrollments, track progress
2. **Interactive Activity Library** - Expand to all elementary grades
3. **Email Marketing** - Abandoned cart, course recommendations
4. **Advanced Analytics** - Conversion funnels, A/B testing

### Phase 3 (Q2 2025)
1. **School Membership** - Bulk pricing, admin portal
2. **Teacher Tools** - Grade management, student tracking
3. **Certificate Generation** - Completion certificates
4. **API Integrations** - External LMS connections

### Future Considerations
- Mobile native app (iOS/Android)
- Live tutoring marketplace
- Parent mobile app for progress notifications
- AI-powered learning recommendations

---

# J) COPY BLOCKS & UI TEXT

## Credit vs Non-credit Differentiation Copy

### Homepage Storefront Selector
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│    ┌───────────────────────────┐     ┌───────────────────────────┐          │
│    │      NON-CREDIT           │     │        CREDIT             │          │
│    │  ━━━━━━━━━━━━━━━━━━━━━   │     │  ━━━━━━━━━━━━━━━━━━━━━    │          │
│    │                           │     │                           │          │
│    │  Self-Paced Learning      │     │  Ontario Credit Courses   │          │
│    │                           │     │                           │          │
│    │  Video lessons + practice │     │  Live online classes      │          │
│    │  for Grades K-12          │     │  with certified teachers  │          │
│    │                           │     │                           │          │
│    │  Starting at $100 CAD     │     │  Starting at $3,000 CAD   │          │
│    │                           │     │                           │          │
│    │  [Browse Non-credit →]    │     │  [Browse Credit →]        │          │
│    │                           │     │  ─────────────────────    │          │
│    │                           │     │  ★ Earn OSSD credit       │          │
│    │                           │     │  ★ Report cards included  │          │
│    │                           │     │  ★ University recognized  │          │
│    └───────────────────────────┘     └───────────────────────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Non-credit Landing Page Hero
```markdown
# Non-credit Learning Programs

**Build skills at your own pace with engaging video lessons and practice activities.**

Perfect for:
- Extra practice alongside regular school
- Summer learning to get ahead
- Homeschool curriculum support
- International students preparing for Canadian studies

**What's included:**
✓ High-quality video lessons
✓ Interactive practice activities
✓ Homework exercises
✓ Self-paced learning

**What's NOT included:**
✗ Tests or assessments
✗ Report cards or transcripts
✗ Ontario OSSD credit
✗ Live teacher instruction

*Looking for Ontario credit? [Browse Credit Courses →]*
```

### Credit Landing Page Hero
```markdown
# Ontario Credit Courses

**Earn official Ontario high school credits through live online classes with certified Canadian teachers.**

**Why EMCS Credit Courses?**
★ Ministry of Education approved (BSID: 665588)
★ Ontario Certified Teachers (OCT)
★ Live classes via Zoom (6 hrs/week)
★ Official transcripts and report cards
★ Credits count toward OSSD graduation
★ Recognized by universities worldwide

**Schedule:** 3 days/week × 2 hours/day
**Class Size:** Small groups for personalized attention

*Need practice before credit courses? [Browse Non-credit →]*
```

### Course Card Copy

**Credit Course Card:**
```
┌────────────────────────────────────────┐
│  [Ontario Credit]           Grade 12   │
│  ─────────────────────────────────────  │
│  Advanced Functions                    │
│  MHF4U                                 │
│                                        │
│  Live online • 6 hrs/week             │
│  With certified Ontario teacher        │
│                                        │
│  Prerequisite: MCR3U                   │
│                                        │
│                            $3,000 CAD  │
│  [View Details]  [Add to Cart]         │
└────────────────────────────────────────┘
```

**Non-credit Course Card:**
```
┌────────────────────────────────────────┐
│  [Non-credit]               Grade 3    │
│  ─────────────────────────────────────  │
│  Grade 3 Math Foundations              │
│                                        │
│  Self-paced • Video + Practice         │
│  No tests or assessments               │
│                                        │
│  No prerequisites                      │
│                                        │
│  $250  $100 CAD                       │
│  ────                                  │
│  [View Details]  [Add to Cart]         │
└────────────────────────────────────────┘
```

### Disclaimer Texts

**Non-credit Course Disclaimer (Required on all non-credit pages):**
```
ⓘ This is a non-credit course for supplementary learning only.
  It does not include tests, assessments, report cards, or Ontario OSSD credit.
  For official credit courses, please visit our Credit section.
```

**Credit Course Assurance:**
```
✓ This course awards 1.0 Ontario high school credit upon successful completion.
  Transcripts and report cards provided. Recognized by OUAC/OCAS and universities.
```

### Checkout Copy

**Cart - Bundle Message:**
```
🎁 BONUS INCLUDED
Your credit course purchase includes FREE access to the related
Non-credit practice course. Start practicing right away!
```

**Cart - Upgrade Prompt (for non-credit in cart):**
```
💡 UPGRADE AVAILABLE
Want to earn Ontario credit for this course?
Upgrade to the Credit version for just $350 more.
[Learn About Upgrading]
```

**Checkout - Non-credit Acknowledgment:**
```
☐ I understand that non-credit courses do not include tests,
  assessments, report cards, or Ontario OSSD credit.
```

**Payment Success - Credit Course:**
```
✓ Order Confirmed!

WHAT'S NEXT:
1. Check your email for Zoom class schedule
2. Join the orientation session within 48 hours
3. Meet your certified Ontario teacher
4. Access course materials in your student portal

Classes begin: [Date]
Your teacher: [Teacher Name], OCT
```

**Payment Success - Non-credit Course:**
```
✓ Order Confirmed!

START LEARNING NOW:
Your courses are ready! Log in to begin immediately.

1. Go to your Student Dashboard
2. Click on your course
3. Start with Lesson 1

Remember: Learn at your own pace. No deadlines, no pressure.
```

### Error Messages

```javascript
const errorMessages = {
  payment: {
    declined: "Payment declined. Please check your card details or try a different payment method.",
    expired: "Your card has expired. Please use a different card.",
    insufficient: "Insufficient funds. Please try a different card.",
    timeout: "Payment timed out. Please try again. Your card was not charged.",
  },
  coupon: {
    invalid: "This coupon code is not valid. Please check the code and try again.",
    expired: "This coupon has expired.",
    minimum: "This coupon requires a minimum order of ${amount}.",
    alreadyUsed: "This coupon has already been used.",
    wrongStorefront: "This coupon is only valid for {storefront} courses.",
  },
  checkout: {
    emptyCart: "Your cart is empty. Add courses before checking out.",
    sessionExpired: "Your session has expired. Please log in again.",
    stockError: "One or more courses in your cart are no longer available.",
  },
  form: {
    required: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
    invalidPhone: "Please enter a valid phone number.",
    passwordMismatch: "Passwords do not match.",
    invalidCard: "Please enter a valid card number.",
  }
};
```

### Navigation Labels

```json
{
  "nav": {
    "nonCredit": "Non-credit",
    "credit": "Credit",
    "about": "About",
    "programs": "Programs",
    "ossd": "OSSD Requirements",
    "international": "International Students",
    "faq": "FAQ",
    "contact": "Contact",
    "support": "Support",
    "login": "Login",
    "register": "Get Started",
    "cart": "Cart",
    "dashboard": "My Dashboard"
  },
  "grades": {
    "k": "Kindergarten",
    "1": "Grade 1",
    "2": "Grade 2",
    "3": "Grade 3",
    "4": "Grade 4",
    "5": "Grade 5",
    "6": "Grade 6",
    "7": "Grade 7",
    "8": "Grade 8",
    "9": "Grade 9",
    "10": "Grade 10",
    "11": "Grade 11",
    "12": "Grade 12"
  },
  "subjects": {
    "math": "Math",
    "science": "Science",
    "english": "English"
  },
  "cta": {
    "addToCart": "Add to Cart",
    "buyNow": "Buy Now",
    "viewDetails": "View Details",
    "viewOutline": "View Outline",
    "upgradeToCredit": "Upgrade to Credit",
    "checkout": "Checkout",
    "pay": "Pay {amount}",
    "startLearning": "Start Learning",
    "browseCourses": "Browse Courses",
    "contactUs": "Contact Us"
  },
  "labels": {
    "price": "Price",
    "listPrice": "Regular Price",
    "salePrice": "Sale Price",
    "savings": "You Save",
    "subtotal": "Subtotal",
    "discount": "Discount",
    "total": "Total",
    "free": "FREE",
    "included": "Included",
    "prerequisite": "Prerequisite",
    "delivery": "Delivery",
    "schedule": "Schedule",
    "duration": "Duration",
    "creditValue": "Credit Value"
  }
}
```

---

## Summary

This comprehensive architecture document provides all specifications needed to implement the EMCS K-12 education platform with two distinct storefronts (Credit and Non-credit). The design prioritizes:

1. **Clear differentiation** between credit and non-credit offerings at every touchpoint
2. **Parent-friendly navigation** with grade-first browsing
3. **E-commerce best practices** including bundling, upgrades, and discount systems
4. **Engaging elementary experiences** with interactive activities
5. **Compliance and accessibility** meeting WCAG 2.2 AA standards
6. **Performance optimization** targeting Core Web Vitals thresholds
7. **Measurable success criteria** with acceptance tests for all key flows

The release plan provides a realistic path to MVP by Jan 5 and full launch by Jan 15, with clear cut-scope options if timeline pressure requires prioritization.
