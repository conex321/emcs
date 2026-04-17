# SISConex — Backend Architecture Reference

> **Project**: Moodle Student Hub (`sis-conex`)
> **Repository root**: `moodle-student-hub/moodle-student-hub/`
> **Last updated**: April 2026

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Authentication & Registration](#2-authentication--registration)
3. [User Roles & Routing](#3-user-roles--routing)
4. [Supabase Database Schema](#4-supabase-database-schema)
5. [Moodle Integration](#5-moodle-integration)
6. [Data Synchronization Pipeline](#6-data-synchronization-pipeline)
7. [Activity Classification Rules](#7-activity-classification-rules)
8. [Grader Tracking & Productivity](#8-grader-tracking--productivity)
9. [Student Profile Lifecycle](#9-student-profile-lifecycle)
10. [Edge Functions](#10-edge-functions)
11. [Scheduler & Cron Configuration](#11-scheduler--cron-configuration)
12. [Environment Variables](#12-environment-variables)

---

## 1. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 18 + TypeScript | Single-page app with react-router-dom |
| **Build Tool** | Vite 5 | SWC plugin for fast HMR |
| **Styling** | Tailwind CSS 3 | With `tailwindcss-animate` plugin |
| **UI Components** | shadcn/ui (Radix primitives) | Via `class-variance-authority` and `@radix-ui/*` |
| **State Management** | React Context + TanStack Query | `AuthContext`, `ReportsContext`, `TourContext` |
| **Backend / BaaS** | Supabase (hosted) | Auth, Postgres DB, Edge Functions, Storage |
| **LMS Integration** | Moodle Web Services REST API | Token-authenticated HTTP calls |
| **HTTP Client** | Axios (frontend) / native `fetch` (backend) | Used for Moodle API communication |
| **Charts** | Recharts | Dashboard data visualizations |
| **Form Validation** | react-hook-form + Zod | Schema-based validation |
| **Scripts Runtime** | tsx (TypeScript executor) | `npx tsx scripts/*.ts` |
| **Scheduling** | node-cron (dev) / pg_cron (prod) | Twice-daily sync + daily emails |
| **Testing** | Vitest (unit/component), Playwright (E2E) | Plus TestSprite automated audits |
| **Deployment** | Vercel | Via `vercel.json` + Git push |

---

## 2. Authentication & Registration

### 2.1 How It Works

Authentication is handled entirely through **Supabase Auth**. The application uses email/password sign-in with PKCE code exchange for security. There is NO OAuth/social login.

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  Login Form  │────▶│  Supabase Auth   │────▶│  profiles table      │
│  /auth       │     │  signInWithPwd() │     │  (role lookup)       │
└──────────────┘     └──────────────────┘     └──────────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Role-based      │
                     │  redirect        │
                     │  /admin/dashboard│
                     │  /teacher/dash   │
                     │  /school-admin/  │
                     └──────────────────┘
```

### 2.2 Login Form Fields

The login form is at `/auth` and contains two tabs: **Login** and **Register**.

#### Login Tab (`login-tab.tsx`)

| Field | Type | Validation | Storage |
|---|---|---|---|
| **Email** | `email` input | Required, non-empty | Sent to `supabase.auth.signInWithPassword()` |
| **Password** | `password` input | Required, non-empty | Sent to `supabase.auth.signInWithPassword()` |
| **Remember Me** | Checkbox | Optional | Passed to login credentials (session persistence) |

#### Register Tab (`register-tab.tsx`)

| Field | Type | Validation | Storage |
|---|---|---|---|
| **Full Name** | `text` input | Required | Stored in `user_metadata.full_name` and `profiles.full_name` |
| **Email** | `email` input | Required, valid email | Supabase Auth `auth.users.email` |
| **Password** | `password` input | Required, minimum 6 characters | Supabase Auth (hashed) |

> [!IMPORTANT]
> The role is **hardcoded to `"teacher"`** during self-registration. Only an admin can assign other roles (`admin`, `school_admin`) via the admin user management panel.

### 2.3 Registration Flow (Step by Step)

1. **User submits the Register form** with name, email, password.

2. **Frontend calls `supabase.auth.signUp()`** with:
   ```typescript
   {
     email: credentials.email,
     password: credentials.password,
     options: {
       data: {
         role: "teacher",                    // always teacher
         full_name: credentials.name,        // from the form
       }
     }
   }
   ```

3. **Supabase creates the auth user** in `auth.users`. This triggers the `on_auth_user_created` database trigger.

4. **Database trigger `handle_new_user()`** fires and creates a row in `public.profiles`:
   ```sql
   INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
   VALUES (
     NEW.id,
     COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
     NEW.email,
     COALESCE(NEW.raw_user_meta_data->>'role', 'teacher'),
     now(), now()
   ) ON CONFLICT (id) DO NOTHING;
   ```

5. **Frontend also calls the `createProfile` Edge Function** (with retry logic, up to 3 attempts) as a belt-and-suspenders approach:
   ```typescript
   await supabase.functions.invoke('createProfile', {
     body: {
       user: data.user,
       metadata: { full_name, role: "teacher", email }
     }
   });
   ```

6. **If the Edge Function fails after 3 retries**, a **direct fallback insert** is attempted:
   ```typescript
   await supabase.from('profiles').insert({
     id: data.user.id,
     full_name: credentials.name,
     role: "teacher",
     email: credentials.email,
     updated_at: new Date().toISOString()
   });
   ```

7. **User is redirected** to `/teacher/dashboard`.

### 2.4 Admin Login

Admins have a separate login page at `/admin` (`AdminAuth.tsx`). Same fields (email + password), but after authentication the system verifies the user's profile has `role === "admin"`. If not, the user is signed out and redirected to `/auth`.

### 2.5 Auth Callback & Password Recovery

| Route | Purpose |
|---|---|
| `/auth/callback` | Handles PKCE code exchange after email verification or password reset |
| `/auth/forgot-password` | Sends password reset email via Supabase |
| `/auth/update-password` | Displayed after password reset link is clicked; allows new password entry |

### 2.6 Session Management

- Sessions are managed by the **Supabase JS client** (`@supabase/supabase-js`).
- On app load, `useSupabaseAuth` calls `supabase.auth.getSession()` and subscribes to `onAuthStateChange`.
- Token refresh is handled silently on `TOKEN_REFRESHED` events.
- Logout performs a `global` scope sign-out, clears `localStorage` of all Supabase keys, and redirects to `/auth`.
- Admin session metadata is also stored in `localStorage` under `moodle_hub_admin`.

### 2.7 Protected Routes

All dashboard routes are wrapped in a `<ProtectedRoute>` component that checks `authState.isAuthenticated`. Unauthenticated users are redirected to `/auth`.

---

## 3. User Roles & Routing

### Roles

```typescript
type UserRole = 'teacher' | 'student' | 'admin' | 'school_admin';
```

| Role | How Assigned | Dashboard Route | Capabilities |
|---|---|---|---|
| `teacher` | Default on self-registration | `/teacher/dashboard` | View assigned schools, grading data, report cards |
| `admin` | Manually via admin panel | `/admin/dashboard` | Full system access, user CRUD, school management, grader assignments |
| `school_admin` | Manually via admin panel | `/school-admin/report-cards` | Report card access for their assigned schools |
| `student` | Defined but rarely used in this system | `/student/dashboard` | Course/grade viewing (Moodle-connected) |

### Post-Login Routing Logic

```typescript
if (role === 'school_admin') → "/school-admin/report-cards"
else if (role === 'admin')   → "/admin/dashboard"
else                          → "/teacher/dashboard"
```

---

## 4. Supabase Database Schema

### 4.1 `profiles` — Platform User Accounts

This is the *platform user* table (admins, teachers, school admins — **not** Moodle students).

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Matches `auth.users.id` |
| `full_name` | TEXT | From registration form or admin creation |
| `email` | TEXT | User's email address |
| `role` | TEXT | One of: `teacher`, `admin`, `school_admin` |
| `avatar_url` | TEXT | Optional profile picture URL |
| `accessible_schools` | TEXT[] | Array of school names this user can access |
| `created_at` | TIMESTAMPTZ | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last profile update |

**RLS**: Authenticated users can read all profiles; users can insert/update their own; service role has full access.

---

### 4.2 `schools` — Moodle Instance Configurations

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Internal school identifier |
| `slug` | TEXT (UNIQUE) | URL-friendly identifier (e.g., `cal`, `nord`) |
| `name` | TEXT | Display name (e.g., "Canadian Academy of Learning") |
| `moodle_url` | TEXT | Base URL of the Moodle instance |
| `moodle_token` | TEXT | Web Services API token (**sensitive**) |
| `is_active` | BOOLEAN | Whether sync should include this school |
| `category_exclude_ids` | INTEGER[] | Moodle category IDs to skip during sync |
| `last_synced_at` | TIMESTAMPTZ | Timestamp of last successful sync |
| `created_at` | TIMESTAMPTZ | Row creation time |

**RLS**: Only `service_role` can access this table (tokens are sensitive). A public view `schools_public` exposes safe columns only.

---

### 4.3 `enrolled_students` — Current Moodle Student Snapshot

| Column | Type | Description |
|---|---|---|
| `school_id` | UUID (FK → schools) | Which school |
| `moodle_user_id` | INTEGER | Moodle's internal user ID |
| `first_name` | TEXT | Student's first name from Moodle |
| `last_name` | TEXT | Student's last name from Moodle |
| `username` | TEXT | Moodle username |
| `email` | TEXT | Student email |
| `courses` | TEXT[] | Array of course shortnames the student is enrolled in |
| `last_access` | TIMESTAMPTZ | Last Moodle access timestamp |
| `synced_at` | TIMESTAMPTZ | When this row was last synced |

**Unique constraint**: `(school_id, moodle_user_id)` — upserted each sync cycle.

---

### 4.4 `ungraded_submissions` — Pending Grading Items

| Column | Type | Description |
|---|---|---|
| `school_id` | UUID (FK → schools) | Which school |
| `course_code` | TEXT | Course shortname |
| `student_first_name` | TEXT | Student's first name |
| `student_last_name` | TEXT | Student's last name |
| `student_username` | TEXT | Moodle username |
| `student_email` | TEXT | Student email |
| `assignment_name` | TEXT | Name of the assignment/quiz |
| `assignment_cmid` | INTEGER | Moodle course module ID |
| `activity_type` | TEXT | `assign`, `quiz`, or `exam` |
| `submitted_date` | TIMESTAMPTZ | When student submitted |
| `days_pending` | INTEGER | Days since submission |
| `direct_link` | TEXT | Direct URL to Moodle grading page |
| `synced_at` | TIMESTAMPTZ | Last sync timestamp |

**Unique constraint**: `(school_id, assignment_cmid, student_username)`

---

### 4.5 `student_profiles` — Persistent Student Records

Unlike `enrolled_students` (a snapshot), student profiles **survive sync cycles**. Students removed from Moodle get `is_active = false` but their data remains.

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Internal student profile ID |
| `school_id` | UUID (FK → schools) | Which school |
| `moodle_user_id` | INTEGER | Moodle user ID |
| `first_name`, `last_name` | TEXT | Student names |
| `username`, `email` | TEXT | Moodle credentials |
| `first_seen_at` | TIMESTAMPTZ | When first discovered |
| `last_seen_at` | TIMESTAMPTZ | When last found in sync |
| `last_access` | TIMESTAMPTZ | Last Moodle access |
| `is_active` | BOOLEAN | Currently enrolled? |

**Unique constraint**: `(school_id, moodle_user_id)`

---

### 4.6 `student_enrollments` — Per-Course Enrollment Records

| Column | Type | Description |
|---|---|---|
| `student_profile_id` | UUID (FK → student_profiles) | Which student |
| `school_id` | UUID (FK → schools) | Which school |
| `course_code` | TEXT | Course shortname |
| `first_enrolled_at` | TIMESTAMPTZ | Initial enrollment date |
| `last_course_access` | TIMESTAMPTZ | Last course access |
| `is_active` | BOOLEAN | Currently enrolled? |

**Unique constraint**: `(student_profile_id, school_id, course_code)`

---

### 4.7 `student_submissions` — Full Submission Records

| Column | Type | Description |
|---|---|---|
| `student_profile_id` | UUID (FK → student_profiles) | Which student |
| `school_id` | UUID (FK → schools) | Which school |
| `course_code` | TEXT | Course shortname |
| `assignment_name` | TEXT | Activity name |
| `assignment_cmid` | INTEGER | Moodle course module ID |
| `activity_type` | TEXT | `assign`, `quiz`, or `exam` |
| `submitted_at` | TIMESTAMPTZ | Submission timestamp |
| `status` | TEXT | `submitted`, `draft`, `graded`, etc. |
| `grade_raw` | NUMERIC | Raw numeric grade |
| `grade_max` | NUMERIC | Maximum possible grade |
| `grade_formatted` | TEXT | Display-formatted grade string |
| `graded_at` | TIMESTAMPTZ | When graded (from Moodle or fallback to sync time) |
| `is_graded` | BOOLEAN | Whether a grade has been assigned |

**Unique constraint**: `(student_profile_id, school_id, assignment_cmid)`

---

### 4.8 Metrics Tables

#### `school_daily_metrics` — School-level daily snapshot

| Column | Type |
|---|---|
| `school_id` | UUID |
| `metric_date` | DATE |
| `total_students` | INTEGER |
| `total_ungraded` | INTEGER |
| `total_courses` | INTEGER |
| `ungraded_assignments` | INTEGER |
| `ungraded_quizzes` | INTEGER |
| `ungraded_exams` | INTEGER |
| `avg_days_pending` | NUMERIC(10,2) |

#### `course_daily_metrics` — Course-level daily snapshot

| Column | Type |
|---|---|
| `school_id` | UUID |
| `course_code` | TEXT |
| `metric_date` | DATE |
| `ungraded_count` | INTEGER |
| `ungraded_assignments` | INTEGER |
| `ungraded_quizzes` | INTEGER |
| `ungraded_exams` | INTEGER |
| `graded_activity_count` | INTEGER |

---

### 4.9 Grader Tables

#### `school_courses` — Canonical course list per school

| Column | Type | Description |
|---|---|---|
| `school_id` | UUID | FK → schools |
| `course_code` | TEXT | Moodle shortname |
| `course_fullname` | TEXT | Full display name |
| `moodle_course_id` | INTEGER | Moodle internal ID |
| `graded_activity_count` | INTEGER | Number of AOL activities |

#### `grader_course_assignments` — Teacher assigned to grade a course

| Column | Type | Description |
|---|---|---|
| `school_id` | UUID | FK → schools |
| `grader_id` | UUID | FK → profiles |
| `course_code` | TEXT | Which course |
| `assigned_at` | TIMESTAMPTZ | When assigned |
| `assigned_by` | UUID | FK → profiles (admin who assigned) |

#### `grader_daily_activity` — Daily grading productivity

| Column | Type | Description |
|---|---|---|
| `school_id` | UUID | FK → schools |
| `grader_id` | UUID | FK → profiles |
| `course_code` | TEXT | Which course |
| `metric_date` | DATE | Activity date (Eastern Time) |
| `ungraded_today` | INTEGER | Ungraded count at sync time |
| `items_graded` | INTEGER | Total items graded on this date |
| `graded_assignments` | INTEGER | Assignments graded |
| `graded_quizzes` | INTEGER | Quizzes graded |
| `graded_exams` | INTEGER | Exams graded |

#### `course_activities` — Tracked activities per course

| Column | Type | Description |
|---|---|---|
| `school_id` | UUID | FK → schools |
| `course_code` | TEXT | Course shortname |
| `assignment_cmid` | INTEGER | Moodle course module ID |
| `assignment_name` | TEXT | Activity name |
| `activity_type` | TEXT | `assign`, `quiz`, `exam` |
| `modname` | TEXT | Moodle module type (`assign` or `quiz`) |
| `is_graded_activity` | BOOLEAN | Whether this is an AOL (Assessment of Learning) |

---

### 4.10 Other Tables

| Table | Purpose |
|---|---|
| `sync_errors` | Logs errors/warnings from sync jobs (type, severity, message, details) |
| `email_log` | Tracks sent grader performance emails |
| `report_cards` | Student report card data with grades and comments |

---

## 5. Moodle Integration

### 5.1 Connection Method

The system connects to each school's Moodle instance via the **Moodle Web Services REST API**.

```
Endpoint pattern: https://{moodle_url}/webservice/rest/server.php
Authentication:   wstoken={moodle_token}
Response format:  moodlewsrestformat=json
HTTP method:      GET (via query string) or POST (via URLSearchParams)
```

Each school stores its own `moodle_url` and `moodle_token` in the `schools` table. Tokens are generated within Moodle's admin panel for a service user with appropriate capabilities.

### 5.2 MoodleClient Class

Located at `supabase/functions/_shared/moodle-client.ts` (for edge functions) and `scripts/lib/moodle-client.ts` (for CLI scripts).

```typescript
class MoodleClient {
  constructor(baseUrl: string, token: string, delayMs = 50)
  
  // Core API calls
  getCourses(): Promise<MoodleCourse[]>
  getEnrolledUsers(courseId: number): Promise<MoodleEnrolledUser[]>
  getAssignments(courseIds: number[]): Promise<{courses: [{assignments}]}>
  getSubmissions(assignmentIds: number[]): Promise<{assignments: [{submissions}]}>
  getGradeItems(courseId: number, userId?: number): Promise<MoodleGradesResponse>
  getCourseContents(courseId: number): Promise<any[]>
  getAssignmentGrades(assignmentIds: number[]): Promise<{assignments: [{grades}]}>
  getQuizAttempts(quizId: number, userId?: number): Promise<{attempts}>
}
```

**Key characteristics**:
- Built-in rate limiting via configurable `delayMs` between calls
- Automatic retry (1 retry) on network failures
- 30-second timeout per request via `AbortController`
- Array parameters encoded as `param[0]=val0&param[1]=val1`

### 5.3 Moodle Web Service Functions Used

| WS Function | Purpose |
|---|---|
| `core_course_get_courses` | Fetch all courses |
| `core_enrol_get_enrolled_users` | Get students in a course (filtered by `student` role) |
| `core_course_get_contents` | Get course sections/modules (to discover assignments and quizzes) |
| `mod_assign_get_assignments` | Get assignment metadata (grade config, submission settings) |
| `mod_assign_get_submissions` | Get student submissions per assignment |
| `mod_assign_get_grades` | Get assignment grades (to determine graded status) |
| `gradereport_user_get_grade_items` | Get grade report items per user per course |
| `mod_quiz_get_quizzes_by_courses` | List quizzes in courses |
| `mod_quiz_get_user_attempts` | Get quiz attempts (to find ungraded finished quizzes) |
| `core_user_get_users` | Fetch all manually-created users |
| `core_enrol_get_users_courses` | Get courses a user is enrolled in |
| `gradereport_overview_get_course_grades` | Course-level grade overview |
| `core_grades_get_grades` | Activity-specific grades |
| `mod_assign_get_submission_status` | Detailed submission status |
| `mod_assign_get_user_flags` | Extensions, workflow states |

### 5.4 Frontend vs Backend Moodle Clients

| Aspect | Frontend (`src/services/moodleApi.ts`) | Backend (`scripts/lib/moodle-client.ts`) |
|---|---|---|
| **Runtime** | Browser | Node.js / Deno |
| **HTTP** | Axios POST | Native `fetch` GET |
| **Credentials** | `localStorage` (manual entry) | Supabase `schools` table |
| **Usage** | Admin Moodle config page, course browsing | Automated sync pipeline |
| **Rate limiting** | None | 10–50ms delay between calls |

---

## 6. Data Synchronization Pipeline

### 6.1 Overview

The sync process pulls data from each school's Moodle instance and writes it to Supabase. It runs **twice daily** at **9:00 AM EST** and **9:00 PM EST**.

### 6.2 Execution Methods

| Method | Entry Point | Environment |
|---|---|---|
| **CLI Script** | `npx tsx scripts/sync-school-data.ts [--school <slug>]` | Local/CI |
| **Edge Function** | `POST /functions/v1/sync-school` | Supabase (production) |
| **pg_cron** | Scheduled in Supabase SQL migrations | Automatic (production) |
| **node-cron** | `npx tsx scripts/scheduler.ts` | Local dev |

### 6.3 Sync Steps (14-step process)

For **each active school**:

```
Step  1: Fetch all courses from Moodle (exclude site course ID=1, category exclusions)
Step  2: For each course:
         - Fetch enrolled students (student role only)
         - Fetch course contents → extract assign & quiz modules
         - Filter to gradable assignments (grade ≠ 0, submissions enabled)
         - Fetch submissions, assignment grades, and grade report in parallel
         - Identify ungraded items (submitted but not in graded set)
         - Verify ungraded quizzes via attempt checking (batch of 10)
         - Classify activities (assign/quiz/exam) and filter exclusions
Step  3: Upsert enrolled_students → cleanup stale records
Step  4: Upsert ungraded_submissions → cleanup stale records
Step  5: Update schools.last_synced_at
Step  6: Upsert school_daily_metrics (date uses Eastern Time)
Step  7: Upsert school_courses with graded_activity_count
Step  8: Upsert course_activities → cleanup stale records
Step  9: Upsert course_daily_metrics
Step 10: (reserved for report card sync)
Step 11: Upsert student_profiles (mark all inactive first, then re-activate found students)
Step 12: Upsert student_enrollments (mark all inactive first, then re-activate found enrollments)
Step 13: Upsert student_submissions (with graded_at fallback for transition detection)
Step 14: Compute and upsert grader_daily_activity (submission-level grading tracking)
```

### 6.4 Safeguard Mechanisms

The sync includes safeguards to prevent data loss from partial sync failures:

| Safeguard | Condition | Action |
|---|---|---|
| **Student count threshold** | New sync finds < 50% of existing students (script) or < 20% (edge function) | Skip stale record cleanup, log to `sync_errors` |
| **Batch failure tracking** | Any upsert batch fails | Skip corresponding cleanup step |
| **Ancient submission filter** | Ungraded items > 365 days old | Excluded from counts to prevent inflation |
| **Student profile deactivation threshold** | New sync finds < 20% of active profiles | Skip bulk deactivation |

### 6.5 Batch Processing

All upserts are batched in groups of **500 rows** to avoid Supabase request size limits.

### 6.6 Concurrency

The Edge Function version processes courses with **8 concurrent workers** using a shared queue pattern. The CLI script processes courses sequentially.

---

## 7. Activity Classification Rules

Defined in `supabase/functions/_shared/activity-rules.ts`:

### Activity Type Classification

```typescript
function classifyActivityType(modname: string, name: string): ActivityType {
  if (/\bexams?\b|\bculminating\b|\bfinal\b/i.test(name)) return "exam";
  if (/\btests?\b|\bquiz(?:zes)?\b/i.test(name))          return "quiz";
  if (/\bassignments?\b|\blab\b|\bteach\s+the\s+teacher\b/i.test(name)) return "assign";
  return modname; // fallback to Moodle module type
}
```

### Graded Activity Detection (AOL = Assessment of Learning)

```typescript
function isGradedActivity(name: string): boolean {
  return /\bAOL\b|\bTest\b|\bAssignment\b|\bQuiz\b|\bFinal\b|\bCulminating\b|\bTeach\s+the\s+Teacher\b/i.test(name);
}
```

### Exclusion Rules (non-gradable activities skipped during sync)

| Pattern | Example |
|---|---|
| `(AFL)` | Assessment For Learning — formative |
| `(AAL)` | Assessment As Learning — self-assessment |
| `KWL` | Know/Want/Learned charts |
| `Exit Card` | Exit tickets |
| `Learning Log` | Reflective journals |
| `Reflection Summary` | Reflective summaries |
| `Lesson N` / `U1L1` | Individual lesson activities |
| `Course Outline` | Syllabus documents |
| `Homework Binder` | Reference materials |

> [!NOTE]
> `(AOL)` is explicitly **not** excluded — these are the Assessment of Learning items that ARE graded.

---

## 8. Grader Tracking & Productivity

### How Grading Attribution Works

1. **Admin assigns graders** to courses via the `grader_course_assignments` table (one grader per course per school).

2. **During sync** (Step 14), the system queries `student_submissions` for items graded today (by `graded_at` date).

3. **Counts are aggregated** per course and written to `grader_daily_activity`:
   - `items_graded` = total submissions graded today for this course
   - `graded_assignments`, `graded_quizzes`, `graded_exams` = breakdown by activity type
   - `ungraded_today` = current ungraded count for this course

4. **RPC `get_grader_activity_summary`** computes rollup stats: total items graded, avg daily graded, days active.

### Graded-At Fallback Logic

Moodle doesn't always provide `gradedategraded`. The sync uses a transition detection system:

```
If newly graded (is_graded=true, no graded_at):
  - Check if previously ungraded in DB → use sync timestamp as graded_at
  - Check if already graded in DB with timestamp → preserve existing
  - Otherwise → use sync timestamp
```

---

## 9. Student Profile Lifecycle

```
┌────────────────────────────────────────────────────────────────────┐
│                      SYNC CYCLE                                    │
│                                                                    │
│  1. Mark ALL existing profiles as is_active = false                │
│  2. Fetch enrolled students from Moodle                            │
│  3. Upsert profiles (ON CONFLICT: school_id, moodle_user_id)      │
│     → Sets is_active = true for found students                     │
│     → first_seen_at preserved on conflict                          │
│     → last_seen_at updated to now()                                │
│  4. Students not found in Moodle remain is_active = false          │
│     → Their historical data (submissions, grades) is PRESERVED     │
└────────────────────────────────────────────────────────────────────┘
```

### Course Completion Computation

The frontend computes course completion via `computeCourseCompletion()` in `studentApi.ts`:

- **Inputs**: `course_activities`, `student_submissions`, `student_enrollments`
- **Metrics per course**:
  - `gradedActivityCount` — number of AOL activities
  - `submittedCount` — submitted but not yet graded
  - `gradedCount` — graded
  - `completionPercent` — `(graded + submitted) / gradedActivityCount × 100`
  - `hasCulminating` / `culminatingSubmitted` / `culminatingGraded` — final exam tracking
  - `isComplete` — true if culminating is submitted

---

## 10. Edge Functions

Located in `supabase/functions/`:

### `createProfile`

- **Trigger**: Called during user registration
- **Input**: `{ user, metadata: { full_name, role, email } }`
- **Action**: Inserts a row into `profiles` with `role = 'teacher'` (hardcoded)
- **Auth**: Requires `Authorization` header (user's JWT)
- **Uses**: Supabase Admin client (service role key)

### `manage-user`

- **Trigger**: Called from admin user management panel
- **Auth**: Verifies caller has `admin` role
- **Actions**:

| Action | Fields | Description |
|---|---|---|
| `create` | `email, password, full_name, role` | Creates auth user + profile via `admin.createUser()` (skips email confirmation) |
| `update` | `userId, updates` | Updates profile fields (full_name, role, accessible_schools) |
| `delete` | `userId` | Deletes profile row then auth user (prevents self-deletion) |

- **Grader sync**: When `accessible_schools` changes, automatically removes grader course assignments for removed schools.

### `sync-school`

- **Trigger**: pg_cron schedule or manual invocation
- **Auth**: Requires `x-sync-secret` header or service role key
- **Action**: Full school data sync (same logic as `scripts/sync-school-data.ts`)
- **Concurrency**: 8 parallel course workers
- **Batch support**: `course_limit` and `course_offset` parameters for large schools

### `send-grader-emails`

- **Trigger**: Daily at 10 AM EST via pg_cron
- **Action**: Sends grader performance summary emails
- **Auth**: Requires `x-sync-secret` header

### `send-invitation`

- **Trigger**: Admin panel "invite user" action
- **Action**: Sends invitation email to new teacher

### `verify-sync`

- **Trigger**: After sync completion
- **Action**: Verifies data consistency and logs errors

---

## 11. Scheduler & Cron Configuration

### Production (Supabase pg_cron)

Configured in SQL migrations. The cron jobs call the Supabase Edge Functions via HTTP:

```sql
-- Data sync: twice daily at 9 AM and 9 PM EST
-- 14:00 UTC = 9:00 AM EST
-- 02:00 UTC = 9:00 PM EST
SELECT cron.schedule('sync-school-morning', '0 14 * * *', ...);
SELECT cron.schedule('sync-school-evening', '0 2 * * *', ...);

-- Grader emails: daily at 10 AM EST = 15:00 UTC
SELECT cron.schedule('send-grader-emails', '0 15 * * *', ...);
```

### Development (node-cron)

```typescript
// scripts/scheduler.ts
const SYNC_CRON  = '0 2,14 * * *';  // 02:00 & 14:00 UTC
const EMAIL_CRON = '0 15 * * *';    // 15:00 UTC

cron.schedule(SYNC_CRON, () => {
  execSync('npx tsx scripts/sync-cal-data.ts');
  execSync('npx tsx scripts/sync-nord-data.ts');
});

cron.schedule(EMAIL_CRON, async () => {
  await fetch(`${SUPABASE_URL}/functions/v1/send-grader-emails`, {...});
});
```

### Manual Sync

```bash
# Sync all active schools
npx tsx scripts/sync-school-data.ts

# Sync a specific school
npx tsx scripts/sync-school-data.ts --school cal

# With local JSON output
npx tsx scripts/sync-school-data.ts --school cal --local
```

---

## 12. Environment Variables

| Variable | Where Used | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend + scripts | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Scripts + edge functions | Admin-level Supabase access |
| `SYNC_SECRET` | Edge functions | Shared secret for sync/email cron auth |

> [!CAUTION]
> The `moodle_token` values are stored per-school in the `schools` table and are never exposed to the frontend. Only the service role can read the `schools` table directly.

---

## Summary: How Everything Fits Together

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────┐
│  User registers │────▶│  Supabase Auth       │────▶│  profiles     │
│  via /auth form │     │  (auth.users)        │     │  table        │
│                 │     │  + createProfile EF  │     │  (role-based) │
│                 │     │  + handle_new_user() │     │               │
└─────────────────┘     └─────────────────────┘     └──────┬───────┘
                                                           │
                                                    role-based
                                                    redirect
                                                           │
                         ┌─────────────────────────────────┼───────────────┐
                         ▼                                 ▼               ▼
                   /admin/dashboard            /teacher/dashboard   /school-admin/*
                   (full system access)        (assigned schools)   (report cards)
                         │
                         ▼
           ┌──────────────────────────┐
           │  Admin creates schools   │─── schools table ───┐
           │  + assigns graders       │                      │
           │  + manages users         │                      │
           └──────────────────────────┘                      │
                                                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    AUTOMATED DATA SYNC (2× daily)                    │
│                                                                      │
│   pg_cron / scheduler.ts                                             │
│       │                                                              │
│       ▼                                                              │
│   sync-school edge function / sync-school-data.ts                    │
│       │                                                              │
│       ├── Read schools from Supabase (moodle_url, moodle_token)      │
│       ├── For each school:                                           │
│       │   ├── MoodleClient.getCourses()                              │
│       │   ├── MoodleClient.getEnrolledUsers(courseId)                 │
│       │   ├── MoodleClient.getCourseContents(courseId)                │
│       │   ├── MoodleClient.getAssignments(courseIds)                  │
│       │   ├── MoodleClient.getSubmissions(assignmentIds)              │
│       │   ├── MoodleClient.getAssignmentGrades(assignmentIds)        │
│       │   ├── MoodleClient.getGradeItems(courseId)                   │
│       │   └── MoodleClient.getQuizAttempts(quizId, userId)           │
│       │                                                              │
│       ├── Classify activities (assign/quiz/exam)                     │
│       ├── Filter exclusions (AFL, AAL, Lessons, etc.)                │
│       │                                                              │
│       └── Write to Supabase:                                         │
│           ├── enrolled_students                                      │
│           ├── ungraded_submissions                                   │
│           ├── student_profiles                                       │
│           ├── student_enrollments                                    │
│           ├── student_submissions                                    │
│           ├── school_daily_metrics                                   │
│           ├── course_daily_metrics                                   │
│           ├── school_courses                                         │
│           ├── course_activities                                      │
│           └── grader_daily_activity                                  │
└──────────────────────────────────────────────────────────────────────┘
```
