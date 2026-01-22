# Information Architecture Variants

This document presents 2 IA variants and 2 course page wireframe variants for comparison and selection.

---

## IA VARIANT A: Storefront-First Navigation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LOGO    [Non-credit ▼]  [Credit ▼]    About  Programs  FAQ    🔍  🛒  Login │
└─────────────────────────────────────────────────────────────────────────────┘
              │               │
              │               └─── Hover/Click reveals:
              │                    ┌─────────────────────────────┐
              │                    │ CREDIT COURSES              │
              │                    │ ─────────────────────────── │
              │                    │ Grade 9  → Math|Sci|Eng    │
              │                    │ Grade 10 → Math|Sci|Eng    │
              │                    │ Grade 11 → Math|Sci|Eng    │
              │                    │ Grade 12 → Math|Sci|Eng    │
              │                    │ ─────────────────────────── │
              │                    │ [View All Credit Courses]   │
              │                    └─────────────────────────────┘
              │
              └─── Hover/Click reveals:
                   ┌─────────────────────────────────────────┐
                   │ NON-CREDIT PROGRAMS                     │
                   │ ─────────────────────────────────────── │
                   │ Elementary (K-5)  │ Grade K  Grade 1    │
                   │                   │ Grade 2  Grade 3    │
                   │                   │ Grade 4  Grade 5    │
                   │ ─────────────────────────────────────── │
                   │ Middle (6-8)      │ Grade 6  Grade 7    │
                   │                   │ Grade 8             │
                   │ ─────────────────────────────────────── │
                   │ High School (9-12)│ Grade 9  Grade 10   │
                   │                   │ Grade 11 Grade 12   │
                   │ ─────────────────────────────────────── │
                   │ [View All Non-credit Programs]          │
                   └─────────────────────────────────────────┘
```

### URL Structure (Variant A)
```
/non-credit                    → Non-credit landing
/non-credit/grade/3            → Grade 3 non-credit page
/non-credit/grade/3/math       → Grade 3 Math courses
/non-credit/course/NC-G3-MATH  → Course detail

/credit                        → Credit landing
/credit/grade/12               → Grade 12 credit page
/credit/grade/12/math          → Grade 12 Math courses
/credit/course/MHF4U           → Course detail
```

### Pros (Variant A)
- Clear storefront separation at top level
- Parents immediately understand they're in Credit or Non-credit section
- Color-coding reinforces which section they're in
- Intuitive mental model: choose type first, then grade

### Cons (Variant A)
- Two clicks to reach a specific grade
- Might feel fragmented for parents comparing options
- Separate landing pages to maintain

---

## IA VARIANT B: Grade-First with Type Toggle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LOGO   Browse by Grade ▼   About  Programs  FAQ  Contact    🔍  🛒  Login  │
└─────────────────────────────────────────────────────────────────────────────┘
                │
                └─── Hover/Click reveals:
                     ┌───────────────────────────────────────────────────────┐
                     │  ELEMENTARY        MIDDLE SCHOOL      HIGH SCHOOL     │
                     │  ─────────────     ─────────────      ─────────────   │
                     │  Kindergarten      Grade 6            Grade 9         │
                     │  Grade 1           Grade 7            Grade 10        │
                     │  Grade 2           Grade 8            Grade 11        │
                     │  Grade 3                              Grade 12        │
                     │  Grade 4                                              │
                     │  Grade 5                                              │
                     └───────────────────────────────────────────────────────┘

On Grade Page:
┌─────────────────────────────────────────────────────────────────────────────┐
│  Grade 12 Courses                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                              │
│  [○ Non-credit]  [● Credit]  ← Toggle between types                         │
│                                                                              │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                │
│  │     Math        │ │    Science      │ │    English      │                │
│  │  ────────────   │ │  ────────────   │ │  ────────────   │                │
│  │  MHF4U          │ │  SBI4U          │ │  ENG4U          │                │
│  │  MCV4U          │ │  SCH4U          │ │  EWC4U          │                │
│  │  MDM4U          │ │  SPH4U          │ │                 │                │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### URL Structure (Variant B)
```
/courses                       → Landing with grade picker
/courses/grade/3               → Grade 3 page (with type toggle)
/courses/grade/3/credit        → Grade 3 Credit (if exists)
/courses/grade/3/non-credit    → Grade 3 Non-credit
/courses/MHF4U                 → Course detail (type implied by course)
```

### Pros (Variant B)
- Single entry point for all courses
- Parents can quickly compare Credit vs Non-credit for same grade
- Fewer navigation items in header
- Works well for parents unsure which type they need

### Cons (Variant B)
- Toggle could be missed or confusing
- Elementary grades (K-5) only have Non-credit, toggle awkward
- Less clear storefront identity
- URL structure less explicit about course type

---

## RECOMMENDATION

**Selected: Variant A (Storefront-First)** with enhancements from Variant B.

### Rationale:
1. **Clearer mental model**: Parents should understand Credit vs Non-credit before diving in
2. **Regulatory clarity**: Non-credit disclaimer requirements easier to apply at section level
3. **Pricing differentiation**: Very different price points ($100 vs $3,000) need separation
4. **Future flexibility**: School membership naturally fits as third storefront

### Enhancement from Variant B:
- Add comparison link: "Compare Credit vs Non-credit" on each grade page
- Show both options if parent lands on grade page directly (from search)

---

## COURSE PAGE WIREFRAME VARIANT 1: Traditional Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Credit > Grade 12 > Math > Advanced Functions                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │                                         │  │  SIDEBAR                 │  │
│  │  [Ontario Credit Badge]                 │  │  ──────────────────────  │  │
│  │                                         │  │                          │  │
│  │  Advanced Functions                     │  │  💰 $3,000 CAD           │  │
│  │  MHF4U • Grade 12 University           │  │                          │  │
│  │                                         │  │  [Add to Cart]           │  │
│  │  ★★★★★ 4.9 (127 reviews)               │  │  [Buy Now]               │  │
│  │                                         │  │                          │  │
│  │  Live online classes with certified     │  │  ──────────────────────  │  │
│  │  Ontario teachers. Prepare for          │  │                          │  │
│  │  university calculus and STEM.          │  │  📅 Schedule             │  │
│  │                                         │  │  6 hrs/week              │  │
│  │                                         │  │  3 days × 2 hours        │  │
│  │                                         │  │                          │  │
│  └─────────────────────────────────────────┘  │  📋 Prerequisites        │  │
│                                               │  MCR3U                   │  │
│  ┌─────────────────────────────────────────┐  │                          │  │
│  │  COURSE NAVIGATION                      │  │  🎓 Credit Value        │  │
│  │  ○ Overview                             │  │  1.0 Ontario Credit      │  │
│  │  ○ What You'll Learn                    │  │                          │  │
│  │  ○ Course Outline                       │  │  ⏱ Duration              │  │
│  │  ○ Prerequisites                        │  │  18 weeks                │  │
│  │  ○ Teacher                              │  │                          │  │
│  │  ○ FAQs                                 │  │  🎁 Bonus                 │  │
│  └─────────────────────────────────────────┘  │  FREE Non-credit         │  │
│                                               │  practice included       │  │
│  ┌─────────────────────────────────────────┐  │                          │  │
│  │  OVERVIEW                               │  │  💬 Questions?           │  │
│  │  ───────────────────────────────────    │  │  [Contact Us]            │  │
│  │  [Course description paragraph...]      │  └──────────────────────────┘  │
│  │                                         │                                │
│  └─────────────────────────────────────────┘                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  WHAT YOU'LL LEARN                                                      ││
│  │  ───────────────────────────────────────────────────────────────────    ││
│  │  ✓ Analyze polynomial functions          ✓ Solve trig equations        ││
│  │  ✓ Work with rational functions          ✓ Apply log functions         ││
│  │  ✓ Master trigonometric identities       ✓ Prepare for calculus        ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  COURSE OUTLINE                                                         ││
│  │  ───────────────────────────────────────────────────────────────────    ││
│  │  [Accordion: Unit 1 - Polynomial Functions (20 hours)]                  ││
│  │  [Accordion: Unit 2 - Polynomial Equations (15 hours)]                  ││
│  │  [Accordion: Unit 3 - Rational Functions (15 hours)]                    ││
│  │  ...                                                                    ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pros (Wireframe 1)
- Familiar e-commerce pattern
- Sticky sidebar keeps CTA visible
- Clear information hierarchy
- Easy to scan

### Cons (Wireframe 1)
- Sidebar takes space on mobile (needs collapse)
- Long scroll on desktop
- May feel corporate/transactional

---

## COURSE PAGE WIREFRAME VARIANT 2: Hero-Focused Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Credit > Grade 12 > Math > Advanced Functions                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                                                                       ║  │
│  ║  ┌──────────────────────────────────────────────────────────────────┐ ║  │
│  ║  │                    HERO SECTION (FULL WIDTH)                     │ ║  │
│  ║  │                                                                  │ ║  │
│  ║  │  [Ontario Credit]                                                │ ║  │
│  ║  │                                                                  │ ║  │
│  ║  │  Advanced Functions (MHF4U)                                      │ ║  │
│  ║  │  Grade 12 • University Preparation                               │ ║  │
│  ║  │                                                                  │ ║  │
│  ║  │  ┌─────────────────────────────────────────────────────────────┐ │ ║  │
│  ║  │  │ 📅 6 hrs/wk  │  ⏱ 18 weeks  │  🎓 1.0 Credit  │  💰 $3,000 │ │ ║  │
│  ║  │  └─────────────────────────────────────────────────────────────┘ │ ║  │
│  ║  │                                                                  │ ║  │
│  ║  │            [Add to Cart]        [Preview Course]                 │ ║  │
│  ║  │                                                                  │ ║  │
│  ║  └──────────────────────────────────────────────────────────────────┘ ║  │
│  ║                                                                       ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  [Overview]  [Curriculum]  [Schedule]  [Teacher]  [FAQs]  [Reviews]   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │  COURSE OVERVIEW                │  │  INCLUDED WITH THIS COURSE     │   │
│  │  ─────────────────────────────  │  │  ─────────────────────────────  │   │
│  │                                 │  │  ✓ 54 live Zoom sessions       │   │
│  │  Prepare for university         │  │  ✓ Recorded lesson replays     │   │
│  │  calculus with in-depth study   │  │  ✓ Practice problem sets       │   │
│  │  of polynomial, rational,       │  │  ✓ Quizzes and tests           │   │
│  │  logarithmic, and trig          │  │  ✓ Final examination           │   │
│  │  functions...                   │  │  ✓ Official transcript         │   │
│  │                                 │  │  ✓ Report card                 │   │
│  │  [Read More]                    │  │  🎁 FREE: Math Practice Course │   │
│  └─────────────────────────────────┘  └─────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  WHAT YOU'LL MASTER                                                  │   │
│  │  ────────────────────────────────────────────────────────────────    │   │
│  │                                                                      │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │   │
│  │  │ Unit 1  │  │ Unit 2  │  │ Unit 3  │  │ Unit 4  │  │ Unit 5  │   │   │
│  │  │ Poly    │  │ Poly    │  │Rational │  │  Trig   │  │Exp/Log  │   │   │
│  │  │Functions│  │Equations│  │Functions│  │         │  │         │   │   │
│  │  │ 20 hrs  │  │ 15 hrs  │  │ 15 hrs  │  │ 25 hrs  │  │ 20 hrs  │   │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  MEET YOUR TEACHER                                                   │   │
│  │  ────────────────────────────────────────────────────────────────    │   │
│  │  ┌──────────┐                                                       │   │
│  │  │  Photo   │  Ms. Sarah Chen, B.Ed., OCT                           │   │
│  │  │          │  10+ years teaching advanced mathematics              │   │
│  │  │          │  "I believe every student can succeed in math..."     │   │
│  │  └──────────┘                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     STICKY FOOTER CTA                                │   │
│  │  Advanced Functions (MHF4U)               $3,000 CAD  [Enroll Now]   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pros (Wireframe 2)
- Hero creates strong first impression
- Quick facts immediately visible
- Tab navigation reduces scroll
- Sticky footer CTA always accessible
- More visual, less text-heavy
- Teacher section builds trust

### Cons (Wireframe 2)
- More complex to implement
- Tabs may hide important info
- Hero takes significant vertical space
- Needs good imagery to look professional

---

## RECOMMENDATION

**Selected: Wireframe Variant 2 (Hero-Focused)** with elements from Variant 1.

### Rationale:
1. **First impression matters**: Parents deciding on $3,000 courses need confidence
2. **Mobile-first works better**: Hero + sticky footer great on phones
3. **Teacher trust factor**: For live classes, showing teacher builds confidence
4. **Premium feel**: Matches the premium price point

### Elements to keep from Variant 1:
- Sidebar quick facts (for desktop view)
- Accordion course outline (within tabs)
- Sticky sidebar on scroll (desktop only)

---

## Implementation Priority

### Phase 1 (Jan 5 MVP)
1. IA Variant A structure
2. Wireframe 2 for course pages
3. Basic mobile responsive

### Phase 2 (Jan 15 Launch)
1. Tab navigation on course pages
2. Sticky footer CTA
3. Teacher profiles

### Phase 3 (Post-Launch)
1. Comparison feature from Variant B
2. Reviews/ratings
3. Video previews
