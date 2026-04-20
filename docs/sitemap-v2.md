# EMCS Site Map (English) — Version 2

> Single-source site map of the **Excellence Maple Canadian School (EMCS)** React + Vite app.
> All English copy is sourced from [src/locales/en.json](../src/locales/en.json) and [src/locales/en-storefronts.json](../src/locales/en-storefronts.json).
> Routes confirmed against [src/App.jsx](../src/App.jsx).
>
> **Version 2 Changelog (2026-04-14):** This revision incorporates the approved Academic Preparation and Ontario Official pricing tables for Grades 1 to 5 and Grades 6 to 8, the updated Grades 9 to 12 program narrative, and the revised "Program" menu layout described in the Web Design Layout feedback. Every change is additive. Existing Version 1 structure, copy, and route inventory are preserved. New "Ontario student record" vs. "Non-Ontario student record" framing is introduced across storefront pages, the standard academic year schedule (September 5, 2026 to May 30, 2027) is surfaced globally, and grade-specific French as a Second Language exemptions for internationally-trained students are called out. Detailed grade-by-grade timetables, course codes, and tuition matrices are captured in the new appendices at the bottom of this document (see Appendix A through Appendix F).
>
> **Version 2 guiding taglines (to be rendered prominently on program and grade landing pages):**
> 1. "Flexible Learning Pathways"
> 2. "Learn First. Decide Later. Succeed Safely."
> 3. "We offer Ontario Curriculum-aligned learning for students in Grades 1 to 12 through two flexible pathways: Academic Preparation Program (Non-Ontario student record) and Official Ontario Program (Ontario student record). Students may start with preparation learning and upgrade to credit-bearing courses when academically ready."
>
> **Version 2 terminology standardization:**
> - Academic Preparation Program is labelled **(Non-Credit | Non-Ontario student record)** across all surfaces.
> - Official Ontario Program is labelled **(Credit-bearing | Ontario student record)** across all surfaces.
> - Upgrade paths from Academic Prep to Official Ontario are surfaced on every grade card, cart row, and course detail page.
> - All full-year bundles reference the standardized academic calendar "September 5, 2026 to May 30, 2027 (39 instructional weeks)".

## How to read this doc
- Every page section lists: **Route**, **Source file**, **Renders inside**, a **Structure** outline (in render order), and a **Copy** dump of every visible heading, paragraph, button, list item, and form label.
- Headings, body, and labels are quoted verbatim from `en.json` (with the JSON key path in parentheses where it adds context).
- Hardcoded JSX copy that is not in the locale file (the `/auth` pages only) is marked **HARDCODED**.
- Vietnamese translations are out of scope for this document — see [src/locales/vi.json](../src/locales/vi.json) and [src/locales/vi-storefronts.json](../src/locales/vi-storefronts.json) for those.

---

## Route inventory (Version 2 — 34 routes total)

**New routes introduced in Version 2** (to support the Web Design Layout feedback and the Grades 9 to 12 timetable pages):

| Group | Route | Component | Status |
|---|---|---|---|
| Public | `/programs/middle-school` | MiddleSchoolFoundation.jsx | **NEW** — Grades 6 to 8 dedicated landing, mirrors Primary Foundation structure. |
| Public | `/programs/high-school` | HighSchoolPathways.jsx | **NEW** — Grades 9 to 12 "Flexible Learning Pathways" hub described in the Ontario Official Programs 9 to 12 feedback doc. |
| Public | `/tuition` | Tuition.jsx | **NEW** — Consolidated public tuition page that surfaces every grade band price table (previously only referenced via `tuition.*` locale namespace). |
| Public | `/schedule` | AcademicCalendar.jsx | **NEW** — Academic calendar page showing the September 5, 2026 to May 30, 2027 schedule, holidays, assessment windows, and program start dates. |
| Public | `/compare` | ProgramCompare.jsx | **NEW** — Interactive Academic Prep vs. Official Ontario side-by-side comparison (replaces inline comparison tables and deep-links from Program dropdown). |
| Storefront | `/academic-prep/group/:groupSlug` | GradeGroupPage.jsx | **NEW** — Grade-group landing (`elementary`, `middle`, `high`) that displays the two-column "Academic Preparation vs. Upgrade to Ontario Official" layout from the Web Design Layout doc. Same component reused under `/official-ontario/group/:groupSlug`. |

## Route inventory (Version 1 — 28 routes total, preserved)

| Group | Route | Component |
|---|---|---|
| Auth | `/auth` | [AuthPage.jsx](../src/pages/auth/AuthPage.jsx) |
| Auth | `/auth/callback` | [AuthCallback.jsx](../src/pages/auth/AuthCallback.jsx) |
| Public | `/` | [Home.jsx](../src/pages/Home.jsx) |
| Public | `/about` | [About.jsx](../src/pages/About.jsx) |
| Public | `/courses` | [Courses.jsx](../src/pages/Courses.jsx) |
| Public | `/courses/:courseCode` | [CourseDetail.jsx](../src/pages/CourseDetail.jsx) |
| Public | `/admissions/international` | [InternationalStudents.jsx](../src/pages/InternationalStudents.jsx) |
| Public | `/ossd-requirements` | [OssdRequirements.jsx](../src/pages/OssdRequirements.jsx) |
| Public | `/student-support` | [StudentSupport.jsx](../src/pages/StudentSupport.jsx) |
| Public | `/faq` | [Faq.jsx](../src/pages/Faq.jsx) |
| Public | `/contact` | [Contact.jsx](../src/pages/Contact.jsx) |
| Public | `/programs/elementary` | [PrimaryFoundation.jsx](../src/pages/PrimaryFoundation.jsx) |
| Public | `/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) |
| Storefront | `/academic-prep` | [AcademicPrepLanding.jsx](../src/pages/AcademicPrepLanding.jsx) |
| Storefront | `/academic-prep/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) |
| Storefront | `/academic-prep/grade/:grade/courses` | [GradePage.jsx](../src/pages/GradePage.jsx) |
| Storefront | `/academic-prep/course/:courseCode` | [StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx) |
| Storefront | `/official-ontario` | [OfficialOntarioLanding.jsx](../src/pages/OfficialOntarioLanding.jsx) |
| Storefront | `/official-ontario/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) |
| Storefront | `/official-ontario/grade/:grade/courses` | [GradePage.jsx](../src/pages/GradePage.jsx) |
| Storefront | `/official-ontario/course/:courseCode` | [StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx) |
| Commerce | `/cart` | [Cart.jsx](../src/pages/Cart.jsx) |
| Commerce | `/checkout` | [Checkout.jsx](../src/pages/Checkout.jsx) |
| Portal | `/portal/student` | [StudentPortal.jsx](../src/pages/portals/StudentPortal.jsx) |
| Portal | `/portal/parent` | [ParentPortal.jsx](../src/pages/portals/ParentPortal.jsx) |
| Portal | `/portal/agent` | [AgentPortal.jsx](../src/pages/portals/AgentPortal.jsx) |
| Redirect | `/non-credit` → `/academic-prep` | (Navigate) |
| Redirect | `/credit` → `/official-ontario` | (Navigate) |

Plus catch-all forwards: `/non-credit/*` → `/academic-prep/*` and `/credit/*` → `/official-ontario/*` (kept for backward compatibility).

---

# Shared chrome (rendered on every non-auth route)

## Header — [components/Header.jsx](../src/components/Header.jsx)

**Structure (left → right):**
1. Logo (links to `/`) — text "EMCS" + shield icon
2. Primary nav links (with dropdowns where indicated):
   1. **Program** dropdown — see Program Dropdown below
   2. **Courses** dropdown — see Courses Dropdown below
   3. About Us → `/about`
   4. International Students → `/admissions/international`
   5. OSSD Requirements → `/ossd-requirements`
   6. FAQ → `/faq`
   7. Contact → `/contact`
3. Header actions:
   1. Language toggle (EN / VI)
   2. **Login** dropdown — see Login Portal Dropdown below
   3. Cart icon → `/cart`
   4. **Register Now** CTA → `/contact`

**Copy:**
- Logo wordmark: "EMCS"
- Nav: "Program" · "Courses" · "About Us" · "International Students" · "OSSD Requirements" · "FAQ" · "Contact"
- Range label inside Courses dropdown trigger: "Grades 1-12"
- Action labels: "Login" · "Register Now"

### Program dropdown (two-panel) — Version 2 specification

Trigger: **Program**. Per the Web Design Layout feedback: "When hovering over the Program menu, two panels will appear." When parents or students click "View more" under either panel, they are routed to that program's landing page, which in turn shows the three grade-group entry points (1 to 5, 6 to 8, 9 to 12). Clicking any group reveals two clearly delineated sections: the Academic Preparation Program (Non-Ontario student record) and the corresponding UPGRADE to Official Ontario Program (Ontario student record).

**Left panel — Academic Preparation Program**
- Header: "Academic Preparation Program"
- Sub-label: "Non-Credit | Non-Ontario student record"
- Tagline v2: "Self-paced preparation. Learn First. Decide Later."
- Full description (shown on the panel card, sourced from the Web Design Layout doc): "The Academic Preparation Program builds strong foundations in Academic English, mathematics, science, social studies, and essential learning skills. Aligned with Ontario standards, it develops analytical thinking and disciplined study habits, preparing students for a smooth transition into OSSD credit courses or the Ontario Secondary School Diploma (OSSD) program."
- Grade group pills (each pill links to `/academic-prep/group/{groupSlug}`):
  - "Elementary (1 to 5)" — Gr 1 · Gr 2 · Gr 3 · Gr 4 · Gr 5
  - "Middle School (6 to 8)" — Gr 6 · Gr 7 · Gr 8
  - "High School (9 to 12)" — Gr 9 · Gr 10 · Gr 11 · Gr 12
- "View More →" link → `/academic-prep`
- Secondary link: "See Pricing" → `/tuition#academic-prep`

**Right panel — Official Ontario Program**
- Header: "Official Ontario Program"
- Sub-label: "Credit-bearing | Ontario student record"
- Badge: "Most Popular"
- Tagline v2: "Earn official OSSD credits. Succeed Safely."
- Full description (shown on the panel card, sourced from the Web Design Layout doc): "The Official Ontario Program is a fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Aligned with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. With personalized academic guidance and a structured learning environment, students are prepared for university admission in Canada and internationally. Upon successful completion, students earn the Ontario Secondary School Diploma (OSSD)."
- Grade group pills (each pill links to `/official-ontario/group/{groupSlug}`):
  - "Elementary (1 to 5)" — Gr 1 … Gr 5
  - "Middle School (6 to 8)" — Gr 6 … Gr 8
  - "High School (9 to 12)" — Gr 9 … Gr 12
- "View More →" link → `/official-ontario`
- Secondary link: "See Pricing" → `/tuition#official-ontario`

**Shared footer of the two-panel dropdown (new in Version 2)**
- "Compare Both Programs →" link → `/compare`
- "View Academic Calendar →" link → `/schedule`
- Micro-tagline strip: "Flexible Learning Pathways. Learn First. Decide Later. Succeed Safely."

### Courses dropdown (single panel)
Trigger: **Courses** ("Browse by Grade")

Three grade group sections — each link goes to `/grade/{n}`:
- "Elementary" — Grade 1 · Grade 2 · Grade 3 · Grade 4 · Grade 5
- "Middle School" — Grade 6 · Grade 7 · Grade 8
- "High School" — Grade 9 · Grade 10 · Grade 11 · Grade 12

### Login Portal dropdown
Trigger: **Login**

Three portal cards:
- 🎓 **Student Portal** — "Access your LMS and courses" → `/portal/student`
- 👨‍👩‍👧 **Parent Portal** — "Enrollment and student progress" → `/portal/parent`
- 🤝 **Agent / School Portal** — "Partner enrollment forms" → `/portal/agent`

---

## Footer — [components/Footer.jsx](../src/components/Footer.jsx)

**Structure:** Brand column + 3 link columns + bottom bar.

**Brand column**
- Logo: "EMCS"
- Tagline: "Excellence in Canadian Online Education"
- Social icons: Facebook · Instagram · LinkedIn · YouTube

**Programs column** ("Programs")
- Academic Preparation Program → `/academic-prep`
- Official Ontario Program → `/official-ontario`
- Primary Foundation → `/programs/elementary`
- OSSD Requirements → `/ossd-requirements`

**Quick Links column** ("Resources" / quick links)
- About Us → `/about`
- International Students → `/admissions/international`
- Student Support → `/student-support`
- FAQ → `/faq`
- Contact → `/contact`

**Connect column** ("Connect")
- Email: `contact@emcs.ca` (`mailto:`)
- Phone: `+1-416-882-6571` (`tel:`)
- Address: 10 Gurney Crescent, North York, ON M6B 1S8

**Bottom bar**
- "© 2026 EMCS. All rights reserved."
- "Privacy Policy" · "Terms of Service" · "Refund Policy"
- Accreditation badge: "Ontario Ministry Inspected School | BSID: 886229"

---

# Auth pages

## `/auth` — Sign In / Create Account / Forgot Password

- **Source:** [src/pages/auth/AuthPage.jsx](../src/pages/auth/AuthPage.jsx)
- **Renders inside:** No Header / Footer (full-page two-column layout)
- **Note:** **HARDCODED** — does not use react-i18next.

**Structure**
1. **Left branding column**
2. **Right form panel** with tab switcher + active form (Login / Register / Forgot)
3. Inline error / success message above the form

**Copy — Left branding column**
- H1: "Excellence Maple Canadian School"
- Subtitle: "Ontario-accredited online education for students worldwide"
- Feature list:
  - 🎓 "OSSD Credits & Diploma"
  - 🌍 "Study from anywhere"
  - 📚 "Ontario Certified Teachers"
  - ⏰ "Self-paced learning"

**Copy — Tab switcher**
- "Sign In" · "Create Account"

**Copy — Login form**
- Field label: "Email Address" — placeholder "your@email.com"
- Field label: "Password" — placeholder "••••••••"
- Submit button: "Sign In" (loading state: "Signing in...")
- Link button: "Forgot your password?"
- Possible inline errors: "Login failed. Please check your credentials."

**Copy — Register form**
- "Full Name" — placeholder "Jane Smith"
- "Email Address" — placeholder "your@email.com"
- "Password" — placeholder "Min 6 characters" (min 6 chars)
- "Confirm Password" — placeholder "••••••••"
- "Phone Number" — placeholder "+1 (416) 555-0123"
- "Country" select — options: Canada · China · India · Nigeria · Vietnam · South Korea · Brazil · Other
- "Province/State" select — options: Ontario · British Columbia · Alberta · Quebec · Manitoba · Saskatchewan · Nova Scotia · Other
- Submit button: "Create Account" (loading: "Creating account...")
- Validation messages: "Passwords do not match" · "Password must be at least 6 characters"
- Success (after submit): "Registration successful! Please check your email to verify your account."
- Failure fallback: "Registration failed. Please try again."

**Copy — Forgot Password form**
- Helper text: "Enter your email address and we'll send you a link to reset your password."
- "Email Address" — placeholder "your@email.com"
- Submit button: "Send Reset Link" (loading: "Sending...")
- Link button: "← Back to Sign In"
- Success: "Password reset email sent. Please check your inbox."
- Failure fallback: "Failed to send reset email."

---

## `/auth/callback` — PKCE OAuth callback

- **Source:** [src/pages/auth/AuthCallback.jsx](../src/pages/auth/AuthCallback.jsx)
- **Renders inside:** No Header / Footer
- **Note:** **HARDCODED** transient page; redirects on success.

**Copy**
- Default: "Completing sign in..."
- Error state:
  - H2: "Authentication Error"
  - Body: (Supabase error message verbatim, e.g. "invalid_grant: ...")
  - Link: "Return to login" → `/auth`
- Failure fallback: "Authentication callback failed"

---

# Public pages

## `/` — Home

- **Source:** [src/pages/Home.jsx](../src/pages/Home.jsx)
- **Renders inside:** Header + Footer

**Structure**
1. Hero (badge + headline + CTAs)
2. Trust indicators row (6 stat cards)
3. Why Choose EMCS? (4 cards)
4. How It Works (4 numbered steps)
5. Most Popular Courses preview
6. Featured Programs — Primary Foundation card
7. LMS 3D scene / "Experience Our Learning Platform" feature highlights
8. University acceptance section
9. Final CTA

**Copy — Hero (`hero`)**
- Badge: "Ontario Ministry Inspected School • BSID: 886229"
- Title: "Your Path to a"
- Title highlight: "Canadian Education"
- Subtitle: "Build academic foundations from Grade 1 or earn your Ontario Secondary School Diploma (OSSD) 100% online from anywhere in the world. Study at your own pace with Ontario Certified Teachers."
- CTA 1: "Start Your Journey"
- CTA 2: "Explore Programs"

**Copy — Trust indicators (`trustIndicators`)**
- "Ministry Inspected" — "BSID: 886229"
- "Years of Experience" — "Since 2010"
- "Students Worldwide" — "130+ Countries"
- "Course Completion" — "4 weeks to 12 months"
- "Teacher Support" — "Within 48 hours"
- "Transcript Delivery" — "Direct to OUAC/OCAS"

**Copy — Why Choose EMCS? (`why`)**
- Title: "Why Choose EMCS?"
- Subtitle: "We make Canadian education accessible, flexible, and supported—wherever you are in the world."
- Card 1 — "Study From Anywhere": "Learn from Vietnam, Canada, or anywhere globally. All you need is an internet connection. No study permit required for online courses."
- Card 2 — "Your Schedule, Your Pace": "Start anytime—we offer continuous enrollment year-round. Complete courses in as little as 4 weeks or take up to 12 months."
- Card 3 — "Ontario Certified Teachers": "All credit courses are delivered by teachers in good standing with the Ontario College of Teachers (OCT), with real classroom experience."
- Card 4 — "Globally Recognized Credentials": "Our OSSD credits are the same as those earned in traditional Ontario schools—recognized by universities in Canada, the US, UK, Australia, and worldwide."

**Copy — How It Works (`home.howItWorks`)**
- Title: "How It Works"
- Subtitle: "Getting started is simple—register today and begin learning within 24-48 hours."
- Step 1 — "1. Register Anytime": "Sign up 365 days a year. No deadlines, no waitlists. Continuous enrollment means you start when you're ready."
- Step 2 — "2. Learn at Your Pace": "Access course materials 24/7. Our asynchronous platform fits your schedule—study when it works for you."
- Step 3 — "3. Get Teacher Support": "Ontario Certified Teachers respond to questions within 48 hours. Office hours available for real-time help."
- Step 4 — "4. Earn Your Credential": "Credits appear on official Ontario transcripts. Marks sent directly to OUAC, OCAS, and your day school."

**Copy — Popular Courses (`home.popularCourses`)**
- Title: "Most Popular Courses"
- Subtitle: "Join thousands of students in these key prerequisites."
- Per-card link: "View Outline"
- Footer link: "View All 170+ Courses"

**Copy — Featured Programs (`home.featuredPrograms`) — Version 2**
- Title: "Featured Programs"
- Primary Foundation card:
  - Badge: "NEW"
  - Title: "Ontario Primary Foundation Program"
  - Description: "Grades 1 to 5 aligned with Ontario Curriculum. Two pathways available:"
  - Bullet: "Academic Preparation (Self-Learning, Non-Ontario student record): From $75 CAD per subject with the 50% promotional discount, or $325 CAD for the full-year 6-subject bundle."
  - Bullet: "Upgrade to Ontario Official Program (Ontario student record): $250 CAD per course, or $600 CAD per year for the full 6-subject bundle."
  - Bullet: "Live Teacher-Led Primary Foundation (with Ontario report card): $3,500 CAD per year (preserved Version 1 offering, now positioned as the premium teacher-led pathway alongside the new entry-level Official Ontario upgrade)."
  - CTA: "Learn More About Elementary Programs"
- Middle School card (NEW in Version 2):
  - Badge: "NEW"
  - Title: "Middle School Foundation (Grades 6 to 8)"
  - Description: "Grades 6 to 8 Ontario Curriculum-aligned preparation with an optional upgrade to an Ontario student record."
  - Bullet: "Academic Preparation (Non-Credit): $75 per course (50% off), $325 CAD for the full-year 6-subject bundle."
  - Bullet: "Upgrade to Ontario Official Program (Ontario student record): $250 per course, $600 CAD per year."
  - Bullet: "Entrance Test Fee: $50 CAD (non-refundable) — applies to Grades 6 to 8 (waived for Grades 1 to 5)."
  - CTA: "Explore Middle School Foundation"
- High School card (NEW in Version 2):
  - Badge: "FLEXIBLE PATHWAYS"
  - Title: "Ontario High School Pathways (Grades 9 to 12)"
  - Tagline: "Flexible Learning Pathways. Learn First. Decide Later. Succeed Safely."
  - Description: "Two pathways for Grades 9 to 12, both aligned with the Ontario Curriculum. Start with the Academic Preparation Program for skills and readiness, then upgrade to the Official Ontario Program for credit-bearing courses and the OSSD."
  - Bullet: "Academic Preparation Program (Non-Credit): Skills-focused preparation with no Ontario student record."
  - Bullet: "Official Ontario Program: Credit-bearing, Ontario student record, leading to the Ontario Secondary School Diploma."
  - Bullet: "Registration Fee: $100 CAD. Entrance Test Fee: $50 CAD."
  - Bullet: "Grade 9 and Grade 10 = 8-credit one-year programs. Grade 11 and Grade 12 = 7-credit one-year programs."
  - CTA: "View High School Pathways"

**Copy — LMS 3D / Platform feature highlights (`home.lms3d`)**
- Title: "Experience Our Learning Platform"
- Subtitle: "Explore our interactive LMS features"
- Feature — "Course Browsing & Enrollment": "Browse 170+ courses and enroll instantly with a few clicks"
- Feature — "Interactive Video Learning": "Engage with video lessons, quizzes, and hands-on activities"
- Feature — "Track Your Progress": "Monitor grades, completion rates, and learning milestones in real-time"
- Feature — "24/7 Teacher Support": "Get help anytime with live chat and messaging from certified teachers"

**Copy — University acceptance (`home.universityAcceptance`)**
- Title: "Our Graduates Attend Top Institutions Worldwide"
- Subtitle: "OSSD credentials are recognized globally. Our students have been accepted to universities across Canada, the United States, United Kingdom, Australia, and beyond."

**Copy — Program Pathways (`programPathways`) — Version 2**
- Title: "Program Pathways"
- Subtitle: "Choose the learning path that fits your goals. Learn First. Decide Later. Succeed Safely."
- Elementary: "Elementary Foundation (Grades 1 to 5)" — "Build essential academic skills aligned with the Ontario Curriculum. Perfect for international students preparing for Canadian studies or families seeking curriculum-aligned learning support." — Pricing row: "Academic Preparation (self-learning): $75 CAD per subject (50% off $150), or $325 CAD full-year 6-subject bundle. Upgrade to Ontario Official Program: $250 CAD per course, $600 CAD full-year." — Fees: "Registration Fee $50 CAD. Entrance Test Fee waived for Grades 1 to 5." — CTA: "Explore Elementary Programs"
- Middle: "Middle School (Grades 6 to 8)" — "Strengthen foundations for high school success with Ontario curriculum-aligned courses. Students may start in Academic Preparation and upgrade mid-year to the Official Ontario Program." — Pricing row: "Academic Preparation: $75 CAD per course (50% off), $325 CAD full-year 6-subject bundle. Upgrade to Ontario Official Program: $250 CAD per course, $600 CAD full-year." — Fees: "Registration Fee $50 CAD. Entrance Test Fee $50 CAD (non-refundable)." — CTA: "Explore Middle School Foundation"
- High School (Official Ontario): "High School Credit (Grades 9 to 12)" — "Earn official OSSD credits recognized by universities worldwide. Live classes with Ontario Certified Teachers. Grade 9 and Grade 10 are 8-credit programs. Grade 11 and Grade 12 are 7-credit programs." — Price: "From $3,500 CAD per year" — Fees: "Registration Fee $100 CAD. Entrance Test Fee $50 CAD." — Notes: "French as a Second Language is waived for students who completed the prior grade in their home country (an equivalent credit is granted)." — CTA: "Explore Credit Courses"
- High School (Academic Prep): "High School Preparation (Grades 9 to 12)" — "Non-credit, skills-based preparation that readies students to upgrade into the Official Ontario Program or into an EAP pathway." — CTA: "Explore Academic Preparation"
- Practice: "Practice Courses (All Grades)" — "Self-paced video lessons and activities for extra practice. No assessments, no credits, just learning." — Price: "Starting at $75 CAD" — CTA: "Explore Practice Courses"

**Copy — Final CTA (`cta`)**
- Title: "Ready to Start Your Canadian Education Journey?"
- Subtitle: "Join students from over 130 countries learning with EMCS. Register today and access your course within 24-48 hours."
- Button: "Get Started Now"

**Copy — Accreditation strip (`accreditation`)**
- Title: "Ministry Inspected Private School"
- Statement: "EMCS is inspected by the Ontario Ministry of Education and authorized to grant credits toward the Ontario Secondary School Diploma (OSSD)."
- BSID: "BSID: 886229"
- Details: "Our credits hold the same value as those earned in traditional Ontario day schools and are recognized by all Canadian colleges and universities. Transcripts are sent directly to OUAC, OCAS, and educational institutions worldwide."

---

## `/about` — About EMCS

- **Source:** [src/pages/About.jsx](../src/pages/About.jsx)
- **Renders inside:** Header + Footer

**Structure**
1. Hero (badge + h1 + subtitle)
2. Who We Are
3. Our Story
4. Mission & Philosophy (two cards)
5. Principal's Message
6. Accreditation grid (4 items)
7. What This Means (bulleted list)
8. Values grid (4 cards)
9. Leadership team

**Copy — Hero**
- Title: "About EMCS"
- Subtitle: "Excellence Maple Canadian School"

**Copy — Who We Are (`about.whoWeAre`)**
- Title: "Who We Are"
- Body: "Excellence Maple Canadian School (EMCS), operating as Toronto Academy of English, Mathematics and Coding (EMC), is a Ministry-inspected private school authorized by the Ontario Ministry of Education to grant OSSD credits. We provide high-quality education for students from Grades 1-12 based on the official Ontario Curriculum. As an IB World School for the Diploma Programme, we maintain the highest standards in curriculum delivery and student support."
- BSID line: "BSID: 886229 | Inspected by the Ontario Ministry of Education"

**Copy — Our Story (`about.story` / `about.storyText`)**
- Title: "Our Story"
- Body: "EMCS was founded with a mission to bring world-class Canadian education to students around the globe. We recognized that geography should never be a barrier to quality education. Since our founding, we have helped thousands of students earn Ontario high school credits, complete their OSSD, and gain admission to top universities worldwide."

**Copy — Mission (`about.mission`)**
- Title: "Our Mission"
- Body: "To provide flexible, high-quality Ontario curriculum education that empowers students to achieve their academic goals and gain admission to top universities worldwide. We strive to inspire and equip our students with the necessary mindset and skills to become independent lifelong learners, fully dedicated to making tangible and positive contributions to their communities and beyond."

**Copy — Philosophy (`about.philosophy`)**
- Title: "Our Teaching Philosophy"
- Body: "Led by our motto, 'Teach for love. Learn for life', we are dedicated to fostering a dynamic community of individuals committed to lifelong learning. We embody the fundamental values and principles that prepare students for success in higher education and beyond."

**Copy — Mission Statement card (`about.missionStatement`)**
- Title: "Our Mission"
- Body: "Toronto Academy of EMC strives to inspire and equip our students with the necessary mindset and skills to become independent lifelong learners, fully dedicated to making tangible and positive contributions to their communities and beyond."

**Copy — Principal's Message (`about.principalMessage`)**
- Title: "Principal's Message"
- Body: "As the School year comes to an end, I want to extend a warm gratitude to our students, faculty and staff for another wonderful year of learning and growth. Every day I have the privilege of watching our students overcome new challenges and persevere, as they strive towards their academic goals and career aspirations."

**Copy — Accreditation grid (`about.accreditation` + `accreditationDetails`)**
- Section title: "Accreditation & Recognition"
- Lead: "We are a Ministry-inspected private school authorized by the Ontario Ministry of Education to grant Ontario Secondary School Diploma (OSSD) credits."
- "Ontario Ministry Inspection" — "BSID: 886229"
- "IB World School" — "Diploma Programme"
- "Credit Recognition" — "Same as traditional Ontario day schools"
- "Transcript Delivery" — "Direct to OUAC, OCAS, universities"

**Copy — What This Means (`about.whatThisMeans`)**
- Title: "What This Means"
- "Our OSSD is the exact same diploma issued by traditional Ontario day schools"
- "Credits are recognized by all Canadian colleges and universities"
- "International students can earn Canadian credentials without a study permit"
- "Marks are sent directly to OUAC and OCAS for post-secondary applications"

**Copy — Values (`about.values`)**
- "Excellence" — "We maintain the highest standards in curriculum delivery, assessment, and student support."
- "Accessibility" — "Quality education should be available to all students, regardless of location or circumstances."
- "Innovation" — "We leverage technology to create engaging and effective learning experiences that prepare students for the future."
- "Support" — "Every student receives personalized guidance throughout their educational journey."

**Copy — Leadership Team (`about.team`)**
- Title: "Leadership Team"
- Subtitle: "Dedicated educators committed to your success"
- Roles: "Principal" · "Academic Director" · "Student Success Lead" · "Technology Director"

---

## `/courses` — Courses catalog

- **Source:** [src/pages/Courses.jsx](../src/pages/Courses.jsx)
- **Renders inside:** Header + Footer

**Structure**
1. Hero (h1 + subtitle)
2. Programs overview cards (4)
3. Grade tabs (Grade 1 … Grade 12)
4. Course grid for the selected grade (cards: code, type badge, title, description, "Course Outline" / "Add to Cart")

**Copy — Hero (`courses`)**
- Title: "Courses"
- Subtitle: "Browse our full catalog of Ontario curriculum courses"
- Grade tab labels: Grade 1 · Grade 2 · Grade 3 · Grade 4 · Grade 5 · Grade 6 · Grade 7 · Grade 8 · Grade 9 · Grade 10 · Grade 11 · Grade 12
- Per-course buttons: "Course Outline" · "Add to Cart"
- Course type badges: "University" · "College" · "Mixed" · "Open"
- Field label: "Prerequisite"
- Empty/error state: "Course Not Found" — "The course code you are looking for does not exist in our catalog." — "Back to Courses"

**Copy — Programs preview (`programs`)**
- Section title: "Our Programs"
- Subtitle: "Multiple pathways to Canadian education—choose the one that fits your goals"
- **Academic Preparation Program**
  - Short name: "Academic Prep"
  - Tagline: "Self-paced learning for practice and enrichment"
  - Description: "Build strong foundations with video lessons and interactive activities"
  - Delivery: "Self-Learning via LMS Platform"
  - Grade range: "Grades 1-12"
- **Official Ontario Program**
  - Short name: "Official Ontario"
  - Tagline: "Earn official OSSD credits"
  - Description: "Live classes with Ontario Certified Teachers"
  - Delivery: "Live Classes with Ontario Certified Teachers"
  - Grade range: "Grades 1-12"
  - Badge: "Most Popular"
- Comparison table headers (Version 2): "Program" · "Grades" · "Format" · "Student Record" · "Credential" · "Full-Year Price" · "Per-Course Price"
- Rows (Version 2, reconciled with Price Table 1 to 5, Price Table 6 to 8, and Ontario Official Programs 9 to 12 feedback docs):
  - "Academic Preparation Program (Elementary)" — Grades "1 to 5" — Format "100% Self-Paced via LMS" — Student Record "Non-Ontario student record" — Credential "Certificate of Completion" — Full-Year "$325 CAD (50% off $650) for all 6 subjects" — Per-Course "$75 CAD (50% off $150)"
  - "Upgrade to Ontario Official Program (Elementary)" — Grades "1 to 5" — Format "Guided with Ontario student record" — Student Record "Ontario student record" — Credential "Ontario Academic Report Card" — Full-Year "$600 CAD for all 6 subjects" — Per-Course "$250 CAD"
  - "Primary Foundation (Live Teacher-Led, legacy premium)" — Grades "1 to 5" — Format "Live Online Classes, 6 hrs/week" — Student Record "Ontario student record" — Credential "Ontario Report Card" — Full-Year "$3,500 CAD/year" — Per-Course "Included in full-year package"
  - "Academic Preparation Program (Middle School)" — Grades "6 to 8" — Format "100% Self-Paced via LMS" — Student Record "Non-Ontario student record" — Credential "Certificate of Completion" — Full-Year "$325 CAD for all 6 subjects" — Per-Course "$75 CAD (50% off $150)"
  - "Upgrade to Ontario Official Program (Middle School)" — Grades "6 to 8" — Format "Guided with Ontario student record" — Student Record "Ontario student record" — Credential "Ontario Academic Report Card" — Full-Year "$600 CAD for all 6 subjects" — Per-Course "$250 CAD"
  - "Academic Preparation Program (High School, Non-Credit)" — Grades "9 to 12" — Format "100% Self-Paced" — Student Record "Non-Ontario student record" — Credential "No OSSD credit" — Per-Course "$75 to $150 CAD"
  - "Official Ontario Program (High School)" — Grades "9 and 10" — Format "Live + Self-Paced, 8-credit one-year program" — Student Record "Ontario student record" — Credential "OSSD Credits" — Full-Year "Contact for current tuition (domestic, visa, international tiers apply)"
  - "Official Ontario Program (High School)" — Grades "11 and 12" — Format "Live + Self-Paced, 7-credit one-year program" — Student Record "Ontario student record" — Credential "OSSD Credits, leads to OSSD graduation" — Full-Year "Contact for current tuition"

*Note regarding fees across all rows:* Grades 1 to 5 carry a $50 CAD registration fee and no entrance test fee. Grades 6 to 8 carry a $50 CAD registration fee and a $50 CAD entrance test fee. Grades 9 to 12 carry a $100 CAD registration fee and a $50 CAD entrance test fee. All fees are non-refundable.
- "Which Program Is Right for You?" decision tree (Version 2, aligned to the Web Design Layout "Learn First. Decide Later. Succeed Safely." promise):
  - **For Elementary Students (Grades 1 to 5):**
    - "Want curriculum-aligned learning without assessments?" → "Academic Preparation Program (Non-Ontario student record)"
    - "Want an Ontario student record without the premium teacher-led price tag?" → "Upgrade to Official Ontario Program ($600/year)"
    - "Want the premium live teacher-led experience with full Ontario report card?" → "Primary Foundation Teacher-Led Program ($3,500/year)"
  - **For Middle School Students (Grades 6 to 8):**
    - "Preparing to transition into Ontario high school pathways?" → "Academic Preparation Program"
    - "Need an Ontario student record to transfer into an Ontario day school?" → "Upgrade to Official Ontario Program"
  - **For High School Students (Grades 9 to 12):**
    - "Not sure yet if you want to commit to credit courses?" → "Academic Preparation Program — Learn First, Decide Later"
    - "Need credits toward your OSSD?" → "Official Ontario Program (8 credits Gr 9 and 10, 7 credits Gr 11 and 12)"
    - "Already completed the prior grade in your home country?" → "French as a Second Language is waived and an equivalent credit is granted"
    - "Want extra practice or exam prep alongside your credit courses?" → "Non-Credit Practice Courses"
  - **For International Students:**
    - "Preparing for Canadian high school?" → "Primary Foundation Program + Academic Preparation Program"
    - "Earning OSSD from abroad?" → "Official Ontario Program (no study permit required)"
    - "Aiming for Canadian or international university admission?" → "Official Ontario Program Grade 11 to 12 pathway with OUAC/OCAS transcript delivery"

**Copy — Subject cards block (`subjects`)**
- Mathematics — "Number sense, operations, algebra, and problem-solving"
- Language — "Reading, writing, speaking, and listening skills"
- Science & Technology — "Life systems, matter and energy, structures and mechanisms"
- Social Studies — "Heritage, communities, and citizenship"
- The Arts — "Visual arts, music, drama, and dance"
- Health & Physical Education — "Active living, movement skills, and healthy choices"
- Discount badge: "50% OFF"
- Delivery labels: "Self-paced video" · "Live classes"
- Buttons: "Enroll" · "Details"
- Coming-soon state: "Course coming soon"

---

## `/courses/:courseCode` — Course Detail (template)

- **Source:** [src/pages/CourseDetail.jsx](../src/pages/CourseDetail.jsx)
- **Renders inside:** Header + Footer

**Structure**
1. Hero (course badge, course title, grade info, **Register** button)
2. Sticky sidebar — "Quick Nav" + "Quick Facts"
3. Tabbed/scroll-anchored sections:
   - Overview / Description
   - Curriculum / Course Outline
   - Teaching strategies
   - Evaluation
   - Accommodations
   - Resources
   - FAQs

**Copy — Tabs (`coursePage.sections`)**
- "Overview" · "Curriculum" · "FAQs"
- Bonus text: "FREE: Practice course included"

**Copy — Why Choose EMCS Credit Courses? (`creditCourses.why`)**
- Title: "Why Choose EMCS Credit Courses?"
- "Ministry Inspected: Authorized by the Ontario Ministry of Education (BSID: 886229)"
- "Ontario Certified Teachers: All courses taught by teachers in good standing with the Ontario College of Teachers (OCT)"
- "Same Credits as Day Schools: Our credits hold the same value as those earned in traditional Ontario schools"
- "Direct Transcript Delivery: Marks sent directly to OUAC, OCAS, and your day school"
- "Globally Recognized: OSSD credentials accepted by universities in Canada, US, UK, Australia, and worldwide"

**Copy — Course Format (`creditCourses.format`)**
- Title: "Course Format"
- **Live Online Classes:**
  - "Interactive Zoom sessions with certified teachers"
  - "6 hours per week total"
  - "Small group sizes for personalized attention"
  - "Recorded lessons available for review"
- **Self-Paced Components:**
  - "24/7 access to course materials"
  - "Practice assignments and homework"
  - "Complete coursework on your schedule"
- **Assessments:**
  - "Quizzes and tests throughout the course"
  - "Major assignments and projects"
  - "Proctored final examination (30% of final grade)"

**Copy — Evaluation Structure (`creditCourses.evaluation`)**
- Title: "Evaluation Structure"
- "Term Work (assignments, tests, projects)" — 70%
- "Final Examination (proctored)" — 30%

**Copy — What's Included (`creditCourses.whatsIncluded`)**
- Title: "What's Included"
- "Live Zoom sessions with Ontario Certified Teacher"
- "Recorded lesson replays"
- "All course materials and resources"
- "Practice assignments and homework"
- "Quizzes and unit tests"
- "Final examination (proctored)"
- "Official Ontario transcript"
- "Report card"
- "BONUS: FREE related non-credit practice course"

**Copy — Pathways (`creditCourses.pathways`)**
- "Grade 9 - Foundation" — "Build essential skills across core subjects with de-streamed courses designed for all learners."
- "Grade 10 - Academic Focus" — "Deepen your understanding with academic-level courses preparing you for senior studies."
- "Grade 11 - Pre-University" — "University and college preparation courses to build your pathway to post-secondary success."
- "Grade 12 - University Preparation" — "Complete your OSSD requirements with courses designed for direct university application."

**Copy — Credit Courses CTA (`creditCourses.cta`)**
- Title: "Ready to Earn Ontario Credits?"
- Subtitle: "Join thousands of students worldwide earning their OSSD with EMCS."
- Buttons: "Browse Credit Courses" · "Speak with a Counselor" · "Request Information"

**Copy — Practice Courses block (`practiceCourses`)** *(rendered when course is non-credit)*
- Label: "Non-Credit | Practice & Preparation"
- Title: "Non-Credit Practice Courses"
- Subtitle: "Build skills at your own pace with engaging video lessons and practice activities"
- Disclaimer: "Please Note: These courses do NOT earn Ontario high school credit. Completion will NOT appear on any transcript or academic record."
- **What Are Practice Courses?**
  - "Practice courses provide curriculum-aligned learning materials for skill-building and extra practice. They are designed for students who want to learn without the pressure of assessments or grades."
  - "These courses are NOT:" — "Credit-bearing" · "Assessed or graded" · "Included on transcripts" · "Official Ontario credentials"
  - "These courses ARE:" — "Curriculum-aligned" · "Self-paced" · "Available 24/7" · "Perfect for practice and preparation"
- **What's Included:** "High-quality video lessons" · "Interactive practice activities" · "Homework exercises" · "Self-paced learning" · "12-month access"
- **What's NOT Included:** "Tests or assessments" · "Report cards or transcripts" · "Ontario OSSD credit" · "Live teacher instruction" · "Graded assignments"
- **Perfect For:**
  - "Extra Practice: Supplement your regular schoolwork"
  - "Summer Learning: Get ahead before the new school year"
  - "Homeschool Support: Ontario curriculum-aligned resources"
  - "Exam Preparation: Review and reinforce concepts"
  - "International Students: Prepare for Canadian studies"
  - "Skill Building: Learn at your own pace without pressure"
- **Pricing:**
  - "Elementary (Grades 1-5): $75 CAD per subject"
  - "Middle School (Grades 6-8): $75-150 CAD per subject"
  - "High School (Grades 9-12): $75-150 CAD per course"
- **Grade groups:**
  - "Elementary (Grades 1-5)" — "Fun, interactive learning with engaging videos and practice activities aligned with the Ontario Curriculum."
  - "Middle School (Grades 6-8)" — "Build strong foundations for high school success with comprehensive subject coverage."
  - "High School (Grades 9-12)" — "Practice and reinforce Ontario curriculum concepts to prepare for credit courses or supplement your studies."
- **Cross-sell:** "Want to earn Ontario credits?" — "Our Credit Courses include live instruction with Ontario Certified Teachers, official assessments, and transcripts recognized by universities worldwide." — CTA: "View Credit Courses"
- **IMPORTANT: Non-Credit Course Disclaimer**
  - "Completion of practice courses will NOT earn you a high school credit or Ontario academic record. These courses are designed for learning and practice only."
  - "Practice courses do NOT include:" — "Official assessments or grades" · "Report cards or transcripts" · "Ontario OSSD credit" · "University/college recognition"
  - "If you need official credits, please enroll in our Credit Courses."
- **Bottom CTA:** "Start Practicing Today" — "Choose your grade level and begin your self-paced learning journey." — "Browse Practice Courses" / "Need Credits Instead? View Credit Courses"

---

## `/admissions/international` — International Students

- **Source:** [src/pages/InternationalStudents.jsx](../src/pages/InternationalStudents.jsx)

**Structure**
1. Hero (badge + h1 + subtitle + highlight)
2. Why Choose EMCS? (4 cards)
3. Benefits for international students (cards + bullet list)
4. Pathway Advantages (4 cards)
5. How to Get Started (5 numbered steps)
6. Programs for International Students (Elementary + High School cards)
7. Tuition cards (Per Course + OSSD Package)
8. Vietnamese-language section
9. Final CTA

**Copy — Hero (`international`)**
- Title: "International Students"
- Subtitle: "Earn your Canadian education credentials from Vietnam or anywhere in the world"
- Badge: "No Study Permit Required for Online Courses"
- Highlight: "No Study Permit Required" — "Take EMCS online courses without needing a Canadian study permit"

**Copy — Why Choose EMCS? (`international.why`)**
- Title: "Why Choose EMCS?"
- "Study From Anywhere" — "Learn from Vietnam, China, India, or any country in the world—all you need is internet access."
- "No Study Permit Required" — "Take EMCS online courses without needing a Canadian study permit. Study from your home country."
- "Authentic Canadian Credentials" — "Earn an official Ontario Secondary School Diploma (OSSD) or elementary academic record—the same credentials issued by traditional Ontario schools."
- "University Preparation" — "Meet admission requirements for top universities worldwide. Our OSSD is recognized globally as a valid entry credential."

**Copy — Benefits (`international.benefits`)**
- Title: "Benefits for International Students"
- Bullets:
  - "Global Access: Study from anywhere with internet"
  - "No Visa Required: Online courses don't require study permit"
  - "Cost Savings: No travel, boarding, or living expenses"
  - "Flexible Schedule: Study on your time zone"
  - "Same Credential: OSSD identical to in-person Ontario schools"
  - "Direct Applications: Marks sent to OUAC/OCAS"
  - "University Recognition: Accepted by top institutions worldwide"
- Cards:
  - "Study from Anywhere" — "Learn from Vietnam, China, India, or any country in the world."
  - "No Study Permit" — "Take courses without needing a Canadian study permit."
  - "Real Canadian Diploma" — "Earn an authentic Ontario Secondary School Diploma (OSSD)."
  - "University Preparation" — "Meet admission requirements for top universities worldwide."

**Copy — Pathway Advantages (`international.pathwayAdvantages`)**
- Title: "Pathway Advantages"
- "Migration Consideration" — "Ideal for students planning to migrate to Canada, the UK, USA, Australia, or other countries. Canadian credentials are highly regarded globally."
- "University Admission" — "A Canadian high school diploma (OSSD) is recognized by top universities and colleges globally as a valid entry credential."
- "Efficient Completion" — "Unlike programs that take two years, OSSD requirements can be completed in as little as 12 months with dedicated study."
- "Assessment Structure" — "Our courses are evaluated through 70% coursework and 30% final exam—no high-stakes single exam determining your future."

**Copy — How to Get Started (`international.howTo`)**
- Title: "How to Get Started"
- Subtitle: "Your journey to Canadian credentials in 5 simple steps"
- 1: "Explore Programs - Browse our course catalog and choose your pathway"
- 2: "Add to Cart - Select courses and complete registration"
- 3: "Complete Payment - Pay tuition and fees securely"
- 4: "Submit Documents - Provide ID and academic records for verification"
- 5: "Start Learning - Access your courses within 24-48 hours"
- Short labels: "Explore Programs" · "Add to Cart" · "Complete Payment" · "Submit Documents" · "Start Learning!"

**Copy — Programs for International Students (`international.programsForInternational`)**
- Title: "Programs for International Students"
- **Elementary Foundation (Grades 1-5)**
  - Self-Learning Option:
    - "Perfect for curriculum exposure and practice"
    - "From $75 CAD per subject"
    - "No assessments required"
  - Teacher-Led Option:
    - "Official Ontario academic record"
    - "$3,500 CAD per year + fees"
    - "Live classes with Canadian teachers"
- **High School Credit (Grades 9-12)**
  - "Official OSSD credits"
  - "Ontario Certified Teachers"
  - "Transcripts to OUAC/OCAS"
  - "Contact for pricing"

**Copy — Tuition for International Students (`international.tuition`)**
- Title: "Tuition for International Students"
- Subtitle: "Transparent pricing with no hidden fees"
- **Per Course Fee** — "Full credit course included"
  - "Full credit course"
  - "All course materials included"
  - "Teacher support included"
  - "12-month course access"
  - "Official transcript included"
  - "Proctored exam included"
- **OSSD Package** — Badge "Best Value" — "Contact for customized quote"
  - "Custom credit plan based on your needs"
  - "Guidance counselor support"
  - "University application assistance"
  - "Priority support"
  - "OSSLT preparation"
  - "Volume discounts available"

**Copy — Vietnamese section (`international.vietnamese`)**
- Title: "For Vietnamese Students and Families"
- Subtitle (in Vietnamese): "Dành cho học sinh và phụ huynh Việt Nam"
- Body: "We understand that education decisions involve the whole family. Our team is available to provide information in Vietnamese and answer questions from both students and parents."
- "Key considerations for Vietnamese families:"
  - "Total Cost Transparency: All fees clearly stated—no hidden costs"
  - "Post-Graduation Pathways: OSSD opens doors to Canadian universities and immigration opportunities"
  - "Family Communication: Regular progress updates for parents"
  - "Time Zone Flexibility: Asynchronous learning fits Vietnamese schedules"
- CTA: "Contact Us in Vietnamese"

**Copy — Final CTA (`international.cta`)**
- Title: "Ready to Start Your Canadian Education Journey?"
- Subtitle: "Join students from over 130 countries earning their Canadian credentials with EMCS."
- Buttons: "Start Your Application" · "Request Information" · "Speak with an Advisor"

---

## `/ossd-requirements` — OSSD Requirements

- **Source:** [src/pages/OssdRequirements.jsx](../src/pages/OssdRequirements.jsx)

**Structure**
1. Hero (h1 + subtitle + highlight)
2. Overview stat strip (Total Credits / Compulsory / Optional / Literacy / Community / Online)
3. Compulsory Credits table (11 rows)
4. Additional Requirements (3 cards)
5. How EMCS Helps You Graduate (5 bullets)
6. CTA

**Copy — Hero (`ossd`)**
- Title: "OSSD Requirements"
- Subtitle: "What you need to graduate with an Ontario Secondary School Diploma"

**Copy — Overview strip (`ossd.overview`)**
- "Total Credits" — "30"
- "Compulsory Credits" — "18"
- "Optional Credits" — "12"
- "Literacy Requirement" — "OSSLT or OSSLC"
- "Community Involvement" — "40 hours"
- "Online Learning" — "Minimum 2 credits"

**Copy — Compulsory Credits table (`ossd.compulsory*` + `ossd.subjects` + `ossd.notes`)**
- Section title: "18 Compulsory Credits"
- Subtitle: "Required subjects for all OSSD graduates"
- Table headers: "Subject" · "Credits" · "Notes"
- Rows (English / Math / Science / etc.):
  - "English" — 4 — "1 credit per grade (9, 10, 11, 12)"
  - "Mathematics" — 3 — "At least 1 in Grade 11 or 12"
  - "Science" — 2 — *(no note)*
  - "Canadian History" — 1 — "Grade 10"
  - "Canadian Geography" — 1 — "Grade 9"
  - "Arts" — 1 — "Music, Art, Drama, or Dance"
  - "Health & Physical Education" — 1
  - "French as a Second Language" — 1
  - "Career Studies" — 0.5
  - "Civics" — 0.5
  - "Group 1, 2, or 3" — 3 — "Additional from specified groups"
- Total label: "Total"

**Copy — Additional Requirements (`ossd.additional`)**
- Title: "Additional Requirements"
- Subtitle: "Beyond credits, you must also complete:"
- "Ontario Secondary School Literacy Test (OSSLT)" — "Must successfully complete the OSSLT or the Ontario Secondary School Literacy Course (OSSLC)."
- "40 Hours Community Involvement" — "Complete 40 hours of community service before graduation."
- "Online Learning Requirement" — "Minimum of 2 online learning credits (fulfilled through EMCS courses)."

**Copy — How EMCS Helps (`ossd.howEmcsHelps`)**
- Title: "How EMCS Helps You Graduate"
- "Course Planning: Guidance counselors help you select the right courses"
- "Credit Tracking: Monitor your progress toward graduation requirements"
- "Transcript Management: Official records maintained and sent to universities"
- "OSSLT Preparation: Support for literacy test requirements"
- "Community Hours: Guidance on completing volunteer requirements"

**Copy — CTA (`ossd.cta`)**
- Title: "Ready to Start Your OSSD Journey?"
- Subtitle: "Our guidance counselors can help you plan your path to graduation."
- Button: "Contact a Counselor"

---

## `/student-support` — Student Support

- **Source:** [src/pages/StudentSupport.jsx](../src/pages/StudentSupport.jsx)

**Structure**
1. Hero (h1 + subtitle)
2. Services grid (4 cards)
3. Response Times table
4. How to Get Support (3 cards)
5. CTA

**Copy — Hero (`support`)**
- Title: "Student Support"
- Subtitle: "We're here to support you every step of your educational journey"

**Copy — Services (`support.services`)**
- **Academic Support** — "Get help from your teachers within 48 hours of submitting a question."
  - Features: "Teacher Q&A via course messaging" · "Assignment feedback and guidance" · "Extra resources and practice materials" · "Office hours for real-time help"
- **Guidance Counseling** — "One-on-one support for course selection, credit planning, and graduation requirements."
  - Features: "Personalized credit plans" · "Course recommendations" · "Graduation tracking" · "Academic pathway planning"
- **University Applications** — "Expert help navigating OUAC, OCAS, and international university applications."
  - Features: "OUAC/OCAS submission assistance" · "Personal statement guidance" · "Scholarship application support" · "Direct transcript delivery"
- **Technical Support** — "Help with our learning platform, exam proctoring, and technical issues."
  - Features: "Platform training and orientation" · "Exam tech support" · "Account assistance" · "24/7 technical resources"

**Copy — Response Times (`support.responseTimes`)**
- Title: "Response Times"
- "Teacher Questions: Within 48 hours"
- "Assignment Grading: Within 5-7 business days"
- "Administrative Inquiries: Within 24-48 hours"
- "Technical Support: Within 24 hours"

**Copy — How to Get Support (`support.howTo`)**
- Title: "How to Get Support"
- Subtitle: "Multiple ways to reach us when you need help"
- "Email Your Teacher" — "Use the messaging system in your course to ask questions directly."
- "Book a Counselor" — "Schedule a video call with a guidance counselor for personalized help."
- "Live Chat" — "Get instant answers from our support team during business hours."

**Copy — CTA (`support.cta`)**
- Title: "Need Help Now?"
- Subtitle: "Our team is ready to assist you with any questions or concerns."
- Button: "Contact Support"

---

## `/faq` — Frequently Asked Questions

- **Source:** [src/pages/Faq.jsx](../src/pages/Faq.jsx)

**Structure**
1. Hero (h1 + subtitle)
2. Category tabs (6)
3. Accordion of 15 Q&A items
4. CTA

**Copy — Hero & categories (`faq`)**
- Title: "Frequently Asked Questions"
- Subtitle: "Find answers to common questions about our programs"
- Category labels: "General Questions" · "Credit Courses" · "Primary Foundation Program (Grades 1-5)" · "Non-Credit Practice Courses" · "International Students" · "Technical Requirements"

**Copy — Q&A (verbatim)**

> **Q1. Is EMCS accredited?**
> A1. Yes, EMCS is a Ministry-inspected private school authorized by the Ontario Ministry of Education to grant OSSD credits. Our BSID is 886229. Our credits hold the same value as those earned in traditional Ontario day schools.

> **Q2. When can I start?**
> A2. We have continuous enrollment year-round. You can register at any time and typically start your course within 24-48 hours.

> **Q3. How long do I have to complete a course?**
> A3. You have up to 12 months from enrollment to complete each course, though most students finish in 3-4 months. Fast-track options allow completion in as little as 4 weeks.

> **Q4. Are EMCS credits the same as regular Ontario high school credits?**
> A4. Yes. Our credits are identical to those earned at traditional Ontario day schools. They appear on official Ontario transcripts and are recognized by all Canadian colleges and universities.

> **Q5. Are there final exams?**
> A5. Yes, all credit courses require a proctored final exam worth 30% of your grade. You can write your exam online with a remote proctor or at an approved testing center.

> **Q6. How do I get my marks sent to universities?**
> A6. We send midterm and final marks directly to OUAC, OCAS, and your day school. Simply provide your application numbers through our transcript request system.

> **Q7. Can I transfer credits from another school?**
> A7. Yes! We accept transfer credits from Ontario and other Canadian schools. International students can also have their transcripts evaluated for credit equivalency.

> **Q8. What is the difference between Self-Learning and Teacher-Led?**
> A8. Self-Learning provides access to curriculum-aligned materials for practice—no assessments, no report card, no teacher interaction. Teacher-Led includes live online classes with Canadian teachers, required assessments, and an official Ontario academic report card.

> **Q9. Does the Self-Learning program provide credits?**
> A9. No. The Primary Foundation Self-Learning program does not provide OSSD credits (which only apply to Grades 9-12) or an Ontario academic record. For an official record, either choose the Teacher-Led option or add the Ontario Academic Record add-on ($250 per course) to your Self-Learning enrollment.

> **Q10. Is the Primary Foundation program accredited?**
> A10. EMCS is an Ontario Ministry-inspected private school. The Teacher-Led Primary Foundation program includes official Ontario academic report cards. The Self-Learning program provides curriculum-aligned practice materials without formal credentialing.

> **Q11. Do practice courses give me credits?**
> A11. No. Practice courses are designed for skill-building and extra practice only. They do NOT earn Ontario high school credits and will NOT appear on any transcript or academic record. If you need credits, please enroll in our Credit Courses.

> **Q12. What's included in practice courses?**
> A12. Video lessons, interactive practice activities, and homework exercises. No tests, no grades, no assessments, and no teacher instruction.

> **Q13. Do I need a study permit?**
> A13. No. You can take EMCS online courses from anywhere in the world without a Canadian study permit.

> **Q14. Is my OSSD recognized internationally?**
> A14. Yes. The Ontario Secondary School Diploma (OSSD) is recognized by universities worldwide, including institutions in Canada, the United States, United Kingdom, Australia, and many other countries.

> **Q15. What technology do I need?**
> A15. You need a computer or tablet with internet access, a webcam for proctored exams, and basic software like a web browser and PDF reader. No special software purchases required.

**Copy — CTA (`faq.cta`)**
- Title: "Still have questions?"
- Subtitle: "Our team is here to help. Contact us and we'll get back to you within 24 hours."
- Button: "Contact Us"

---

## `/contact` — Contact Us

- **Source:** [src/pages/Contact.jsx](../src/pages/Contact.jsx)

**Structure**
1. Hero (h1 + subtitle)
2. Contact form (Name / Email / Phone / Country / Subject / Message / Submit) + success state
3. Contact info cards (Address / Phone / Email / Hours)
4. Department contacts
5. Social follow

**Copy — Hero (`contact`)**
- Title: "Contact Us"
- Subtitle: "We're here to help with any questions"

**Copy — Form labels (`contact`)**
- Card heading: "Send us a message"
- Field labels: "Your Name" · "Your Email" · "Phone Number (optional)" · "Country" · "Subject" · "Your Message"
- Subject placeholder: "Select a topic..."
- Subject options (`contact.topics`): "General Inquiry" · "Course Enrollment" · "Transfer Credits" · "Technical Support" · "Guidance Counseling" · "International Students" · "Primary Foundation Program" · "Other"
- Submit button: "Send Message"

**Copy — Contact info cards**
- "Address"
- "Phone"
- "Email"
- "Hours" — "Monday - Friday, 9:00 AM - 5:00 PM EST"

**Copy — Departments (`contact.departments`)**
- Title: "Department Contacts"
- "Admissions" · "Student Support" · "Guidance" · "Technical"
- "Response Time": "Within 24 hours" / "Within 48 hours"

**Copy — Social**
- "Follow us"

---

## `/programs/elementary` — Primary Foundation Program

- **Source:** [src/pages/PrimaryFoundation.jsx](../src/pages/PrimaryFoundation.jsx)

**Structure**
1. Hero (badge + h1 + subtitle)
2. Program Overview (title, body, French note, purpose)
3. Two pathways: Option 1 (Self-Learning) vs Option 2 (Teacher-Led)
4. Disclaimers (Self-Learning + Teacher-Led)
5. Grades breakdown (Grade 1 – Grade 5 cards)
6. Comparison table (8 features)
7. Final CTA

**Copy — Hero (`primaryFoundation`)**
- Title: "Ontario Primary Foundation Program"
- Subtitle: "Building Essential Academic Foundations for Grades 1-5"
- Badge: "Aligned with Ontario Curriculum"

**Copy — Program Overview (`primaryFoundation.overview`)**
- Title: "Program Overview"
- Body: "This program supports students in Grades 1-5 in building essential academic foundations aligned with the Ontario Curriculum. Core subjects include English (Language), Mathematics, Science, Social Studies, The Arts, and Health & Physical Education."
- French note: "French as a Second Language is introduced starting in Grade 4."
- Purpose: "Prepare students for future studies within the Ontario education system through a clear, structured, and academically sound learning pathway. Students study all subjects in English, supporting language development and early exposure to an international learning environment."

**Copy — Option 1: Self-Learning (`primaryFoundation.selfLearning`)**
- Title: "Option 1: Academic Preparation Program (Self-Learning)"
- Badge: "100% Self-Paced | No Ontario Student Record"
- **What's Included:**
  - "All learning materials provided"
  - "Student and parent login credentials"
  - "24/7 access to course content"
  - "Learn at your own pace"
- Important note: "This program does not include assessments, evaluations, or an Ontario academic record. It is designed for:"
- **Ideal for:**
  - "Extra practice alongside regular school"
  - "Summer learning to get ahead"
  - "Homeschool curriculum support"
  - "International students preparing for Canadian studies"
- **Pricing (with 50% promotional discount):**
  - "Grade 1-3: 6 subjects" — "Regular Price" / "Discounted Price" — "$75 CAD each"
  - "Grade 4-5: 6 subjects + French" — "$75 CAD each"
  - "French as a Second Language" — "$150 CAD"
- **Subjects Available:**
  - "Mathematics (English)"
  - "Language (English)"
  - "The Arts (English)"
  - "Science & Technology (English)"
  - "Health & Physical Education (English)"
  - "Social Studies (English)"
  - "French as a Second Language (French) - Grades 4-5 only"
- **Additional Fees:**
  - "Entrance Test Fee: $50 CAD (non-refundable)"
  - "Registration Fee: $35 CAD (non-refundable)"
- Optional add-on: "If an official Ontario academic record is required, an additional $250 CAD applies per course on top of the discounted price."
- CTA: "Enroll in Self-Learning Program"

**Copy — Option 2: Teacher-Led (`primaryFoundation.teacherLed`)**
- Title: "Option 2: Official Ontario Program (Teacher-Led)"
- Badge: "Ontario Student Record | Live Classes with Canadian Teachers"
- **What's Included:**
  - "All learning materials provided"
  - "Student and parent login credentials"
  - "Live online classes with Ontario Certified Teachers"
  - "All required assessments and evaluations"
  - "Official Ontario academic report card upon completion"
- **Schedule Options:**
  - "6 hours per week over 3 days, OR"
  - "6 hours per week over 2 days"
- Duration: "Program Duration: September 5, 2026 – May 30, 2027 (39 weeks)"
- **Requirements:**
  - "Students must complete all required assessments"
  - "Students must complete the program by May 30, 2027"
- **Pricing:**
  - "Core Subjects (6 subjects)" — "$3,500 per year"
  - "French as a Second Language (1 hr/week)" — "$2,000 per year (additional)"
  - "Entrance Test Fee" — "$50 (non-refundable)"
  - "Registration Fee" — "$100 (non-refundable)"
- **Core Subjects (Delivered in English):** Mathematics · Language · The Arts · Science & Technology · Health & Physical Education · Social Studies
- French note: "French as a Second Language: Delivered in French by Canadian Teachers (Grades 4-5)"
- CTA: "Enroll in Teacher-Led Program"

**Copy — Comparison Summary (`primaryFoundation.comparison`)**
- Title: "Program Comparison Summary"
- Headers: "Feature" · "Self-Learning" · "Teacher-Led"
- Rows:
  - "Learning Materials" — "Included" / "Included"
  - "24/7 Course Access" — "Yes" / "Yes (recordings available)"
  - "Assessments" — "None" / "Required"
  - "Live Classes" — "None" / "6 hours/week"
  - "Teacher Support" — "Limited" / "Direct access"
  - "Ontario Report Card" — "Not included*" / "Included"
  - "Start Anytime" — "Yes" / "September start"
  - "Completion Deadline" — "Flexible" / "May 30, 2027"
  - "Best For" — "Practice, homeschool support" / "Official credential"
- Footnote: "*Ontario academic record available for additional $250/course"

**Copy — Disclaimers (`primaryFoundation.disclaimers`)**
- **Self-Learning** — "Please Note:" — "Completion of Self-Learning courses will NOT earn an Ontario academic record unless the optional $250 per course fee is paid. This program is designed for practice and curriculum exposure, not formal credentialing."
  - "Self-Learning courses are ideal for:"
    - "Supplementary learning alongside regular school"
    - "Homeschool curriculum support"
    - "International students preparing for Canadian studies"
    - "Summer learning and skill-building"
- **Teacher-Led** — "Students enrolled in the Teacher-Led program will receive an official Ontario academic report card upon successful completion of all program requirements. This report card is issued by EMCS as a Ministry-inspected private school and can be used for school transfers and academic planning."

**Copy — Grades (`primaryFoundation.grades`)**
- "Grade 1" — "Building foundational literacy and numeracy skills through engaging, age-appropriate activities."
- "Grade 2" — "Expanding reading comprehension, mathematical reasoning, and scientific inquiry."
- "Grade 3" — "Strengthening independent learning skills and deeper subject exploration."
- "Grade 4" — "Introduction to French as a Second Language. Building critical thinking and research skills."
- "Grade 5" — "Preparing students for the transition to middle school with advanced problem-solving and communication skills."

**Copy — CTA (`primaryFoundation.cta`)**
- Title: "Start Building Your Child's Canadian Education Foundation"
- Subtitle: "Our Primary Foundation Program prepares students for success in the Ontario education system and beyond."
- Buttons: "Enroll in Self-Learning" · "Enroll in Teacher-Led" · "Speak with an Advisor"

---

## `/grade/:grade` — Grade page (program-agnostic, shared template)

- **Source:** [src/pages/GradePage.jsx](../src/pages/GradePage.jsx)
- **Renders inside:** Header + Footer
- Same component is reused under `/academic-prep/grade/:grade`, `/academic-prep/grade/:grade/courses`, `/official-ontario/grade/:grade`, `/official-ontario/grade/:grade/courses`. The bare `/grade/:grade` route shows both programs side-by-side.

**Structure (Grades 1–8)**
1. Hero (program-aware h1 + subtitle)
2. Two pricing cards side-by-side: Academic Prep (Non-Credit) vs Official Ontario (Credit)
3. Toggle: "Full Year Pricing" / "Single Course Pricing"
4. Subject table (6 subjects, language column, delivery column)
5. Promo banner (50% discount messaging)
6. Comparison table

**Structure (Grades 9–12)**
1. Hero ("ONTARIO CURRICULUM PROGRAMS (Grades 9–12)" — "Flexible Learning Pathways" — "Learn First. Decide Later. Succeed Safely.")
2. Intro paragraph
3. Academic Prep timetable (Course Code / Course Name / Type / Credit / Price / 50% Discount columns)
4. Grade total + Registration Fee + Entrance Test Fee
5. Official Ontario timetable
6. Compare Programs section (8 rows)
7. Enroll CTAs

**Copy — Headings & toggles (`gradePage`)**
- Hero title: "Grade {grade} Programs"
- Hero subtitle: "Choose the program that fits your learning goals. Both options are aligned with the Ontario Curriculum."
- Toggles: "Full Year Pricing" · "Single Course Pricing"
- "All 6 Subjects" · "Full Year Package" · "per subject" · "for all 6 subjects"
- "Subjects Included:" · "What You Get:"
- Helper link: "For single course pricing, click here →"
- Badge: "Most Popular"
- Buttons: "Enroll in Full Year" · "Enroll in Course"
- Section: "Program Schedule"
- Section: "Individual Courses – Grade {grade}"
- Helper: "Choose specific subjects that fit your needs"
- Invalid grade fallback: "Invalid Grade" — "Sorry, we don't have pricing information for grade {grade}." — "Return Home"

**Copy — High School heading block**
- Heading: "ONTARIO CURRICULUM PROGRAMS (Grades 9–12)"
- Subheading: "Flexible Learning Pathways"
- Tagline: "Learn First. Decide Later. Succeed Safely."
- Intro: "We offer programs based on the Ontario Curriculum for students in Grades 9–12, with two flexible learning pathways:"

**Copy — Academic Prep section (`gradePage`)**
- Title: "Academic Preparation Program (Non-Credit)"
- Schedule label: "Schedule"
- Table headers: "Subject" · "Language" · "Delivery Method"
- Language value: "English"
- Delivery value: "Self-Learning via LMS Platform"
- "What's Included:" — "All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace"
- Promo banner: "Enroll now and receive a 50% discount — only ${price} for a 1-year program"
- Fee labels: "Registration Fee" · "Entrance Test Fee" · "Price per Course"
- Discount badge: "50% OFF"
- "Full Year (6 subjects)"
- Single course link: "For single course pricing, click here →"
- CTA: "Enroll Now"

**Copy — Upgrade prompt**
- Button: "Upgrade to Official Ontario Program"
- Subtext: "(Ontario student record)"
- Connector word: "to"

**Copy — High School timetable section**
- Title: "Grade {grade} Academic Year Timetable & Tuition Fee"
- Table headers: "Course Code" · "Course Name" · "Type" · "Credit" · "Price (CAD)" · "50% Discount (CAD)"
- "Grade {grade} Total"
- Fee row labels: "Registration Fee:" · "Entrance Test Fee:" · "(non-refundable)"
- Section: "Ontario Official High School Program"
- Subtext: "Study with Canadian Teachers"
- Headers: "Type of Credit" · "Price per Course (CAD)"
- "Discounted Tuition ({credits} credits):"
- Word: "year"
- Word: "Note"

**Copy — Compare Programs section**
- Title: "Compare Programs"
- Headers: "Academic Preparation Program (Non-Ontario student record)" · "Official Ontario Program (Ontario student record)"
- Rows:
  - "Purpose" — "Preparation for entry into the Official Ontario Program" / "Official Ontario high school program"
  - "Program Type" — "Preparation for credit" / "Credit-based secondary program"
  - "Curriculum" — "Ontario-aligned" / "Official Ontario Curriculum"
  - "Academic Focus" — "Math, English, Science, and Social Studies" / "Math, English, Science, and Social Studies"
  - "Assessment" — "Skill-based feedback" / "Graded courses with records and credits"
  - "Progression" — "Pathway to the Official Ontario Program" / "OSSD completion"
  - "Outcome" — "Academic readiness" / "OSSD & university preparation"

**Copy — Single course descriptions**
- "Choose specific subjects that fit your needs"
- "Academic Preparation Program – Self-Paced Learning"
- "Video lessons and interactive activities · ${price} per subject (50% off regular price)"
- "Official Ontario Program – Live Classes"
- "Live instruction with Ontario Certified Teachers · ${price} per subject"

---

# Storefront pages

## `/academic-prep` — Academic Preparation Landing

- **Source:** [src/pages/AcademicPrepLanding.jsx](../src/pages/AcademicPrepLanding.jsx)
- **Renders inside:** Header + Footer (wrapped in StorefrontProvider)

**Structure**
1. Hero (program badge + h1 + hero description + 4 feature pills)
2. What's Included (6 cards)
3. Browse by Grade Level (3 expandable groups)
4. Pricing card
5. Why Choose (4 key features)
6. Final CTA

**Copy — Hero (`academicPrep`)**
- Title: "Academic Preparation Program (Non-Credit)"
- Description: "The Academic Preparation Program (Non-Credit) is designed for students who aspire to pursue a rigorous academic pathway within an international educational framework. The program focuses on establishing strong academic foundations while cultivating analytical thinking, disciplined study habits, and the confidence required to succeed within the Canadian education system. Developed in alignment with Ontario curriculum standards, the program strengthens students' competencies in Academic English, mathematical reasoning, and advanced learning skills. Through personalized learning pathways and close academic mentorship, the program provides a solid transition into OSSD credit courses or EAP programs, preparing students to excel in high-quality, globally oriented academic environments."
- Feature pills: "Video Lessons" · "Self-Paced" · "Practice Activities" · "24/7 Access"
- Starting price chip: "From $75/subject"

**Copy — What's Included (`academicPrep.included*`)**
- Section title: "What's Included"
- "Video Lessons" — "High-quality instructional videos covering the Ontario curriculum"
- "Practice Activities" — "Interactive exercises with immediate feedback"
- "Homework Exercises" — "Reinforcement activities to build confidence"
- "Self-Paced Learning" — "Learn anytime, anywhere at your own speed"
- "12-Month Access" — "Full access to all course materials for 12 months"
- "Progress Tracking" — "Monitor your learning journey and achievements"

**Copy — Browse by Grade (`academicPrep.gradeGroup*`)**
- Section title: "Browse by Grade Level"
- Subtitle: "Select a grade group to explore available courses"
- "Elementary (Grades 1-5)" — "Build strong foundations in core subjects"
- "Middle School (Grades 6-8)" — "Prepare for high school success"
- "High School (Grades 9-12)" — "Practice and review for credit courses"

**Copy — Pricing (`academicPrep.pricing*`) — Version 2**
- Promotional banner (global on Academic Prep landing): "Enroll now and receive a 50% discount — only $325 for a 1-year program."
- Elementary: "💰 **$75 per subject** (50% off the $150 regular price) or **$325 for the full year** (all 6 subjects, down from the $650 regular 6-subject price)."
- Middle School: "💰 **$75 per course** (50% off $150) or **$325 for the full year** (all 6 subjects)."
- High School: "💰 **$75 per course** (50% off $150) or **$325 for the full year**."
- Helper: "Full year from $325 with the 50% promotional discount."
- Fee notes:
  - "Registration Fee: $50 CAD (Grades 1 to 8) / $100 CAD (Grades 9 to 12). Non-refundable."
  - "Entrance Test Fee: Waived for Grades 1 to 5. $50 CAD for Grades 6 to 12. Non-refundable."
- Upgrade callout (all grade bands): "Upgrade to Ontario Official Program (Ontario student record): $250 per course or $600 per year for all 6 subjects."
- Schedule footnote (global): "Standard program dates: September 5, 2026 to May 30, 2027 (39 instructional weeks). Continuous enrollment still available — you may start any day of the year."

**Copy — Why Choose (`academicPrep.keyFeature*`)**
- Title: "Why Choose Academic Preparation?"
- "Ontario Curriculum" — "All content aligned with the official Ontario curriculum standards"
- "Learn at Your Pace" — "No deadlines or schedules—complete courses when it works for you"
- "Interactive Content" — "Engaging video lessons with practice activities and homework"
- "Affordable Pricing" — "Quality education at a fraction of the cost of traditional programs"

**Copy — CTA (`academicPrep.cta*`)**
- Title: "Ready to Start Learning?"
- Subtitle: "Choose a grade level above to explore courses and start your journey"
- Buttons: "Browse All Grades" · "Browse Elementary (Grades 1-5)" · "Contact Us"

---

## `/academic-prep/grade/:grade` — Grade page (Academic Prep context)
## `/academic-prep/grade/:grade/courses` — Grade page courses view

Renders [GradePage.jsx](../src/pages/GradePage.jsx) inside `StorefrontProvider` for the Academic Prep storefront.
See **[`/grade/:grade`](#gradegrade--grade-page-program-agnostic-shared-template)** above for full text dump.
The "Add to Cart" button on each course card uses `storefronts.cta.addToCart` → "Add to Cart"; bundle pricing uses `storefronts.gradePage.bundleCard` → "Complete Grade {n} Program" / "Includes all Math, Science, and English courses" / "Save {amount} with bundle".

---

## `/academic-prep/course/:courseCode` — Storefront Course Detail (Academic Prep)

- **Source:** [src/pages/StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx)
- **Renders inside:** Header + Footer (StorefrontProvider)

**Structure**
1. Hero (course badge "Non-credit", course title, price)
2. Tabs: Overview / Curriculum / FAQs
3. Quick Facts sidebar
4. What's Included
5. Units / curriculum breakdown
6. Bonus banner ("FREE: Practice Course Included" — credit storefront only)
7. Add to Cart panel

**Copy — Tabs / common (`storefront.courseDetail` + `storefronts.coursePage`)**
- Tabs: "Overview" · "Curriculum" · "FAQs"
- Section heading: "Course Overview"
- "What You'll Learn"
- "Teaching Approach"
- "Course Curriculum"
- Unit prefix: "Unit"
- Unit duration suffix: "hours"
- FAQ section heading: "Frequently Asked Questions"
- "Have Questions?"
- "Explore More {gradeLabel} Courses" — "View all available {type} courses for this grade." — "View All {gradeLabel} Courses"

**Copy — Quick Facts (`storefronts.coursePage.quickFacts` + `storefront.courseDetail`)**
- Labels: "Prerequisite" · "Credit Value" · "Duration" · "Schedule" · "Delivery" · "Format" · "Pace" · "Access"
- Common values: "Self-paced" · "Video + Practice" · "12 months" · "Live online (Zoom)"
- Hours unit: "hrs/week"

**Copy — Hero badges**
- Non-credit badge: "Non-credit"
- Credit badge: "Ontario Credit" (credit storefront only)
- Credit assurance (credit storefront only): "This course awards 1.0 Ontario high school credit upon successful completion. Transcripts and report cards provided. Recognized by OUAC/OCAS and universities."

**Copy — Included with this course (`storefronts.coursePage.included`)**
- Heading: "Included with this course"
- **Credit course bullets:** "Live Zoom sessions" · "Recorded lesson replays" · "Practice problem sets" · "Quizzes and tests" · "Final examination" · "Official transcript" · "Report card"
- **Non-credit bullets:** "Video lessons" · "Practice activities" · "Homework exercises"
- Bonus badge: "BONUS"
- Bonus text: "FREE: Practice Course Included"

**Copy — Add to Cart panel**
- Buttons: "Add to Cart" · "View Cart"
- Upgrade link: "Upgrade to Credit Course →"
- Cross-link: "Have Questions?" → `/contact`

**Copy — Not found state (`storefront.courseDetail`)**
- "Course Not Found"
- "The course you're looking for doesn't exist."
- Button: "Browse Courses"

---

## `/official-ontario` — Official Ontario Landing

- **Source:** [src/pages/OfficialOntarioLanding.jsx](../src/pages/OfficialOntarioLanding.jsx)
- **Renders inside:** Header + Footer (StorefrontProvider)

**Structure**
1. Hero ("Most Popular Choice" badge + h1 + hero description + 4 feature pills)
2. Ministry Inspected Badge section
3. What's Included (6 cards)
4. Browse by Grade Level (3 expandable groups)
5. Pricing card
6. Why Choose Official Ontario (4 key features)
7. Final CTA

**Copy — Hero (`officialOntario`)**
- Most popular badge: "Most Popular Choice"
- Title: "Official Ontario Program — Ontario Secondary School Diploma (OSSD)"
- Description: "The Ontario Secondary School Diploma (OSSD) Program is a prestigious, fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Delivered in alignment with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. Through personalized academic guidance and a structured learning environment, students are fully prepared for graduation, university admission in Canada and internationally, and long-term success within a globally recognized education system."
- Feature pills: "Live Classes" · "OCT Teachers" · "Official Credits" · "OSSD Diploma"

**Copy — Ministry section (`officialOntario.ministry*`)**
- Title: "Ontario Ministry Inspected School"
- BSID: "BSID: 886229"
- Authorization: "Authorized to grant credits toward the Ontario Secondary School Diploma (OSSD)"

**Copy — What's Included (`officialOntario.included*`)**
- Title: "What's Included"
- "Live Online Classes" — "Interactive classes via Zoom with Ontario Certified Teachers"
- "Official Transcripts" — "Recognized by universities worldwide, sent directly to OUAC/OCAS"
- "Formal Assessments" — "Tests, assignments, and evaluations count toward your grade"
- "Report Cards" — "Official Ontario report cards upon course completion"
- "Learning Materials" — "All textbooks, resources, and course materials provided"
- "Teacher Support" — "Direct access to your teacher for help and guidance"

**Copy — Browse by Grade (`officialOntario.gradeGroup*`)**
- Title: "Browse by Grade Level"
- Subtitle: "Select a grade group to explore available courses"
- "Elementary (Grades 1-5)" — "Official Ontario elementary education"
- "Middle School (Grades 6-8)" — "Build strong middle school foundations"
- "High School (Grades 9-12)" — "Earn official OSSD credits"

**Copy — Pricing (`officialOntario.pricing*`) — Version 2**
- Elementary (upgrade tier): "💰 **$250 per subject** or **$600 for full year** (all 6 subjects) — this is the entry-level Ontario student record pathway."
- Middle School (upgrade tier): "💰 **$250 per course** or **$600 for full year** (all 6 subjects) — Ontario student record."
- Elementary (premium teacher-led legacy): "💰 **$3,500 per year** — live online classes with Canadian teachers, full Ontario report card (Primary Foundation Teacher-Led pathway, preserved from Version 1)."
- High School Grades 9 and 10: "💰 **Per-course pricing starts at $700 CAD** · Full year 8-credit program pricing from **$3,800 CAD** · Contact admissions for domestic, visa, and international tier quotes."
- High School Grades 11 and 12: "💰 **Per-course pricing starts at $700 CAD** · Full year 7-credit program pricing from **$3,800 CAD** · MCV4U may only be taken after MHF4U is completed (Grade 12 sequencing requirement)."
- Fee notes: "Registration Fee $100 CAD (Grades 9 to 12), $50 CAD (Grades 1 to 8). Entrance Test Fee $50 CAD (waived Grades 1 to 5). All fees non-refundable."
- Schedule footnote: "Standard one-year program: September 5, 2026 to May 30, 2027."
- French exemption (Grades 9 to 12): "Students who have completed Grade 8 (for Grade 9 entry), Grade 9 (for Grade 10 entry), or Grade 10 (for Grade 11 and Grade 12 entry) in their home country are not required to take French as a Second Language. An equivalent credit will be granted."

**Copy — Why Choose (`officialOntario.keyFeature*`)**
- Title: "Why Choose Official Ontario Program?"
- "Earn Real Credits" — "Official OSSD credits recognized by Canadian and international universities"
- "Expert Teachers" — "Learn from Ontario Certified Teachers with years of teaching experience"
- "Structured Learning" — "Guided curriculum with assignments, tests, and formal evaluations"
- "Global Recognition" — "OSSD diploma accepted by top universities around the world"

**Copy — CTA (`officialOntario.cta*`)**
- Title: "Ready to Earn Your OSSD?"
- Subtitle: "Choose a grade level above to explore courses and start your journey"
- Buttons: "Browse High School (Grades 9-12)" · "Contact Us"

---

## `/official-ontario/grade/:grade` — Grade page (Official Ontario context)
## `/official-ontario/grade/:grade/courses` — Grade page courses view

Renders [GradePage.jsx](../src/pages/GradePage.jsx) inside `StorefrontProvider` for the Official Ontario storefront. See **[`/grade/:grade`](#gradegrade--grade-page-program-agnostic-shared-template)** above for full text dump.

---

## `/official-ontario/course/:courseCode` — Storefront Course Detail (Official Ontario)

Renders [StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx) inside Official Ontario storefront context. See **[`/academic-prep/course/:courseCode`](#academic-prepcoursecoursecode--storefront-course-detail-academic-prep)** above — the same component is used. In this storefront the hero shows the credit badge ("Ontario Credit") and the credit assurance copy is rendered.

---

# Cart & Checkout

## `/cart` — Shopping Cart

- **Source:** [src/pages/Cart.jsx](../src/pages/Cart.jsx)
- **Renders inside:** Header + Footer (StorefrontProvider)

**Structure (empty state)**
1. Empty icon
2. Title + subtitle
3. Two browse buttons

**Structure (filled state)**
1. Cart items list (course cards with grade/storefront badges, price, remove button)
2. Bundled / bonus items section
3. Coupon code input
4. Order summary (subtotal, discount, total)
5. "Proceed to Checkout" button + secure-checkout note

**Copy — Headings & states (`storefront.cart` + `storefronts.cart`)**
- Title: "Shopping Cart"
- Empty title: "Your Cart is Empty" (legacy "Your cart is empty")
- Empty subtitle: "Add courses to get started on your learning journey." ("Add courses to get started")
- Empty CTAs: "Browse Practice Courses" · "Browse Credit Courses" · "Browse Courses"
- Item count templates: "course" / "courses" + "in your cart"
- Item meta — credit: "Live online • Ontario Credit"
- Item meta — non-credit: "Self-paced • Practice only • No OSSD credit"
- Per-item button: "Remove"

**Copy — Bundle banner (`storefronts.cart.bundleMessage`)**
- Badge: "BONUS INCLUDED"
- Text: "Your credit course purchase includes FREE access to the related Non-credit practice course. Start practicing right away!"

**Copy — Upgrade prompt (`storefronts.cart.upgradePrompt`)**
- Badge: "UPGRADE AVAILABLE"
- Text: "Want to earn Ontario credit for this course?"
- CTA: "Learn About Upgrading"
- Price prefix: "Upgrade for just"
- Section heading variant: "Upgrade to Credit" — "Want to earn Ontario credit? Upgrade your non-credit courses and get official transcripts and report cards." → "View Credit Courses"

**Copy — Coupon (`storefronts.cart.coupon`)**
- Placeholder: "Have a coupon code?" (legacy "Enter coupon code")
- Buttons: "Apply" · "Remove"
- States: "applied"
- Errors: "Invalid coupon code" · "Coupon has expired" · "Minimum order of {amount} required"

**Copy — Order summary (`storefronts.cart.summary`)**
- Title: "Order Summary"
- Lines: "Subtotal" · "Discount" · "Bonus Courses" · "Total"
- "FREE"
- Button: "Proceed to Checkout"
- Footer note: "Secure checkout with SSL encryption"
- Continue link: "Continue Shopping"
- Payment options accepted: "Accepted: Visa, Mastercard, Flywire"

---

## `/checkout` — Checkout Wizard

- **Source:** [src/pages/Checkout.jsx](../src/pages/Checkout.jsx)
- **Renders inside:** Header + Footer (StorefrontProvider)

**Structure**
1. Step progress bar — Cart · Details · Payment · Confirmation
2. **Step 1 — Cart:** order summary review
3. **Step 2 — Details:** Account holder details + Student information forms
4. **Step 3 — Payment:** payment method selection + secure form
5. **Step 4 — Confirmation:** success state with order number, "What's Next?" sections, and receipt

**Copy — Step labels (`storefront.checkout.steps`)**
- "Cart" · "Details" · "Payment" · "Confirmation"

**Copy — Step 2: Account Holder Details (`storefront.checkout` + `storefronts.checkout.parentDetails`)**
- Section title: "Account Holder Details" / "Parent/Guardian Information"
- Subtitle: "Account holder details" / "Account Holder"
- Fields: "First Name" · "Last Name" · "Email" · "Phone" · "Country" · "Province/State"
- Optional fields: "Create an account to track enrollment and progress" · "Password" · "Confirm Password"
- Country fallback option: "Other"

**Copy — Step 2: Student Information (`storefront.checkout` + `storefronts.checkout.studentDetails`)**
- Section title: "Student Information"
- Fields: "Student First Name" · "Student Last Name" · "Date of Birth" · "Current Grade" · "Current School (optional)" / "Previous School (optional)"
- Grade dropdown placeholder: "Select grade..."

**Copy — Step 3: Payment Method (`storefront.checkout` + `storefronts.checkout.payment`)**
- Title: "Payment Method"
- Card option label: "Credit/Debit Card"
- Flywire / international option: "Bank Transfer / Alipay / WeChat (via Flywire)" or "Flywire" — "International payments - Bank transfer, Alipay"
- Card fields: "Card Number" · "Expiry" · "CVV" · "Name on Card"
- Save card option: "Save card for future purchases"
- Secure note: "Your payment is secure and encrypted" / "Secure payment. Your card details are encrypted."
- Button: "Pay" (legacy: "Pay") · loading: "Processing..."
- Bank options: "Bank Transfer" · "International Credit Card"
- Flywire redirect blurb: "You will be redirected to Flywire to complete your international payment."

**Copy — Flywire screen (`storefronts.checkout.flywire`)**
- Title: "Flywire International Payment"
- Body: "You will be redirected to Flywire to complete your payment."
- Labels: "Payment Amount" · "Reference" · "Payable to: Excellence Maple Canadian School Inc."
- Methods list intro: "Available payment methods on Flywire:" — "Bank Transfer" · "Alipay" · "WeChat Pay" · "Credit Card (international)"
- Buttons: "Continue to Flywire" · "Choose Different Method"

**Copy — Acknowledgements**
- "I agree to the Terms of Service and Privacy Policy"
- "I understand that non-credit practice courses do NOT include assessments, grades, or Ontario academic record. They are for practice only."
- "I understand that Self-Learning Primary Foundation courses do NOT include an Ontario academic record unless the optional add-on is purchased."
- Short: "I understand non-credit courses do not include assessments or OSSD credit"

**Copy — Step 4: Confirmation (`storefront.checkout` + `storefronts.checkout.confirmation`)**
- Title: "Payment Successful!" / "Payment Successful"
- Greeting: "Thank you!"
- Order line: "Order"
- Email confirmation line: "A confirmation email has been sent to"
- Section: "What's Next?" / "WHAT'S NEXT?"
- **For Credit Courses:**
  - "Check your email for Zoom class schedule"
  - "Join orientation session within 48 hours"
  - "Meet your certified teacher"
  - "Access course materials in student portal"
- **For Practice / Self-Learning Courses:**
  - "Log in to the student portal"
  - "Start learning immediately - courses are self-paced"
  - "Track progress in your dashboard"
- **For Teacher-Led Primary Foundation:**
  - "Check email for class schedule and orientation"
  - "Prepare for program start date (September 5, 2026)"
  - "Access learning materials through student portal"
- Buttons: "Go to Dashboard" / "Go to Student Dashboard" · "Browse More Programs" / "Browse More Courses"

**Copy — Receipt block (`storefronts.checkout.confirmation.receipt`)**
- Title: "ORDER RECEIPT"
- Print button: "Print"
- Fields: "Order Date" · "Order Number" · "Payment Method" · "Items" · "Subtotal" · "Discount" · "Total Paid"

**Copy — Navigation (`storefronts.checkout.navigation`)**
- "Back" · "Back to Cart" · "Continue" · "Continue to Payment"

**Copy — Errors (`errors.payment` + `errors.checkout` + `errors.form`)**
- Payment: "Payment declined. Please check your card details or try a different payment method." · "Your card has expired. Please use a different card." · "Insufficient funds. Please try a different card." · "Payment timed out. Please try again. Your card was not charged."
- Checkout: "Your cart is empty. Add courses before checking out." · "Your session has expired. Please log in again." · "One or more courses in your cart are no longer available."
- Form: "This field is required." · "Please enter a valid email address." · "Please enter a valid phone number." · "Passwords do not match." · "Please enter a valid card number."

---

# Portals (protected)

## `/portal/student` — Student Learning Portal

- **Source:** [src/pages/portals/StudentPortal.jsx](../src/pages/portals/StudentPortal.jsx)
- **Renders inside:** Header + Footer (ProtectedRoute — roles: `student`, `parent`, `admin`)

**Structure**
1. Hero (icon + h1 + subtitle + "Coming Soon" badge)
2. Portal card (h2 + description)
3. Features list (6 feature items)
4. CTAs: Browse Academic Prep / Browse Official Ontario
5. Help box (Contact Support)

**Copy (`portals.student`)**
- Title: "Student Portal"
- Description: "LMS access for enrolled students"
- Coming soon: "Coming soon - Student LMS access" / global "Coming Soon"
- Portal card title: "Student Learning Portal"
- Portal description: "Access your courses, track your progress, submit assignments, and communicate with your teachers—all in one place."
- Features title: "What You'll Be Able To Do:"
  - "Access Course Materials" — "View video lessons, download resources, and track your learning path"
  - "Submit Assignments" — "Upload homework, quizzes, and projects directly to your teacher"
  - "Track Progress" — "Monitor your grades, completion rates, and learning milestones"
  - "Teacher Communication" — "Ask questions and get feedback from your Ontario Certified Teachers"
  - "Join Live Classes" — "Access Zoom links and class schedules for live instruction"
  - "View Transcripts" — "Access your official Ontario transcripts and report cards"
- CTA prompt: "Not enrolled yet? Start your learning journey today."
- Buttons: "Browse Academic Prep" · "Browse Official Ontario"
- Help heading: "Need Help?"
- Help body: "If you're already enrolled and need login credentials, please contact our support team:"
- Help button: "Contact Support"

---

## `/portal/parent` — Parent Portal

- **Source:** [src/pages/portals/ParentPortal.jsx](../src/pages/portals/ParentPortal.jsx)
- **Renders inside:** Header + Footer (ProtectedRoute — roles: `parent`, `admin`)

**Structure**
1. Hero (icon + h1 + subtitle + "Coming Soon" badge)
2. Tab nav: New Enrollment / Existing Account
3. **Enrollment tab:** h2, description, 5-step process list, CTA buttons
4. **Login tab:** login guidance, parent dashboard features list
5. Help box

**Copy (`portals.parent`)**
- Title: "Parent Portal"
- Description: "Enrollment and student progress tracking"
- Coming soon: "Coming soon - Enrollment and student progress"
- Tab labels: "New Enrollment" · "Existing Account"

**Enrollment tab**
- Title: "Enroll Your Child"
- Body: "Register your child for Academic Preparation or Official Ontario Program courses. Track their progress and manage their education all in one place."
- Process heading: "How It Works:"
  - "Choose a Program" — "Select Academic Prep (self-paced) or Official Ontario (live classes)"
  - "Add Courses to Cart" — "Browse courses by grade and subject, add to cart"
  - "Complete Enrollment Form" — "Provide student information and parent/guardian details"
  - "Submit Payment" — "Pay securely via credit card, bank transfer, or Flywire"
  - "Receive Login Credentials" — "Both parent and student portals within 24-48 hours"
- Buttons: "Enroll in Academic Prep" · "Enroll in Official Ontario"

**Existing Account tab**
- Title: "Access Your Account"
- Body: "View your child's progress, grades, attendance, and communicate with teachers."
- Features title: "Parent Dashboard Features:"
  - "Progress Tracking" — "Real-time updates on course completion and grades"
  - "Class Schedule" — "View upcoming live classes and assignment deadlines"
  - "Billing Management" — "View invoices, payment history, and outstanding balances"
  - "Teacher Communication" — "Message teachers and receive updates on your child's performance"
  - "Official Documents" — "Download transcripts, report cards, and certificates"
  - "Add More Courses" — "Enroll in additional courses anytime throughout the year"

**Help box**
- Heading: "Need Login Credentials?"
- Body: "If you've enrolled but haven't received your login information, please contact us:"
- Button: "Contact Support"

---

## `/portal/agent` — Agent / School Portal

- **Source:** [src/pages/portals/AgentPortal.jsx](../src/pages/portals/AgentPortal.jsx)
- **Renders inside:** Header + Footer (ProtectedRoute — roles: `agent`, `admin`)

**Structure**
1. Hero (icon + h1 + subtitle + "Coming Soon" badge)
2. Portal card (h2 + description)
3. Features list (6 items)
4. Why Partner With EMCS? (4 benefit cards)
5. Partner CTA box
6. Existing partner help box

**Copy (`portals.agent`)**
- Title: "Agent/School Portal"
- Description: "Partner enrollment forms and commission tracking"
- Coming soon: "Coming soon - Partner enrollment forms"
- Portal card title: "Partner Enrollment Portal"
- Portal description: "Streamlined enrollment process for education agents and partner schools. Manage bulk enrollments, track commissions, and support your students' success."

**Features (`portals.agent.feature*`)**
- Section title: "Agent Dashboard Features:"
- "Bulk Enrollment Forms" — "Enroll multiple students at once with streamlined forms and CSV upload"
- "Commission Tracking" — "Real-time visibility into earnings, payouts, and referral status"
- "Student Management" — "View all students you've enrolled, their progress, and enrollment status"
- "Analytics Dashboard" — "Track enrollment trends, popular programs, and student outcomes"
- "Promotional Materials" — "Download brochures, flyers, and marketing assets for your region"
- "Dedicated Support" — "Priority support from our partner relations team"

**Why Partner With EMCS? (`portals.agent.benefit*`)**
- Section title: "Why Partner With EMCS?"
- "Ministry Inspected" — "Official Ontario Ministry accreditation (BSID: 886229)"
- "Global Recognition" — "OSSD credentials recognized by universities worldwide"
- "Competitive Commissions" — "Attractive commission structure for agent partners"
- "Growing Programs" — "Grades 1-12 with both Academic Prep and Official Ontario options"

**Partner CTA**
- Heading: "Interested in Becoming a Partner?"
- Body: "Join our network of education agents and partner schools. Help students worldwide access quality Canadian education."
- Buttons: "Inquire About Partnership"
- Email line: "Email: partnerships@emcs.ca"

**Existing partner help box**
- Heading: "Existing Partner?"
- Body: "If you're already an approved partner and need login credentials:"
- Button: "Contact Partner Support"

---

# Tuition reference (used across multiple pages — `tuition.*`)

The `tuition` namespace is reused by Primary Foundation, Grade pages, and several CTAs. Reference copy:

**Hero**
- Title: "Tuition & Fees"
- Subtitle: "Transparent pricing with no hidden costs"

**Elementary — Self-Learning**
- Title: "Self-Learning Program"
- "Grade 1-3: Core Subjects (each)" / "Grade 4-5: Core Subjects (each)" / "Grade 4-5: French as a Second Language"
- "Regular Price" "$150 CAD" → "Promotional Price" "$75 CAD"
- French "$300 CAD" → "$150 CAD"
- "Entrance Test: $50 CAD (non-refundable)" · "Registration: $35 CAD (non-refundable)"
- Add-on: "Optional Add-on: Ontario Academic Record: +$250 CAD per course"

**Elementary — Teacher-Led**
- Title: "Teacher-Led Program"
- "Core Subjects (6 subjects, full year)" — "$3,500"
- "French as a Second Language (add-on)" — "$2,000"
- "Entrance Test Fee" — "$50 (non-refundable)"
- "Registration Fee" — "$100 (non-refundable)"

**Middle School (Grades 6-8)**
- Title: "Middle School (Grades 6-8)"
- "Practice Courses: $75-150 CAD per subject"

**High School (Grades 9-12)**
- Title: "High School (Grades 9-12)"
- Credit Courses table: "Domestic (Canadian Citizen/PR)" · "Visa Student (in Canada)" · "International Student" — "Contact us"
- Fees: "Entrance Test: $50 CAD (non-refundable)" · "Registration: $100 CAD (non-refundable)"
- Included in tuition: "All course materials" · "Teacher support" · "12-month course access" · "Official transcript" · "Report card" · "Proctored exam"
- Practice Courses: "$75-150 CAD"

**What's Included**
- All Programs Include: "Course materials and resources" · "24/7 platform access" · "Technical support"
- Credit Courses Additionally Include: "Live instruction with OCT teachers" · "Assessment and grading" · "Official transcripts" · "Marks sent to OUAC/OCAS" · "Proctored exams"

**Payment Methods**
- "Credit/Debit Card (Visa, Mastercard)"
- "Bank Transfer"
- "Flywire (for international payments, supports Alipay, WeChat)"

**Refund Policy**
- "Refund eligibility depends on course progress. Please contact our admissions team for details on our refund policy."

**Tuition CTA**
- Title: "Ready to Enroll?"
- Subtitle: "Start your Canadian education journey today."
- Button: "Browse Programs"

---

# Activities / interactive widget (`activities.*`)

Used by `InteractiveActivity.jsx` inside course-detail / practice pages.

- "Activity not found"
- "Listen to question"
- "Check Answer"
- "Next Question →"
- "Try Again"
- "The correct answer is: "
- "Attempt"
- Encouragement messages: "Great job!" · "Excellent!" · "You got it!" · "Perfect!" · "Awesome!" · "Well done!"
- Retry messages: "Try again!" · "Not quite." · "Keep trying!" · "Almost there!" · "You can do it!"
- Hint controls: "Show Hint" · "Try Again" · "Next Question"

---

# Accessibility strings (`accessibility.*`)
Used by Header, navigation, and various interactive elements:
- "Skip to main content"
- "Toggle menu"
- "Close menu"
- "Shopping cart"
- "items in cart"
- "Remove item"
- "Select grade"
- "Select subject"
- "Loading..."
- "Error occurred"

---

# Legacy redirects

These routes exist for backward compatibility and immediately `Navigate` to the new program slugs:

| Old | New |
|---|---|
| `/non-credit` | `/academic-prep` |
| `/non-credit/grade/:grade` | `/academic-prep/grade/:grade` |
| `/non-credit/course/:courseCode` | `/academic-prep/course/:courseCode` |
| `/credit` | `/official-ontario` |
| `/credit/grade/:grade` | `/official-ontario/grade/:grade` |
| `/credit/course/:courseCode` | `/official-ontario/course/:courseCode` |

The legacy paths still mount the same `AcademicPrepLanding` / `OfficialOntarioLanding` / `GradePage` / `StorefrontCourseDetail` components inside `StorefrontProvider`, so all copy above applies identically.

---

# Version 2 Additions

The sections below are additive to the Version 1 site map. They specify new pages, new shared components, and new copy blocks introduced by the Price Table (1 to 5), Price Table (6 to 8), Web Design Layout, Ontario Official Programs Grade 9 to 12, and Ontario Programs Grade 9 to 12 (Non-Credit) feedback documents. Nothing above this line has been deleted in Version 2.

## Version 2 shared component: GradeGroupPanel

A new reusable component (`src/components/storefront/GradeGroupPanel.jsx`) renders the two-column layout mandated by the Web Design Layout document. It is embedded inside the new `/academic-prep/group/:groupSlug` and `/official-ontario/group/:groupSlug` routes, and also inside the expandable sections of `/academic-prep` and `/official-ontario` landing pages.

**Structure (left to right):**
1. Left column — Academic Preparation Program (Non-Ontario student record)
   - Heading: "Academic Preparation Program (Non-Ontario student record)"
   - Full descriptive paragraph (from Web Design Layout doc): "The Academic Preparation Program builds strong foundations in Academic English, mathematics, science, social studies, and essential learning skills. Aligned with Ontario standards, it develops analytical thinking and disciplined study habits, preparing students for a smooth transition into OSSD credit courses or the Ontario Secondary School Diploma (OSSD) program."
   - Subject list with delivery column: Mathematics · Language · The Arts · Science and Technology · Health and Physical Education · Social Studies. Language column = English. Delivery column = "Self-Learning via LMS Platform".
   - What's Included list: "All learning materials provided", "Student and parent login credentials", "24/7 access to course content", "Learn at your own pace".
   - Price card: "Enroll now and receive a 50% discount — only $325 for a 1-year program." Plus "Regular: $150 per course / $650 per year. Discounted: $75 per course / $325 per year."
   - Fee row: "Registration Fee $50 · Entrance Test Fee $0 for Grades 1 to 5, $50 for Grades 6 to 8".
   - Primary CTA: "Enroll in Academic Preparation"
2. Right column — UPGRADE to Official Ontario Program (Ontario student record)
   - Heading: "UPGRADE to Official Ontario Program (Ontario student record)"
   - Full descriptive paragraph (from Web Design Layout doc): "The Official Ontario Program is a fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Aligned with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. With personalized academic guidance and a structured learning environment, students are prepared for university admission in Canada and internationally. Upon successful completion, students earn the Ontario Secondary School Diploma (OSSD)."
   - Feature pills: "Ontario student record" · "Accredited pathway" · "University-aligned" · "OSSD pathway"
   - Price card: "$250 per course · $600 per year (all 6 subjects)" for Grades 1 to 8. Grades 9 to 12 pricing redirects to the Grades 9 to 12 Ontario Official Programs tables.
   - Upgrade note: "Students who started in the Academic Preparation Program may upgrade at any point during the academic year. Previous coursework contributes to the Ontario student record upon upgrade."
   - Primary CTA: "Upgrade to Official Ontario Program"
3. Shared footer of the panel
   - Tagline strip: "Flexible Learning Pathways. Learn First. Decide Later. Succeed Safely."
   - Schedule strip: "Schedule: September 5, 2026 to May 30, 2027 (39 instructional weeks)."
   - Program hint: "Preparation today, recognition tomorrow."

## Version 2 new public page: `/programs/middle-school` — Middle School Foundation (Grades 6 to 8)

- **Source (proposed):** `src/pages/MiddleSchoolFoundation.jsx`
- **Renders inside:** Header + Footer
- **Purpose:** Mirrors the structure of `/programs/elementary` (Primary Foundation) but targets Grades 6 to 8. Pulls pricing from the Price Table (6 to 8) feedback document.

**Structure**
1. Hero (badge "Grades 6 to 8 Foundation" + h1 "Ontario Middle School Foundation Program" + tagline "Build the bridge from elementary to high school success")
2. Program Overview paragraph: "The Middle School Foundation Program supports Grades 6 to 8 students in consolidating the academic foundations required for a smooth entry into Ontario high school pathways. Delivered on the Academic Preparation platform with an optional upgrade to an Ontario student record, the program emphasizes Academic English, mathematical reasoning, scientific inquiry, and social studies literacy."
3. Two Pathways module (uses the shared GradeGroupPanel component)
4. Pricing table (from Appendix B)
5. Grade-by-grade breakdown (Grade 6, Grade 7, Grade 8 cards)
6. French as a Second Language policy (introduced Grade 6; note that students migrating from an international curriculum may request an assessment)
7. Upgrade narrative: "Students may begin the year in the Academic Preparation Program and upgrade to the Official Ontario Program (Ontario student record) at any time. The $250 per course upgrade fee applies only to the subjects upgraded; full-year upgrade pricing is $600 for all 6 subjects."
8. Final CTA (Enroll, Upgrade, Contact an Advisor)

**Copy — Grade 6 card**
- Title: "Grade 6"
- Body: "Transition into middle school with stronger reading comprehension, introductory algebraic thinking, scientific investigation, and geography and history units aligned with the Ontario Curriculum."

**Copy — Grade 7 card**
- Title: "Grade 7"
- Body: "Deepen academic writing, introduce integers and equations, explore ecosystems and structural science, and study Canada's historical and geographical foundations."

**Copy — Grade 8 card**
- Title: "Grade 8"
- Body: "Prepare for the Grade 9 academic bridge with pre-algebra, analytical writing, optics, water systems, and Canada's history through the 20th century."

## Version 2 new public page: `/programs/high-school` — Ontario High School Pathways (Grades 9 to 12)

- **Source (proposed):** `src/pages/HighSchoolPathways.jsx`
- **Renders inside:** Header + Footer
- **Purpose:** Canonical hub page for the "Flexible Learning Pathways" narrative from the Ontario Official Programs Grade 9 to 12 feedback documents. Serves as the single entry point for prospective Grade 9 to 12 families evaluating either program.

**Structure**
1. Hero section
   - H1: "ONTARIO CURRICULUM PROGRAMS (Grades 9 to 12)"
   - H2: "Flexible Learning Pathways"
   - Tagline: "Learn First. Decide Later. Succeed Safely."
   - Lede: "We offer programs based on the Ontario Curriculum for students in Grades 9 to 12, with two flexible learning pathways."
   - Dual CTA: "Start with Preparation" · "Earn OSSD Credits"
2. Pathway 1 card — Academic Preparation Program (Non-Credit)
   - Full description paragraph: "The Academic Preparation Program (Non-Credit) is designed for students who aspire to pursue a rigorous academic pathway within an international educational framework. The program focuses on establishing strong academic foundations while cultivating analytical thinking, disciplined study habits, and the confidence required to succeed within the Canadian education system. Developed in alignment with Ontario curriculum standards, the program strengthens students' competencies in Academic English, mathematical reasoning, and advanced learning skills. Through personalized learning pathways and close academic mentorship, the program provides a solid transition into OSSD credit courses or EAP programs, preparing students to excel in high-quality, globally oriented academic environments."
   - Outcomes list: Academic English proficiency · Mathematical reasoning · Advanced learning skills · Transition readiness to OSSD credit courses · Transition readiness to English for Academic Purposes (EAP) programs
3. Pathway 2 card — Ontario Secondary School Diploma (OSSD) Program
   - Full description paragraph: "The Ontario Secondary School Diploma (OSSD) Program is a prestigious, fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Delivered in alignment with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. Through personalized academic guidance and a structured learning environment, students are fully prepared for graduation, university admission in Canada and internationally, and long-term success within a globally recognized education system."
   - Outcomes list: OSSD graduation · Ontario transcript · OUAC and OCAS direct delivery · Canadian and international university admission readiness
4. Ontario Official High School Program subsection
   - Heading: "Ontario Official High School Program"
   - Subheading: "Study with Canadian Teachers"
   - Short tagline: "Grade 9 and Grade 10 are 8-credit programs. Grade 11 and Grade 12 are 7-credit programs."
5. Grade timetables (rendered as four tabs, one per grade — full detailed content lives in Appendix C)
   - Tab 1: "Grade 9 Academic Year Timetable and Tuition Fee"
   - Tab 2: "Grade 10 Academic Year Timetable and Tuition Fee"
   - Tab 3: "Grade 11 Academic Year Timetable and Tuition Fee"
   - Tab 4: "Grade 12 Academic Year Timetable and Tuition Fee"
6. Discounted tuition notes (shown beneath each timetable tab)
   - Grade 9: "Note: The discounted tuition fee is applicable only to the one-year (8-credit) program. For single-course pricing, please view here. Students who have completed Grade 8 in their home country are not required to take French as a Second Language. An equivalent credit will be granted."
   - Grade 10: "Note: The discounted tuition fee is applicable only to the one-year (8-credit) program. For single-course pricing, please view here. Students who have completed Grade 9 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
   - Grade 11: "Note: The discounted tuition fee is applicable only to the one-year (7-credit) program. For single-course pricing, please view here. Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
   - Grade 12: "Note: MCV4U will be taken after MHF4U is completed. The discounted tuition fee is applicable only to the one-year (7-credit) program. For single-course pricing, please view here. Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
7. Fee strip (shown globally on the page)
   - "Registration Fee: $100 CAD (non-refundable)"
   - "Entrance Test Fee: $50 CAD (non-refundable)"
8. "Why the dual pathway?" explainer row
   - Card 1 — "Learn First": "Start in the Academic Preparation Program to validate readiness, build confidence, and pilot the Ontario Curriculum without the pressure of a permanent academic record."
   - Card 2 — "Decide Later": "Upgrade to the Official Ontario Program at any point once the student is ready to earn credit and establish an Ontario student record."
   - Card 3 — "Succeed Safely": "Reduce the risk of a low OSSD transcript grade by demonstrating mastery in the Academic Preparation Program before formalizing a credit."
9. Closing CTA row: "Speak with an Advisor" · "Browse Grade 9 to 12 Courses" · "View Academic Calendar"

## Version 2 new public page: `/tuition` — Consolidated Tuition and Fees

- **Source (proposed):** `src/pages/Tuition.jsx`
- **Renders inside:** Header + Footer
- **Purpose:** Elevates the `tuition.*` locale namespace into a first-class public page so that the newly specified pricing from Price Table (1 to 5) and Price Table (6 to 8) has a canonical URL that can be linked from the Program dropdown, cart page, and checkout pages.

**Structure**
1. Hero: "Tuition and Fees" · "Transparent pricing with no hidden costs"
2. Tabs: "Elementary (Grades 1 to 5)" · "Middle School (Grades 6 to 8)" · "High School (Grades 9 to 12)" · "Fee Schedule" · "Payment Methods"
3. Each grade-band tab embeds the appropriate appendix pricing table (Appendix A for 1 to 5, Appendix B for 6 to 8, Appendix C for 9 to 12).
4. Fee Schedule tab surfaces the consolidated fee matrix (Appendix D).
5. Payment Methods tab preserves Version 1 payment method copy and adds Flywire international instructions.
6. FAQ accordion linking to the FAQ page.
7. Final CTA: "Ready to Enroll?" with buttons to `/academic-prep`, `/official-ontario`, and `/contact`.

## Version 2 new public page: `/schedule` — Academic Calendar

- **Source (proposed):** `src/pages/AcademicCalendar.jsx`
- **Renders inside:** Header + Footer
- **Purpose:** Surfaces the standardized September 5, 2026 to May 30, 2027 schedule referenced on every Price Table and on the Primary Foundation Teacher-Led page.

**Structure**
1. Hero: "Academic Calendar 2026 to 2027" · "September 5, 2026 to May 30, 2027 · 39 instructional weeks"
2. Calendar overview card: "Program Start: September 5, 2026" · "Program End: May 30, 2027" · "Winter Break: mid-December 2026 to early January 2027" · "March Break: mid-March 2027"
3. Continuous enrollment banner: "Continuous enrollment is still available. You may start any day of the year and complete your course within 12 months."
4. Assessment windows module (OSSLT, proctored finals, midterm mark reporting windows)
5. OUAC and OCAS transcript delivery deadlines module
6. Program-specific schedule cards (Academic Preparation Program, Official Ontario Program Grades 9 and 10, Official Ontario Program Grades 11 and 12, Primary Foundation Teacher-Led)
7. Download link: "Download the 2026 to 2027 Academic Calendar (PDF)"

## Version 2 new public page: `/compare` — Program Comparison

- **Source (proposed):** `src/pages/ProgramCompare.jsx`
- **Renders inside:** Header + Footer
- **Purpose:** An interactive, side-by-side comparison between the Academic Preparation Program and the Official Ontario Program. Replaces the inline comparison tables currently duplicated across the Courses page, the GradePage template, and the Primary Foundation page.

**Structure**
1. Hero: "Academic Preparation Program vs. Official Ontario Program" · "Choose the pathway that fits your goals."
2. Pathway selector (pick your grade band: Elementary, Middle School, High School)
3. Dynamic comparison matrix with the following rows:
   - "Purpose" — "Preparation for entry into the Official Ontario Program" / "Official Ontario high school program leading to the OSSD"
   - "Student Record" — "No Ontario student record" / "Ontario student record"
   - "Credential" — "Certificate of Completion" / "Ontario Academic Report Card, OSSD credits, OSSD diploma at Grade 12"
   - "Curriculum" — "Ontario-aligned" / "Official Ontario Curriculum"
   - "Delivery Method" — "Self-Learning via LMS Platform" / "Live online classes with Ontario Certified Teachers plus self-paced components"
   - "Assessment" — "Skill-based feedback, no grades" / "Full assessment with proctored finals, 70% coursework + 30% final examination"
   - "Academic Focus" — "Academic English, mathematical reasoning, scientific literacy, social studies, essential learning skills" / "Full Ontario Curriculum across all eight subject groupings"
   - "Progression" — "Upgrade path into the Official Ontario Program at any time" / "Direct OSSD completion and OUAC or OCAS application"
   - "Outcome" — "Academic readiness, EAP pathway readiness" / "OSSD graduation, Canadian and international university admission readiness"
   - "Full Year Price (Grades 1 to 8)" — "$325 CAD" / "$600 CAD"
   - "Per Course Price (Grades 1 to 8)" — "$75 CAD (50% off $150)" / "$250 CAD"
   - "Per Course Price (Grades 9 to 12)" — "$75 to $150 CAD" / "From $700 CAD, contact for domestic, visa, and international tiers"
   - "Registration Fee" — "$50 CAD (Gr 1 to 8), $100 CAD (Gr 9 to 12)" / "$50 CAD (Gr 1 to 8), $100 CAD (Gr 9 to 12)"
   - "Entrance Test Fee" — "$0 CAD (Gr 1 to 5), $50 CAD (Gr 6 to 12)" / "$0 CAD (Gr 1 to 5), $50 CAD (Gr 6 to 12)"
   - "Schedule" — "September 5, 2026 to May 30, 2027 with continuous enrollment" / "September 5, 2026 to May 30, 2027"
4. Decision helper: "Not sure? Take our 60-second program quiz" (links to an interactive quiz widget that routes to either `/academic-prep` or `/official-ontario`)
5. Final CTA: "Speak with an Advisor"

---

# Appendix A — Elementary (Grades 1 to 5) Price Table

Sourced verbatim from the Price Table (1 to 5) feedback document dated 2026-04 and reconciled against the Web Design Layout.

**Program framing**
- Left column: "Academic Preparation Program (Non-Credit)" — delivered "100% self-paced" via the LMS Platform.
- Right column: "Upgrade to Ontario Official Program (Ontario records)".
- Standard schedule for all grades: "September 5, 2026 to May 30, 2027".

**Per-grade subject list (identical for Grades 1 to 5)**
| Grade | Subject | Language | Delivery Method | What's Included |
|---|---|---|---|---|
| {1 to 5} | Mathematics | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {1 to 5} | Language | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {1 to 5} | The Arts | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {1 to 5} | Science and Technology | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {1 to 5} | Health and Physical Education | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {1 to 5} | Social Studies | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |

*Note: Grades 4 and 5 also include French as a Second Language, preserved from Version 1 Primary Foundation copy. French is not offered Grades 1 to 3.*

**Consolidated pricing matrix (Grades 1 to 5)**

| Grade | Registration Fee | Entrance Test Fee | Academic Prep Price per Course | Academic Prep 50% Discounted Price | Academic Prep Full-Year (6 subjects) | Official Ontario Upgrade per Course | Official Ontario Upgrade Full-Year (6 subjects) |
|---|---|---|---|---|---|---|---|
| 1 | $50 | $0 | $150 | $75 | $325 | $250 | $600 |
| 2 | $50 | $0 | $150 | $75 | $325 | $250 | $600 |
| 3 | $50 | $0 | $150 | $75 | $325 | $250 | $600 |
| 4 | $50 | $0 | $150 | $75 | $325 | $250 | $600 |
| 5 | $50 | $0 | $150 | $75 | $325 | $250 | $600 |

**Promotional banner copy**
- Global banner: "Enroll now and receive a 50% discount — only $325 for a 1-year program"
- Upgrade banner: "Upgrade to the Ontario Official Program (Ontario student record) for $250 per course or $600 per year for all 6 subjects."

**Page copy blocks (to be rendered on each Grades 1 to 5 grade page)**
1. Section heading: "Academic Preparation Program (Non-Credit) — Grade {n}"
2. Subject table (as above)
3. "What's Included" list (as above, shown once above the table)
4. Price callout card
5. Upgrade callout card
6. Fee summary row
7. Schedule line: "Schedule: September 5, 2026 to May 30, 2027"
8. Primary CTA: "Enroll in Grade {n}"
9. Secondary CTA: "Upgrade to Official Ontario Program for Grade {n}"

---

# Appendix B — Middle School (Grades 6 to 8) Price Table

Sourced verbatim from the Price Table (6 to 8) feedback document and reconciled against the Web Design Layout.

**Program framing**
- Left column: "Academic Preparation Program (Non-Credit)" — delivered "100% self-paced" via the LMS Platform.
- Right column: "Upgrade to Ontario Official Program (Ontario records)".
- Standard schedule for all grades: "September 5, 2026 to May 30, 2027".
- **Difference from Grades 1 to 5:** Entrance Test Fee is now $50 CAD (non-refundable) for Grades 6, 7, and 8.

**Per-grade subject list (identical for Grades 6 to 8)**

| Grade | Subject | Language | Delivery Method | What's Included |
|---|---|---|---|---|
| {6 to 8} | Mathematics | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {6 to 8} | Language | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {6 to 8} | The Arts | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {6 to 8} | Science and Technology | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {6 to 8} | Health and Physical Education | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |
| {6 to 8} | Social Studies (History and Geography) | English | Self-Learning via LMS Platform | All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace |

**Consolidated pricing matrix (Grades 6 to 8)**

| Grade | Registration Fee | Entrance Test Fee | Academic Prep Price per Course | Academic Prep 50% Discounted Price | Academic Prep Full-Year (6 subjects) | Official Ontario Upgrade per Course | Official Ontario Upgrade Full-Year (6 subjects) |
|---|---|---|---|---|---|---|---|
| 6 | $50 | $50 | $150 | $75 | $325 | $250 | $600 |
| 7 | $50 | $50 | $150 | $75 | $325 | $250 | $600 |
| 8 | $50 | $50 | $150 | $75 | $325 | $250 | $600 |

**Page copy blocks (to be rendered on each Grades 6 to 8 grade page)** — identical to Appendix A structure, with the entrance test fee updated to $50 CAD and the subject list reflecting middle school subject naming (Social Studies is rendered as "History and Geography" on the Grade 7 and Grade 8 pages).

**Transition messaging for Grade 8**
- Callout: "Grade 8 students: prepare for the Grade 9 academic bridge. Consider enrolling directly in the Official Ontario Program for Grade 9 to begin earning OSSD credits from day one, or continue with the Academic Preparation Program to validate readiness first."

---

# Appendix C — High School (Grades 9 to 12) Detailed Timetables

Sourced from the Ontario Official Programs Grade 9 to 12 and Ontario Programs Grade 9 to 12 (Non-Credit) feedback documents. The timetable tables in those source files were embedded as graphics and therefore only the narrative scaffolding, program notes, and fee structure could be extracted verbatim. The course code lists below are the Ontario Ministry of Education standard course codes that EMCS is authorized to deliver under BSID 886229.

**Global framing (from the feedback documents)**
- Page hero: "ONTARIO CURRICULUM PROGRAMS (Grades 9 to 12)"
- Tagline stack: "Flexible Learning Pathways" · "Learn First. Decide Later. Succeed Safely."
- Lede: "We offer programs based on the Ontario Curriculum for students in Grades 9 to 12, with two flexible learning pathways: Academic Preparation Program (Non-Credit) and Ontario Secondary School Diploma (OSSD) Program."

**Pathway A — Academic Preparation Program (Non-Credit)**
- Descriptive paragraph: "The Academic Preparation Program (Non-Credit) is designed for students who aspire to pursue a rigorous academic pathway within an international educational framework. The program focuses on establishing strong academic foundations while cultivating analytical thinking, disciplined study habits, and the confidence required to succeed within the Canadian education system. Developed in alignment with Ontario curriculum standards, the program strengthens students' competencies in Academic English, mathematical reasoning, and advanced learning skills. Through personalized learning pathways and close academic mentorship, the program provides a solid transition into OSSD credit courses or EAP programs, preparing students to excel in high-quality, globally oriented academic environments."

**Pathway B — Ontario Secondary School Diploma (OSSD) Program**
- Descriptive paragraph: "The Ontario Secondary School Diploma (OSSD) Program is a prestigious, fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Delivered in alignment with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. Through personalized academic guidance and a structured learning environment, students are fully prepared for graduation, university admission in Canada and internationally, and long-term success within a globally recognized education system."

**Fee strip (applies to every Grades 9 to 12 page)**
- Registration Fee: $100 CAD (non-refundable)
- Entrance Test Fee: $50 CAD (non-refundable)

## Appendix C.1 — Grade 9 Academic Year Timetable and Tuition Fee

**Section heading:** "Ontario Official High School Program — Study with Canadian Teachers"
**Sub-heading:** "Grade 9 Academic Year Timetable and Tuition Fee"

**Standard 8-credit Grade 9 course list (Ontario Ministry standard course codes)**

| Course Code | Course Name | Type | Credit | Notes |
|---|---|---|---|---|
| ENG1D | English, Grade 9 (Academic) | Compulsory | 1.0 | Foundational OSSD English credit |
| MTH1W | Mathematics, Grade 9 (De-streamed) | Compulsory | 1.0 | Replaces former MPM1D and MFM1P |
| SNC1W | Science, Grade 9 (De-streamed) | Compulsory | 1.0 | Replaces former SNC1D and SNC1P |
| CGC1D | Issues in Canadian Geography, Grade 9 (Academic) | Compulsory | 1.0 | Satisfies Canadian Geography OSSD requirement |
| FSF1D | Core French, Grade 9 (Academic) | Compulsory | 1.0 | **Waived** for students who completed Grade 8 in their home country — an equivalent credit will be granted |
| PPL1O | Healthy Active Living Education, Grade 9 (Open) | Compulsory | 1.0 | Satisfies Health and Physical Education OSSD requirement |
| AMU1O / AVI1O / ADA1O | Music / Visual Arts / Dramatic Arts, Grade 9 (Open) | Compulsory | 1.0 | Student selects one Arts credit |
| BTT1O | Information and Communication Technology in Business, Grade 9 (Open) | Optional | 1.0 | Rounds the 8-credit one-year program |

**Note strip (from the feedback document):** "The discounted tuition fee is applicable only to the one-year (8-credit) program. For single-course pricing, please view here. Students who have completed Grade 8 in their home country are not required to take French as a Second Language. An equivalent credit will be granted."

**Tuition columns to render on the Grade 9 page**
- Course Code
- Course Name
- Type (Compulsory / Optional)
- Credit (1.0 per course)
- Price per Course (CAD)
- Discounted Price per Course (CAD)
- Program Total (full 8-credit one-year program)

**Grade 9 Total row:** "Grade 9 Total (8-credit one-year program)" — discounted tuition applies only when the full 8-credit package is purchased.

## Appendix C.2 — Grade 10 Academic Year Timetable and Tuition Fee

**Section heading:** "Ontario Official High School Program — Study with Canadian Teachers"
**Sub-heading:** "Grade 10 Academic Year Timetable and Tuition Fee"

**Standard 8-credit Grade 10 course list**

| Course Code | Course Name | Type | Credit | Notes |
|---|---|---|---|---|
| ENG2D | English, Grade 10 (Academic) | Compulsory | 1.0 | |
| MPM2D | Principles of Mathematics, Grade 10 (Academic) | Compulsory | 1.0 | Prerequisite to MCR3U |
| SNC2D | Science, Grade 10 (Academic) | Compulsory | 1.0 | |
| CHC2D | Canadian History Since World War I, Grade 10 (Academic) | Compulsory | 1.0 | Satisfies Canadian History OSSD requirement |
| CHV2O | Civics and Citizenship, Grade 10 (Open) | Compulsory | 0.5 | Half-credit paired with GLC2O |
| GLC2O | Career Studies, Grade 10 (Open) | Compulsory | 0.5 | Half-credit paired with CHV2O |
| FSF2D | Core French, Grade 10 (Academic) | Compulsory | 1.0 | **Waived** (Non-Credit pathway) for students who completed Grade 9 in their home country — an equivalent credit will be granted |
| PPL2O | Healthy Active Living Education, Grade 10 (Open) | Optional | 1.0 | |
| TIJ2O | Exploring Technologies, Grade 10 (Open) | Optional | 1.0 | Rounds the 8-credit one-year program |

**Note strip (from the feedback document):** "The discounted tuition fee is applicable only to the one-year (8-credit) program. For single-course pricing, please view here."

**Grade 10 Total row:** "Grade 10 Total (8-credit one-year program)"

## Appendix C.3 — Grade 11 Academic Year Timetable and Tuition Fee

**Section heading:** "Ontario Official High School Program — Study with Canadian Teachers"
**Sub-heading:** "Grade 11 Academic Year Timetable and Tuition Fee"

**Standard 7-credit Grade 11 course list**

| Course Code | Course Name | Type | Credit | Notes |
|---|---|---|---|---|
| ENG3U | English, Grade 11 (University) | Compulsory | 1.0 | |
| MCR3U | Functions, Grade 11 (University) | Compulsory | 1.0 | Prerequisite to MHF4U |
| SCH3U | Chemistry, Grade 11 (University) | Optional | 1.0 | Required for many science university programs |
| SBI3U | Biology, Grade 11 (University) | Optional | 1.0 | Required for many life science university programs |
| SPH3U | Physics, Grade 11 (University) | Optional | 1.0 | Required for many engineering university programs |
| BAF3M | Financial Accounting Fundamentals, Grade 11 (University or College) | Optional | 1.0 | Business stream elective |
| ICS3U | Introduction to Computer Science, Grade 11 (University) | Optional | 1.0 | STEM stream elective |

**Note strip (from the feedback document):** "The discounted tuition fee is applicable only to the one-year (7-credit) program. For single-course pricing, please view here. Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."

**Grade 11 Total row:** "Grade 11 Total (7-credit one-year program)"

## Appendix C.4 — Grade 12 Academic Year Timetable and Tuition Fee

**Section heading:** "Ontario Official High School Program — Study with Canadian Teachers"
**Sub-heading:** "Grade 12 Academic Year Timetable and Tuition Fee"

**Standard 7-credit Grade 12 course list**

| Course Code | Course Name | Type | Credit | Notes |
|---|---|---|---|---|
| ENG4U | English, Grade 12 (University) | Compulsory | 1.0 | Required for all Ontario university admissions |
| MHF4U | Advanced Functions, Grade 12 (University) | Compulsory | 1.0 | Prerequisite to MCV4U |
| MCV4U | Calculus and Vectors, Grade 12 (University) | Optional | 1.0 | **Sequence note: MCV4U will be taken after MHF4U is completed** |
| SCH4U | Chemistry, Grade 12 (University) | Optional | 1.0 | Required for many science university programs |
| SBI4U | Biology, Grade 12 (University) | Optional | 1.0 | Required for many life science university programs |
| SPH4U | Physics, Grade 12 (University) | Optional | 1.0 | Required for many engineering university programs |
| SES4U | Earth and Space Science, Grade 12 (University) | Optional | 1.0 | |
| BBB4M | International Business Fundamentals, Grade 12 (University or College) | Optional | 1.0 | Business stream elective |

**Note strip (from the feedback document):** "MCV4U will be taken after MHF4U is completed. The discounted tuition fee is applicable only to the one-year (7-credit) program. For single-course pricing, please view here. Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."

**Grade 12 Total row:** "Grade 12 Total (7-credit one-year program)"

## Appendix C.5 — Academic Preparation Program (Non-Credit) Grades 9 to 12 Timetables

The Academic Preparation Program (Non-Credit) Grades 9 to 12 offerings mirror the Official Ontario course list for the same grade, but are delivered as Self-Learning via the LMS Platform with no Ontario student record. The same 8-credit (Grades 9, 10) and 7-credit (Grades 11, 12) program structures apply, with per-course pricing starting at $75 CAD (50% off $150) for each grade.

**Upgrade narrative (rendered at the top of each Non-Credit Grades 9 to 12 page):** "Start in the Academic Preparation Program to build readiness and validate mastery, then upgrade to the Official Ontario Program at any time to earn credit and establish your Ontario student record. Previous coursework completed in the Academic Preparation Program may be reviewed to accelerate progress toward the OSSD."

---

# Appendix D — Consolidated Fee Schedule

Reconciled from Price Table (1 to 5), Price Table (6 to 8), Ontario Official Programs Grade 9 to 12, and Ontario Programs Grade 9 to 12 (Non-Credit).

| Grade Band | Program | Registration Fee | Entrance Test Fee | Per-Course (Regular) | Per-Course (Discounted) | Full-Year Bundle | Upgrade per Course (to Ontario Student Record) | Upgrade Full-Year Bundle |
|---|---|---|---|---|---|---|---|---|
| Grades 1 to 5 | Academic Preparation | $50 | $0 | $150 | $75 | $325 (6 subjects) | $250 | $600 (6 subjects) |
| Grades 6 to 8 | Academic Preparation | $50 | $50 | $150 | $75 | $325 (6 subjects) | $250 | $600 (6 subjects) |
| Grades 9 to 10 | Academic Preparation (Non-Credit) | $100 | $50 | $150 | $75 | Contact admissions | n/a (upgrade handled through Official Ontario) | n/a |
| Grades 9 to 10 | Official Ontario (8-credit program) | $100 | $50 | From $700 | Contact admissions for tiered rates | From $3,800 (full 8-credit) | n/a | n/a |
| Grades 11 to 12 | Academic Preparation (Non-Credit) | $100 | $50 | $150 | $75 | Contact admissions | n/a | n/a |
| Grades 11 to 12 | Official Ontario (7-credit program) | $100 | $50 | From $700 | Contact admissions for tiered rates | From $3,800 (full 7-credit) | n/a | n/a |
| Grades 1 to 5 | Primary Foundation Teacher-Led (premium, legacy) | $100 | $50 | Included in bundle | n/a | $3,500 (6 subjects) | n/a | n/a |

**Refund policy footnote (preserved from Version 1):** "Refund eligibility depends on course progress. Please contact our admissions team for details on our refund policy."

**Payment methods (preserved from Version 1, reinforced in Version 2):** Visa, Mastercard, Bank Transfer, Flywire (supports Alipay and WeChat Pay for international payments).

---

# Appendix E — Web Design Layout Feedback Implementation Checklist

Translated directly from the Web Design Layout feedback document into a checklist that web designers and front-end developers should complete.

1. **Navigation menu** — "Change to Program: When hovering over the Program menu, two panels will appear." Implement the updated two-panel Program dropdown described in the revised `Header.jsx` section above. Each panel must now show the full descriptive paragraph (not just a tagline) and the three grade-group pills.
2. **View More behaviour** — "When parents or students click 'View more' for the Academic Preparation Program, they will be directed to the Academic Preparation Program page, which includes the following sections: Grade 1 to 5, Grade 6 to 8, Grade 9 to 12." Ensure both `/academic-prep` and `/official-ontario` landing pages render the three grade groups as the first screenful below the hero.
3. **Grade group drill-down** — "Each grade group will contain two sections: Academic Preparation Program (Non-Ontario student record) and UPGRADE to Official Ontario Program (Ontario student record)." Implement the new `GradeGroupPanel` component (see Version 2 shared components) and wire it to `/academic-prep/group/:groupSlug` and `/official-ontario/group/:groupSlug`.
4. **Copy blocks on the two-column panel** — use the verbatim paragraphs from the Web Design Layout doc (rendered above in the Version 2 Program dropdown specification and in the GradeGroupPanel specification).
5. **Home page tagline** — add the hero tagline "We offer Ontario Curriculum-aligned learning for students in Grades 1 to 12 through two flexible pathways: Academic Preparation Program (Non-Ontario student record) and Official Ontario Program (Ontario student record). Students may start with preparation learning and upgrade to credit-bearing courses when academically ready." to the Home page hero section (to be added to `home.hero.subtitle` in `en.json`).
6. **Upgrade messaging consistency** — every place where Academic Preparation is surfaced (grade pages, course cards, cart rows, checkout summary) must show the "Upgrade to Official Ontario Program" affordance.
7. **Schedule visibility** — add the September 5, 2026 to May 30, 2027 schedule strip to every grade page footer and to the new `/schedule` page.
8. **Terminology replacement** — replace "Self-Learning Program" with "Academic Preparation Program (Non-Ontario student record)" in all marketing surfaces, and "Teacher-Led Program" with "Official Ontario Program (Ontario student record)" where the context is the Ontario student record upgrade (NOT where the context is the premium $3,500/year Primary Foundation Teacher-Led experience, which retains its Version 1 naming).

---

# Appendix F — Locale keys added in Version 2

The following `en.json` and `en-storefronts.json` keys need to be added to support the Version 2 copy above. Existing Version 1 keys are preserved.

**`en.json` additions**
- `home.hero.subtitleV2` — "We offer Ontario Curriculum-aligned learning for students in Grades 1 to 12 through two flexible pathways: Academic Preparation Program (Non-Ontario student record) and Official Ontario Program (Ontario student record). Students may start with preparation learning and upgrade to credit-bearing courses when academically ready."
- `home.taglineLearn` — "Learn First. Decide Later. Succeed Safely."
- `home.featuredPrograms.middleSchool.*` — full object for the new Middle School card.
- `home.featuredPrograms.highSchool.*` — full object for the new High School Pathways card.
- `programPathways.highSchoolAcademicPrep.*` — full object for the High School Preparation card.
- `programPathways.footnote` — "Registration and entrance test fees vary by grade band. See Appendix D of the site map for the consolidated fee schedule."
- `nav.program.leftDescription` — full paragraph for the Academic Preparation Program dropdown card.
- `nav.program.rightDescription` — full paragraph for the Official Ontario Program dropdown card.
- `nav.program.footerTagline` — "Flexible Learning Pathways. Learn First. Decide Later. Succeed Safely."
- `nav.program.compareLink` — "Compare Both Programs →"
- `nav.program.scheduleLink` — "View Academic Calendar →"
- `middleSchool.*` — full namespace for the new `/programs/middle-school` page.
- `highSchool.*` — full namespace for the new `/programs/high-school` page.
- `highSchool.hero.title` — "ONTARIO CURRICULUM PROGRAMS (Grades 9 to 12)"
- `highSchool.hero.subtitle` — "Flexible Learning Pathways"
- `highSchool.hero.tagline` — "Learn First. Decide Later. Succeed Safely."
- `highSchool.lede` — "We offer programs based on the Ontario Curriculum for students in Grades 9 to 12, with two flexible learning pathways:"
- `highSchool.pathwayA.*` — Academic Preparation Program (Non-Credit) card copy.
- `highSchool.pathwayB.*` — Ontario Secondary School Diploma (OSSD) Program card copy.
- `highSchool.officialHeading` — "Ontario Official High School Program"
- `highSchool.officialSubheading` — "Study with Canadian Teachers"
- `highSchool.grade9Note` — "The discounted tuition fee is applicable only to the one-year (8-credit) program. For single-course pricing, please view here. Students who have completed Grade 8 in their home country are not required to take French as a Second Language. An equivalent credit will be granted."
- `highSchool.grade10Note` — "The discounted tuition fee is applicable only to the one-year (8-credit) program. For single-course pricing, please view here. Students who have completed Grade 9 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
- `highSchool.grade11Note` — "The discounted tuition fee is applicable only to the one-year (7-credit) program. For single-course pricing, please view here. Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
- `highSchool.grade12Note` — "MCV4U will be taken after MHF4U is completed. The discounted tuition fee is applicable only to the one-year (7-credit) program. For single-course pricing, please view here. Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
- `highSchool.fees.registration` — "Registration Fee: $100 CAD (non-refundable)"
- `highSchool.fees.entranceTest` — "Entrance Test Fee: $50 CAD (non-refundable)"
- `tuitionPage.*` — full namespace for the new `/tuition` page.
- `schedulePage.*` — full namespace for the new `/schedule` page.
- `comparePage.*` — full namespace for the new `/compare` page.

**`en-storefronts.json` additions**
- `storefronts.programFrame.nonOntarioRecord` — "Non-Ontario student record"
- `storefronts.programFrame.ontarioRecord` — "Ontario student record"
- `storefronts.programFrame.upgradeCallout` — "UPGRADE to Official Ontario Program (Ontario student record)"
- `storefronts.pricing.promoBanner` — "Enroll now and receive a 50% discount — only $325 for a 1-year program"
- `storefronts.pricing.perCourseRegular` — "$150 per course"
- `storefronts.pricing.perCourseDiscounted` — "$75 per course (50% off)"
- `storefronts.pricing.fullYearPrep` — "$325 per year (all 6 subjects)"
- `storefronts.pricing.upgradePerCourse` — "$250 per course (upgrade to Ontario student record)"
- `storefronts.pricing.upgradeFullYear` — "$600 per year (upgrade to Ontario student record, all 6 subjects)"
- `storefronts.schedule.standard` — "Schedule: September 5, 2026 to May 30, 2027 (39 instructional weeks)"
- `storefronts.gradeGroup.elementary.title` — "Elementary (Grades 1 to 5)"
- `storefronts.gradeGroup.middle.title` — "Middle School (Grades 6 to 8)"
- `storefronts.gradeGroup.high.title` — "High School (Grades 9 to 12)"
- `storefronts.frenchExemption.grade9` — "Students who have completed Grade 8 in their home country are not required to take French as a Second Language. An equivalent credit will be granted."
- `storefronts.frenchExemption.grade10` — "Students who have completed Grade 9 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
- `storefronts.frenchExemption.grade11` — "Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
- `storefronts.frenchExemption.grade12` — "Students who have completed Grade 10 in their home country are not required to take French as a Second Language (Non-Credit pathway). An equivalent credit will be granted."
- `storefronts.gradeTotals.grade9` — "Grade 9 Total (8-credit one-year program)"
- `storefronts.gradeTotals.grade10` — "Grade 10 Total (8-credit one-year program)"
- `storefronts.gradeTotals.grade11` — "Grade 11 Total (7-credit one-year program)"
- `storefronts.gradeTotals.grade12` — "Grade 12 Total (7-credit one-year program)"
- `storefronts.mcv4uSequence` — "MCV4U will be taken after MHF4U is completed."
- `storefronts.learnFirst` — "Learn First."
- `storefronts.decideLater` — "Decide Later."
- `storefronts.succeedSafely` — "Succeed Safely."

---

# Version 2 sign-off

This Version 2 site map is additive to Version 1: all existing routes, components, and copy dumps from Version 1 have been preserved unchanged, with targeted in-place updates to pricing figures, terminology, and decision-tree language in the Home, Courses, Academic Prep landing, and Official Ontario landing sections. All new pages, components, copy blocks, pricing matrices, and grade-specific timetable scaffolds are collected in the Version 2 Additions section and the Appendices A through F above.

Reviewers who want a quick-read of just the Version 2 deltas should scan: the "Version 2 Changelog" block at the top of the document, the revised Program dropdown specification inside the Shared Chrome section, the revised Featured Programs and Program Pathways sections inside the Home page, the revised comparison table inside the Courses page, the revised Academic Prep and Official Ontario pricing blocks, and the entire Version 2 Additions section with Appendices A through F at the bottom of the document.
