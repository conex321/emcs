# EMCS Site Map — Version 3

> Current-state site map of the **Excellence Maple Canadian School (EMCS)** React + Vite app.
> Routes confirmed against [src/App.jsx](../src/App.jsx) as of 2026-04-19.
> Production URL: [canadaemcs.com](https://canadaemcs.com)
>
> **What changed since v2 (2026-04-14):**
> - Added `/register` public route ([Register.jsx](../src/pages/Register.jsx)) — parent/guardian account creation tied to enrollment summary
> - Added `/privacy-policy` and `/terms-of-service` ([LegalPage.jsx](../src/pages/LegalPage.jsx)) — one component, content switched by `location.pathname`
> - Added admin surface: `/admin` (redirect) → `/admin/dashboard` ([AdminDashboard.jsx](../src/pages/admin/AdminDashboard.jsx)) — 4-tab school-admin console
> - Portal pages now expose tabbed structures (Parent, Agent, Admin); Student portal is single-page with conditional sections
> - Student portal surfaces uploaded-document cards
> - `/admin` and `/admin/dashboard` are role-gated to `admin` or `school_admin`
>
> v1 and v2 remain the canonical copy-dump references for public/storefront content. v3 is a route-level map plus structural deltas — it does **not** re-dump locale copy.

---

## 1. Route inventory (46 routes)

| # | Group | Route | Component | Auth |
|---|---|---|---|---|
| 1 | Auth | `/auth` | [AuthPage.jsx](../src/pages/auth/AuthPage.jsx) | Public |
| 2 | Auth | `/auth/callback` | [AuthCallback.jsx](../src/pages/auth/AuthCallback.jsx) | Public |
| 3 | Public | `/` | [Home.jsx](../src/pages/Home.jsx) | Public |
| 4 | Public | `/about` | [About.jsx](../src/pages/About.jsx) | Public |
| 5 | Public | `/courses` | [Courses.jsx](../src/pages/Courses.jsx) | Public |
| 6 | Public | `/courses/:courseCode` | [CourseDetail.jsx](../src/pages/CourseDetail.jsx) | Public |
| 7 | Public | `/admissions/international` | [InternationalStudents.jsx](../src/pages/InternationalStudents.jsx) | Public |
| 8 | Public | `/ossd-requirements` | [OssdRequirements.jsx](../src/pages/OssdRequirements.jsx) | Public |
| 9 | Public | `/student-support` | [StudentSupport.jsx](../src/pages/StudentSupport.jsx) | Public |
| 10 | Public | `/faq` | [Faq.jsx](../src/pages/Faq.jsx) | Public |
| 11 | Public | `/contact` | [Contact.jsx](../src/pages/Contact.jsx) | Public |
| 12 | Public | `/privacy-policy` | [LegalPage.jsx](../src/pages/LegalPage.jsx) | Public |
| 13 | Public | `/terms-of-service` | [LegalPage.jsx](../src/pages/LegalPage.jsx) | Public |
| 14 | Public | `/register` | [Register.jsx](../src/pages/Register.jsx) | Public |
| 15 | Public | `/programs/elementary` | [PrimaryFoundation.jsx](../src/pages/PrimaryFoundation.jsx) | Public |
| 16 | Public | `/programs/middle-school` | [MiddleSchoolFoundation.jsx](../src/pages/MiddleSchoolFoundation.jsx) | Public |
| 17 | Public | `/programs/high-school` | [HighSchoolPathways.jsx](../src/pages/HighSchoolPathways.jsx) | Public |
| 18 | Public | `/tuition` | [Tuition.jsx](../src/pages/Tuition.jsx) | Public |
| 19 | Public | `/schedule` | [AcademicCalendar.jsx](../src/pages/AcademicCalendar.jsx) | Public |
| 20 | Public | `/compare` | [ProgramCompare.jsx](../src/pages/ProgramCompare.jsx) | Public |
| 21 | Public | `/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) | Public |
| 22 | Storefront | `/academic-prep` | [AcademicPrepLanding.jsx](../src/pages/AcademicPrepLanding.jsx) | Public |
| 23 | Storefront | `/academic-prep/group/:groupSlug` | [GradeGroupPage.jsx](../src/pages/GradeGroupPage.jsx) | Public |
| 24 | Storefront | `/academic-prep/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) | Public |
| 25 | Storefront | `/academic-prep/grade/:grade/courses` | [GradePage.jsx](../src/pages/GradePage.jsx) | Public |
| 26 | Storefront | `/academic-prep/course/:courseCode` | [StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx) | Public |
| 27 | Storefront | `/official-ontario` | [OfficialOntarioLanding.jsx](../src/pages/OfficialOntarioLanding.jsx) | Public |
| 28 | Storefront | `/official-ontario/group/:groupSlug` | [GradeGroupPage.jsx](../src/pages/GradeGroupPage.jsx) | Public |
| 29 | Storefront | `/official-ontario/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) | Public |
| 30 | Storefront | `/official-ontario/grade/:grade/courses` | [GradePage.jsx](../src/pages/GradePage.jsx) | Public |
| 31 | Storefront | `/official-ontario/course/:courseCode` | [StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx) | Public |
| 32 | Commerce | `/cart` | [Cart.jsx](../src/pages/Cart.jsx) | Public |
| 33 | Commerce | `/checkout` | [Checkout.jsx](../src/pages/Checkout.jsx) | Public |
| 34 | Portal | `/portal/student` | [StudentPortal.jsx](../src/pages/portals/StudentPortal.jsx) | `student`, `parent`, `admin` |
| 35 | Portal | `/portal/parent` | [ParentPortal.jsx](../src/pages/portals/ParentPortal.jsx) | `parent`, `admin` |
| 36 | Portal | `/portal/agent` | [AgentPortal.jsx](../src/pages/portals/AgentPortal.jsx) | `agent`, `admin` |
| 37 | Admin | `/admin` → `/admin/dashboard` | Navigate | `admin`, `school_admin` |
| 38 | Admin | `/admin/dashboard` | [AdminDashboard.jsx](../src/pages/admin/AdminDashboard.jsx) | `admin`, `school_admin` |
| 39 | Redirect | `/non-credit` → `/academic-prep` | Navigate | Public |
| 40 | Redirect | `/credit` → `/official-ontario` | Navigate | Public |
| 41 | Legacy | `/non-credit/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) | Public |
| 42 | Legacy | `/non-credit/course/:courseCode` | [StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx) | Public |
| 43 | Legacy | `/credit/grade/:grade` | [GradePage.jsx](../src/pages/GradePage.jsx) | Public |
| 44 | Legacy | `/credit/course/:courseCode` | [StorefrontCourseDetail.jsx](../src/pages/StorefrontCourseDetail.jsx) | Public |
| 45 | Legacy landing | `/non-credit` | [AcademicPrepLanding.jsx](../src/pages/AcademicPrepLanding.jsx) | Public |
| 46 | Legacy landing | `/credit` | [OfficialOntarioLanding.jsx](../src/pages/OfficialOntarioLanding.jsx) | Public |

Auth gating is enforced by [ProtectedRoute.jsx](../src/components/ProtectedRoute.jsx) using `requiredRoles` against the authenticated user's role in [AuthContext.jsx](../src/context/AuthContext.jsx).

---

## 2. Chrome by route group

| Route group | Header | Footer | Provider wrapping |
|---|---|---|---|
| `/auth`, `/auth/callback` | — | — | `AuthProvider` only |
| `/academic-prep/*`, `/official-ontario/*`, `/non-credit/*`, `/credit/*` | [Header.jsx](../src/components/Header.jsx) | [Footer.jsx](../src/components/Footer.jsx) | `AuthProvider` + `StorefrontProvider` |
| `/cart`, `/checkout` | Header | Footer | `AuthProvider` + `StorefrontProvider` |
| All other `/*` (public + portals + admin) | Header | Footer | `AuthProvider` |

`StorefrontHeader.jsx` exists in the repo but is **not mounted** on any route.

---

## 3. Page structures — delta pages only

Pages unchanged from v1/v2 (Home, About, Courses, CourseDetail, InternationalStudents, OssdRequirements, StudentSupport, Faq, Contact, PrimaryFoundation, MiddleSchoolFoundation, HighSchoolPathways, Tuition, AcademicCalendar, ProgramCompare, AcademicPrepLanding, OfficialOntarioLanding, GradeGroupPage, GradePage, StorefrontCourseDetail, Cart, Checkout, AuthPage, AuthCallback) are already documented there. This section covers new or restructured pages.

### 3.1 `/register` — [Register.jsx](../src/pages/Register.jsx)

**Purpose:** Parent/guardian account creation, typically reached from checkout or storefront CTAs with an enrollment summary in state.

**Structure (top → bottom):**
1. Page heading — `register.title` ("Create your EMCS account"), subtitle `register.subtitle`
2. **Enrollment summary panel** — `register.summary.title` ("Your enrollment"), pulled from router state
3. **Parent / guardian details form** — `register.form.title`, fields:
   - Full name (`register.form.name`)
   - Email (`register.form.email`)
   - Password / Confirm password (`register.form.password`, `register.form.confirm`)
   - Phone (optional) (`register.form.phone`)
   - Country (`register.form.country`)
   - Province / state (`register.form.province`)
4. Submit → creates Supabase auth user + parent profile, then redirects to checkout or portal depending on context

### 3.2 `/privacy-policy` and `/terms-of-service` — [LegalPage.jsx](../src/pages/LegalPage.jsx)

Single component; content chosen by `location.pathname` against the `LEGAL_CONTENT` map.

**Structure:**
1. `<h1>` — page title (e.g. "Privacy Policy" / "Terms of Service")
2. Subtitle paragraph
3. Repeated section blocks — each with `<h2>` heading and paragraph(s)

**Sections — `/privacy-policy`:** Information We Collect · How We Use Information · Storage and Access · Questions or Requests

**Sections — `/terms-of-service`:** Use of the Platform · Orders and Enrollment · Student Records and Documents · Contact and Support

All copy is **HARDCODED** in `LegalPage.jsx` (not in locale files).

### 3.3 `/admin/dashboard` — [AdminDashboard.jsx](../src/pages/admin/AdminDashboard.jsx)

**Purpose:** School-admin operations console. Role-gated (`admin`, `school_admin`).

**Structure:**
1. Header — greeting "Admin Dashboard", stat chips
2. **Tab bar** — 4 tabs, `activeTab` state in [AdminDashboard.jsx:47](../src/pages/admin/AdminDashboard.jsx#L47):

| Tab | `activeTab` value | Sections |
|---|---|---|
| Overview | `'overview'` | Latest Registrations · Operational Shortcuts |
| Registrations | `'registrations'` | Student Registrations (table with audited actions) |
| Documents | `'documents'` | Documents (uploaded student docs, review/link workflow) |
| Accounts | `'accounts'` | Create Account · Recent Email Activity · Recent Audit History |

Audited actions and audit history are backed by the admin audit log and email-log tables in Supabase.

### 3.4 `/portal/student` — [StudentPortal.jsx](../src/pages/portals/StudentPortal.jsx)

Single page, **no tabs**. Conditional sections based on enrollment state.

**Structure:**
1. Portal header — avatar, greeting, subtitle, stat chips (Active / Completed)
2. Loading / error / empty-state branches
3. When enrollments exist:
   - **Active Courses** section — course cards with progress bar and Moodle "Launch Course" button when `moodle_enrolment_id` + `moodle_course_id` are present
   - **Completed Courses** section — final-grade badges
   - **Uploaded Documents** section (conditional) — doc cards with status badge (linked / pending)
   - **Quick Actions** section — links to `/academic-prep`, mailto `support@emcs.ca`, `/schedule`, `/student-support`

### 3.5 `/portal/parent` — [ParentPortal.jsx](../src/pages/portals/ParentPortal.jsx)

Tabbed. `activeTab` state.

| Tab | Sections |
|---|---|
| Overview (`'overview'`) | Welcome/empty state · Children summary · Recent Orders table |
| Children (`'children'`) | Children list (empty state: "No Students Enrolled") |
| Orders (`'orders'`) | Orders table (empty state: "No Orders Yet") |

Plus a trailing quick-actions section.

### 3.6 `/portal/agent` — [AgentPortal.jsx](../src/pages/portals/AgentPortal.jsx)

Tabbed. `activeTab` state.

| Tab | Sections |
|---|---|
| Overview (`'overview'`) | Welcome / "Start Referring" · stats |
| Referrals (`'referrals'`) | Referrals table (empty state: "No Referrals Yet") |

Plus a trailing quick-actions section.

---

## 4. Navigation edges (conceptual)

```
Public entry (/)
  ├─ Program dropdown → /programs/elementary · /programs/middle-school · /programs/high-school
  ├─ Storefront CTAs → /academic-prep · /official-ontario
  ├─ /tuition · /compare · /schedule
  ├─ /courses, /faq, /contact, /about, /admissions/international
  └─ Footer → /privacy-policy · /terms-of-service

Storefront flow
  /academic-prep | /official-ontario
    → /…/group/:groupSlug (elementary | middle | high)
      → /…/grade/:grade
        → /…/course/:courseCode → Add to cart
  → /cart → /checkout
    → /register (if unauthenticated) → back to /checkout
    → success → /portal/parent or /portal/student

Auth
  /auth → /auth/callback → role-based redirect:
    student → /portal/student
    parent  → /portal/parent
    agent   → /portal/agent
    admin | school_admin → /admin/dashboard

Admin
  /admin → /admin/dashboard (4 tabs)
    Registrations tab → audited student + order actions
    Documents tab     → review / link uploaded student docs
    Accounts tab      → create account, view email log + audit log
```

---

## 5. Known non-route assets

- `StorefrontHeader.jsx` — exists, not mounted
- `CreditLanding.jsx` and `NonCreditLanding.jsx` — legacy components, superseded by `AcademicPrepLanding` / `OfficialOntarioLanding`, currently unreferenced from `App.jsx`
- `ProgramLanding.css`, `StorefrontLanding.css` — style sheets retained for legacy/shared use

---

## 6. References

- Routes: [src/App.jsx](../src/App.jsx)
- Auth guard: [src/components/ProtectedRoute.jsx](../src/components/ProtectedRoute.jsx) · [src/context/AuthContext.jsx](../src/context/AuthContext.jsx)
- Storefront context: [src/context/StorefrontContext.jsx](../src/context/StorefrontContext.jsx)
- Copy (English): [src/locales/en.json](../src/locales/en.json) · [src/locales/en-storefronts.json](../src/locales/en-storefronts.json)
- Copy (Vietnamese): [src/locales/vi.json](../src/locales/vi.json) · [src/locales/vi-storefronts.json](../src/locales/vi-storefronts.json)
- Prior versions: [sitemap.md](sitemap.md) (v1) · [sitemap-v2.md](sitemap-v2.md) (v2)
