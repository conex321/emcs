# Project Notes — EMCS

**Last updated:** 2026-04-19T00:33:32Z
**Last agent:** Codex
**Session summary:** Generic student-document upload remains live on the backend and passed another full local browser proof against the real Supabase project. Codex re-verified the full parent checkout -> document upload -> admin approval/account creation -> student login workflow, confirmed build health and public-route dead-link health, and cleaned all disposable test data back out.

## Current State
- Production frontend is deployed on Vercel project `emcs` and serving `https://www.canadaemcs.com` and `https://www.canadaemcs.com/admin/dashboard`.
- SPA rewrites are handled by `/Users/matthews/EMCS/vercel.json`, so direct route loads for `/auth`, `/cart`, `/portal/*`, and `/admin/dashboard` return the app shell instead of Vercel `404`.
- Frontend auth, checkout, and portal data all depend on `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Production Vercel env vars were configured in the dashboard; local `.env` contains those variable names.
- Supabase project ref is `gbclamtkotqcdcgveget`. Migrations through `013` are applied in the live Supabase project.
- Free and 100%-discounted checkout is working in production. Verified flow: account creation or sign-in, cart/checkout, `process-payment`, `enroll-student`, confirmation page, parent portal, student portal, receipt email, registration email, and admin notification.
- Repo-side checkout now supports supporting-document upload for student registration. The backend pieces are live in Supabase (`public.student_documents`, private Storage bucket `student-documents`, and `upload-student-document`), and a full local browser proof against the live backend passed: parent checkout upload -> `student_documents` rows -> storage objects -> linked `student_id` -> admin document visibility -> student portal visibility.
- A second local verification pass on 2026-04-19 also passed end-to-end against the live Supabase backend using `/Users/matthews/EMCS/scripts/document-workflow-check.mjs`: disposable coupon + parent checkout, two uploaded proof files, parent portal, school-admin document review, student approval, student portal account creation, registration email trigger, student login, and cleanup.
- Local public-route smoke verification also passed on 2026-04-19 for `/`, `/courses`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/auth`, `/cart`, and `/official-ontario/course/ENG1D`; each route loaded without browser errors and without placeholder `a[href="#"]` links.
- The new document-upload UI, legal pages, and footer/contact dead-link cleanup are currently in the local worktree only. They are not yet deployed to Vercel production until the next frontend push.
- Paid card checkout is still intentionally blocked because Stripe is not configured end-to-end. The frontend shows the pending Stripe state instead of performing a real charge.
- Moodle is still not configured end-to-end. Registration emails generate and store Moodle-style credentials in `students.moodle_username` and `students.moodle_password`, but no real Moodle account is created and `students.moodle_user_id` remains `null` until Moodle integration is finished.
- Student portal, parent portal, and agent portal are live dashboards backed by Supabase tables. They are no longer placeholder pages.
- Admin dashboard is live at `/admin/dashboard` and was production-tested with a disposable `school_admin` login. Verified actions: view registration, view report-card metadata, approve student, create student portal account, send registration email, and confirm student login.
- `/admin` itself is not yet deployed as a redirect. Local worktree has an unreleased patch in `/Users/matthews/EMCS/src/App.jsx` that redirects `/admin` to `/admin/dashboard`. Current production behavior for `/admin` still falls through to the public site.
- `createProfile` still returns `UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM` in browser-triggered signup calls even after redeploy. This is non-blocking because the `on_auth_user_created` DB trigger continues to create the `profiles` row correctly.
- `school_admin` currently has platform-wide access because the schema has no school-scoping relationship on `profiles`, `students`, `orders`, or `report_cards`. Migration `012` enables the role, but it does not limit records by school.
- Current local worktree status after this session includes unreleased frontend changes in `/Users/matthews/EMCS/src/App.jsx`, `/Users/matthews/EMCS/src/pages/Checkout.jsx`, `/Users/matthews/EMCS/src/components/Footer.jsx`, `/Users/matthews/EMCS/src/pages/Contact.jsx`, `/Users/matthews/EMCS/src/pages/admin/AdminDashboard.jsx`, `/Users/matthews/EMCS/src/pages/portals/StudentPortal.jsx`, plus new files for legal pages, document upload backend, migration `013`, and `/Users/matthews/EMCS/scripts/document-workflow-check.mjs`. Unrelated untracked files still exist at `/Users/matthews/EMCS/emcs-brand-marketing.json`, `/Users/matthews/EMCS/emcs-complete-site-data.json`, and `/Users/matthews/EMCS/extract-site-data.mjs`.

## Architecture & Key Decisions

### 2026-04-18 — Supabase is the source of truth for storefront, portals, and operations
**Decided:** Use Supabase Auth, Postgres, RLS, and Edge Functions as the live system of record for users, orders, students, enrollments, email logs, report-card metadata, and admin actions.

**Why:** The repo already had a Supabase backend shape, and the fastest path to a production-capable proof was to wire the React app to the real tables instead of layering a parallel API.

**Alternatives considered:** Keep using hardcoded/mock storefront data or client-only coupon logic. Rejected because it produced UI behavior that diverged from the real backend and broke checkout verification.

### 2026-04-18 — Free checkout must work before Stripe is finished
**Decided:** Treat free and 100%-discounted orders as the supported end-to-end path. For paid card orders, surface a clear “Stripe not configured” state instead of pretending success.

**Why:** Stripe keys, webhook secret, and frontend confirmation flow were incomplete. Shipping a fake success path would hide real failures and create bad orders.

**Alternatives considered:** Block checkout entirely until Stripe was finished. Rejected because free orders were already sufficient to validate auth, order creation, enrollment creation, portals, and emails.

### 2026-04-18 — Edge Functions with user auth should bypass the legacy edge JWT gate
**Decided:** Set `verify_jwt = false` for user-triggered Supabase functions in `/Users/matthews/EMCS/supabase/config.toml` and enforce authorization inside each function instead.

**Why:** Production auth tokens were ES256, and the legacy edge JWT gate was returning `UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM` before business logic ran.

**Alternatives considered:** Leave `verify_jwt = true` and rely on the platform gate. Rejected after real production failures on `createProfile` and `enroll-student`.

### 2026-04-18 — Admin operations belong in a first-party dashboard, not ad hoc scripts
**Decided:** Add `/admin/dashboard` as a protected React route backed by Supabase reads plus `manage-user` actions for account creation, approval, and registration email dispatch.

**Why:** Auth already redirected `admin` and `school_admin` users to `/admin/dashboard`, but the route did not exist. The missing UI created a dead-end for operational workflows.

**Alternatives considered:** Keep using direct SQL and manual API calls. Rejected because it was not usable by the school team and was not production-proof.

### 2026-04-18 — “Documents” currently means `report_cards` metadata only
**Decided:** The admin dashboard’s Documents tab reads `public.report_cards` and explicitly warns that generic registration-document uploads do not exist yet.

**Why:** The schema has `report_cards`, `email_log`, `audit_log`, `student_submissions`, and other operational tables, but no general application-documents table.

**Alternatives considered:** Invent a placeholder document model in the UI. Rejected because it would misrepresent backend capability.

### 2026-04-18 — Keep production route handling in repo, not only in the Vercel dashboard
**Decided:** Commit SPA route rewrites to `/Users/matthews/EMCS/vercel.json`.

**Why:** Direct route loads were returning Vercel `404 NOT_FOUND` until rewrites were defined. Keeping rewrites in repo prevents dashboard-only drift.

**Alternatives considered:** Rely on manual Vercel dashboard config. Rejected because it is easy to lose on the next Git-triggered deploy.

### 2026-04-18 — Registration proofs belong in a dedicated table plus Storage bucket
**Decided:** Add `public.student_documents` plus a private Supabase Storage bucket `student-documents`, and upload files through a dedicated `upload-student-document` edge function before enrollment linking.

**Why:** The earlier admin proof showed that only `report_cards` metadata existed. The user needed actual proof-document upload on the checkout form, persistence in Supabase, and visibility in admin/student workflows.

**Alternatives considered:** Reuse `report_cards` for admissions documents or keep document data out of Supabase until a later backend pass. Rejected because `report_cards` is semantically wrong for admissions proofs, and delaying persistence would keep the workflow unverifiable.

## File & Directory Map
- `/Users/matthews/EMCS/src/App.jsx` — top-level route table for public pages, storefront, portals, and admin dashboard; currently also holds the unreleased `/admin` redirect patch.
- `/Users/matthews/EMCS/src/context/AuthContext.jsx` — auth bootstrap, profile loading, sign-in/sign-up helpers, and role-based redirects.
- `/Users/matthews/EMCS/src/components/ProtectedRoute.jsx` — route guard for auth and role enforcement.
- `/Users/matthews/EMCS/src/services/supabaseClient.js` — browser Supabase client; warns when `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing.
- `/Users/matthews/EMCS/src/context/CartContext.jsx` — cart persistence, coupon lookup, and cart state management.
- `/Users/matthews/EMCS/src/pages/Cart.jsx` — cart UI and coupon-application flow.
- `/Users/matthews/EMCS/src/pages/Checkout.jsx` — multi-step checkout, account creation during checkout, free-order flow, and `process-payment`/`enroll-student` calls.
- `/Users/matthews/EMCS/src/pages/LegalPage.jsx` and `/Users/matthews/EMCS/src/pages/LegalPage.css` — local-only privacy/terms pages used to replace dead footer legal links.
- `/Users/matthews/EMCS/src/services/portalData.js` — shared data normalizers for orders, courses, and enrollments used across portal pages.
- `/Users/matthews/EMCS/src/pages/portals/StudentPortal.jsx` — student-facing course and progress dashboard; parents can also view child data here.
- `/Users/matthews/EMCS/src/pages/portals/ParentPortal.jsx` — parent-facing children, enrollment, and order history dashboard.
- `/Users/matthews/EMCS/src/pages/portals/AgentPortal.jsx` — referral, commission, and partner stats dashboard.
- `/Users/matthews/EMCS/src/pages/admin/AdminDashboard.jsx` — admin and `school_admin` dashboard for registrations, documents, account creation, email activity, and audit history.
- `/Users/matthews/EMCS/src/pages/portals/PortalPages.css` — shared portal styling plus admin dashboard layout/styles.
- `/Users/matthews/EMCS/supabase/config.toml` — Supabase function config; `createProfile`, `process-payment`, `enroll-student`, `manage-user`, `webhook-stripe`, and `sync-school` all have `verify_jwt = false`.
- `/Users/matthews/EMCS/supabase/functions/process-payment/index.ts` — creates orders/order_items and applies coupon/payment logic.
- `/Users/matthews/EMCS/supabase/functions/upload-student-document/index.ts` — receives multipart proof-document uploads, stores file bytes in Supabase Storage, and inserts `student_documents` metadata rows.
- `/Users/matthews/EMCS/supabase/functions/enroll-student/index.ts` — creates students and enrollments, links order items, and triggers post-purchase email functions.
- `/Users/matthews/EMCS/supabase/functions/manage-user/index.ts` — admin-only CRUD plus `approve_student` and `send_registration_email`.
- `/Users/matthews/EMCS/supabase/functions/send-registration-email/index.ts` — sends student/parent registration email and admin notification; generates Moodle-style credentials when missing.
- `/Users/matthews/EMCS/supabase/migrations/010_portal_access_policies.sql` — portal read access policies for student and agent views.
- `/Users/matthews/EMCS/supabase/migrations/011_coupon_validation_access.sql` — anon access to active coupons for browser-side coupon validation.
- `/Users/matthews/EMCS/supabase/migrations/012_school_admin_dashboard_access.sql` — enables `school_admin` access to admin dashboard tables.
- `/Users/matthews/EMCS/supabase/migrations/013_student_documents.sql` — creates `student_documents`, related RLS policies, and the private `student-documents` Storage bucket.
- `/Users/matthews/EMCS/scripts/document-workflow-check.mjs` — reusable Playwright + Supabase proof script for local browser verification against the live Supabase backend.
- `/Users/matthews/EMCS/vercel.json` — SPA rewrite config for Vercel.
- `/Users/matthews/EMCS/.vercel/project.json` — local Vercel project link; `projectName` is `emcs`.
- `/Users/matthews/EMCS/Project_notes_folder/PROJECT_NOTES.md` — shared project memory for Claude and Codex.
- `/Users/matthews/EMCS/.claude/skills/update-project-notes/SKILL.md` — Claude-facing skill for maintaining this notes file.
- `/Users/matthews/EMCS/.codex/skills/update-project-notes/SKILL.md` — Codex-facing skill for maintaining this notes file.

## Accomplishments Log

### Session on 2026-04-18 — Portal and auth plumbing
- Replaced portal placeholders with real Supabase-backed dashboards in `/Users/matthews/EMCS/src/pages/portals/StudentPortal.jsx`, `/Users/matthews/EMCS/src/pages/portals/ParentPortal.jsx`, and `/Users/matthews/EMCS/src/pages/portals/AgentPortal.jsx`; this made live user data visible in the browser.
- Added shared normalizers in `/Users/matthews/EMCS/src/services/portalData.js`; this removed repeated field-mapping bugs between `code` vs `course_code`, `grade` vs `grade_level`, and `progress_pct` vs `progress`.
- Stabilized auth bootstrap and role redirects in `/Users/matthews/EMCS/src/context/AuthContext.jsx` and `/Users/matthews/EMCS/src/components/ProtectedRoute.jsx`; this fixed portal reload hangs and bad portal redirects.
- Added portal read policies in `/Users/matthews/EMCS/supabase/migrations/010_portal_access_policies.sql`; this allowed student and agent portal queries to work against live RLS.

### Session on 2026-04-18 — Checkout and coupon hardening
- Fixed cart persistence and coupon validation so the browser flow matched backend behavior in `/Users/matthews/EMCS/src/context/CartContext.jsx`, `/Users/matthews/EMCS/src/pages/Cart.jsx`, and `/Users/matthews/EMCS/supabase/migrations/011_coupon_validation_access.sql`.
- Filled in the missing checkout review step and corrected signed-in detail hydration in `/Users/matthews/EMCS/src/pages/Checkout.jsx`; this removed the blank Step 1 and the disabled-empty email bug.
- Updated `/Users/matthews/EMCS/supabase/functions/enroll-student/index.ts` to verify order ownership, attach parent linkage, fail loudly when enrollments are not created, and trigger receipt/registration emails for free orders.
- Added `/Users/matthews/EMCS/supabase/config.toml` with `verify_jwt = false` for affected functions after production ES256 token failures.
- Removed plaintext password leakage into `orders.parent_details` in `/Users/matthews/EMCS/src/pages/Checkout.jsx` and scrubbed the retained production test order that had already captured a password.

### Session on 2026-04-18 — Deployment and production proof
- Added `/Users/matthews/EMCS/vercel.json` and confirmed Vercel dashboard env vars for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; this fixed direct SPA route loads and missing-Supabase frontend failures in production.
- Production-tested a real free-order flow on `https://www.canadaemcs.com` using a disposable coupon and disposable parent account. Verified `profiles`, `orders`, `order_items`, `students`, `enrollments`, and `email_log` rows, then cleaned them up.
- Confirmed that `process-payment`, `enroll-student`, `createProfile`, `webhook-stripe`, `send-registration-email`, `send-purchase-receipt`, and related email functions were deployed. Confirmed `manage-user` and `sync-school` status later during admin work.

### Session on 2026-04-18 — Admin dashboard and school-admin support
- Added `/Users/matthews/EMCS/src/pages/admin/AdminDashboard.jsx` and wired `/Users/matthews/EMCS/src/App.jsx` to serve `/admin/dashboard` for `admin` and `school_admin`.
- Extended `/Users/matthews/EMCS/supabase/functions/manage-user/index.ts` with `school_admin` authorization, `approve_student`, and `send_registration_email`.
- Added `/Users/matthews/EMCS/supabase/migrations/012_school_admin_dashboard_access.sql` so `school_admin` can query admin tables through RLS.
- Production-tested the deployed admin workflow on `https://www.canadaemcs.com/admin/dashboard` with a disposable `school_admin` account. Verified live actions and confirmed `audit_log` entries for `student.approve`, `user.create`, and `student.registration_email.send`, then cleaned up all disposable rows.
- Patched `/Users/matthews/EMCS/src/App.jsx` locally to redirect `/admin` to `/admin/dashboard`. This patch is built locally but was not yet deployed at the time of these notes.

### Session on 2026-04-18 — Deploy audit, migration push, and function redeploy
- Audited deploy drift: migrations `010` and `011` present locally but absent from remote; `enroll-student` code modified locally but remote still on v2; `manage-user` and `sync-school` never deployed to remote.
- Pushed migrations `010`, `011`, and later `012` via `supabase db push` (user-approved interactively). Remote migration state after session: `001`–`012` all green.
- Redeployed six edge functions so each picks up `supabase/config.toml` `verify_jwt = false`: final versions after session are `createProfile` v3, `process-payment` v3, `enroll-student` v4, `manage-user` v3, `webhook-stripe` v4, `sync-school` v2 (all updated 2026-04-18 ~21:12–21:41 UTC).
- Pushed three commits to `origin/main` (triggers Vercel auto-deploy): `4bdcdfb` frontend fixes + config.toml + vercel.json, `2eeb6fc` Checkout password-leak fix, `9397a4e` admin dashboard + migration 012 + manage-user admin actions.

### Session on 2026-04-18 — Student document upload and local full-workflow proof
- Added checkout-side proof-document upload in `/Users/matthews/EMCS/src/pages/Checkout.jsx` and `/Users/matthews/EMCS/src/pages/Checkout.css`, including transcript, ID, and supporting-document slots with 10 MB client-side limits.
- Added `/Users/matthews/EMCS/supabase/migrations/013_student_documents.sql`, applied it to the live Supabase project, and deployed `/Users/matthews/EMCS/supabase/functions/upload-student-document/index.ts`.
- Updated `/Users/matthews/EMCS/supabase/functions/enroll-student/index.ts` to link `student_documents` rows to the created student and to normalize blank date/grade/school inputs to `null` so browser checkout does not crash on empty optional fields.
- Updated `/Users/matthews/EMCS/src/pages/admin/AdminDashboard.jsx`, `/Users/matthews/EMCS/src/pages/portals/StudentPortal.jsx`, and `/Users/matthews/EMCS/src/services/portalData.js` so uploaded proof documents appear in admin and student-facing views with document-type labels.
- Added local-only dead-link cleanup in `/Users/matthews/EMCS/src/components/Footer.jsx`, `/Users/matthews/EMCS/src/pages/Contact.jsx`, and new legal pages at `/Users/matthews/EMCS/src/pages/LegalPage.jsx`.
- Added `/Users/matthews/EMCS/scripts/document-workflow-check.mjs` and used it to run a complete local browser proof against the live Supabase backend: parent selects `ENG1D`, applies 100% coupon, uploads two proof documents, completes checkout, sees parent and student portal data, school admin sees the documents and creates the student portal account, and the student logs in and sees both the course and uploaded files.
- Verified cleanup back to zero rows for the final disposable run across `profiles`, `students`, `orders`, `order_items`, `enrollments`, `student_documents`, `coupons`, and matching `email_log`.

### Session on 2026-04-19 — Verification rerun and public-route sweep
- Re-ran `npm run build` from `/Users/matthews/EMCS`; production build still passes locally on `vite@6.4.1`.
- Re-ran `/Users/matthews/EMCS/scripts/document-workflow-check.mjs` against the live Supabase project using the linked project service-role key fetched through `npx supabase projects api-keys --project-ref gbclamtkotqcdcgveget -o json`; the browser proof passed again with order creation, two document uploads, admin actions, student login, and cleanup.
- Confirmed the disposable rerun created order `EMCS-20260419-0001` and then deleted the related `auth.users`, `profiles`, `students`, `student_documents`, `orders`, `order_items`, `enrollments`, `email_log`, `audit_log`, and coupon rows during script cleanup.
- Ran a small Playwright-based public route sweep against `http://127.0.0.1:4173` for `/`, `/courses`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/auth`, `/cart`, and `/official-ontario/course/ENG1D`; no console/page errors or placeholder `#` links were observed on those pages.

## Failures & Resolutions

### Protected routes hung on full reload
**Issue:** `/portal/parent` and `/portal/student` could sit on `Loading...` after a refresh even with a valid session.

**Root cause:** Auth bootstrap awaited Supabase work directly inside the `onAuthStateChange` path, creating a race with session initialization.

**Fix:** `/Users/matthews/EMCS/src/context/AuthContext.jsx` now bootstraps with `supabase.auth.getSession()` and defers auth callback work with `window.setTimeout`.

**Guardrail:** Keep auth callback work lightweight; do profile fetches outside the synchronous callback path.

### Signed-in checkout could not advance past details
**Issue:** Logged-in users saw a disabled parent email input that was blank, and Step 2 failed validation.

**Root cause:** `parentDetails` initialized before `profile`/`user` hydration and was not being reconciled with resolved auth fields soon enough.

**Fix:** `/Users/matthews/EMCS/src/pages/Checkout.jsx` now hydrates `parentDetails` from `profile` and `user` in an effect and validates against `resolvedParentDetails`.

**Guardrail:** Treat disabled inputs as derived state and validate the resolved values, not only the initial local form state.

### Free checkout could show success even when enrollment failed
**Issue:** The UI could render a success state while no `students` or `enrollments` rows existed.

**Root cause:** Checkout did not fail hard when `enroll-student` returned an error or no enrollments were created.

**Fix:** `/Users/matthews/EMCS/src/pages/Checkout.jsx` now surfaces the enrollment error, and `/Users/matthews/EMCS/supabase/functions/enroll-student/index.ts` returns a real error when no enrollment was created.

**Guardrail:** A success screen must only render after the downstream state transition is confirmed in the function response.

### Browser checkout with document upload crashed on empty optional date fields
**Issue:** The new document-upload checkout path could create the order and upload files, then fail in `enroll-student` before the student row was created.

**Root cause:** `/Users/matthews/EMCS/supabase/functions/enroll-student/index.ts` inserted `""` into the `students.date_of_birth` column when the checkout form left date of birth blank, producing `invalid input syntax for type date: ""`.

**Fix:** Added `nullIfBlank` normalization in `/Users/matthews/EMCS/supabase/functions/enroll-student/index.ts` and redeployed the function. After the fix, the same browser flow successfully created the student, enrollment, and linked document rows.

**Guardrail:** All optional form values destined for typed Postgres columns must be normalized server-side; never assume the browser will omit empty strings.

### Production edge functions rejected ES256 auth tokens
**Issue:** Real production calls returned `UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM`.

**Root cause:** The legacy edge JWT gate was incompatible with the live Supabase token algorithm for these functions.

**Fix:** `/Users/matthews/EMCS/supabase/config.toml` sets `verify_jwt = false` for affected functions, and each function verifies permissions internally.

**Guardrail:** When changing auth behavior, verify with a real production call rather than assuming the platform default matches the current token format.

### Coupon validation diverged between client and backend
**Issue:** The browser could accept coupons the backend rejected, or miss coupons that existed in Supabase.

**Root cause:** Cart code used a client-side mock dictionary instead of the real `coupons` table and function path.

**Fix:** Coupon reads now come from Supabase in `/Users/matthews/EMCS/src/context/CartContext.jsx`, and active coupon access is allowed by `/Users/matthews/EMCS/supabase/migrations/011_coupon_validation_access.sql`.

**Guardrail:** Any checkout-affecting validation must use the same source of truth in UI and backend.

### Vercel direct routes returned 404 or missing-Supabase failures
**Issue:** `/auth`, `/cart`, and portal routes failed when loaded directly, and the production bundle could not reach Supabase.

**Root cause:** SPA rewrites were missing and required Vercel env vars were absent.

**Fix:** Added `/Users/matthews/EMCS/vercel.json` and configured `VITE_SUPABASE_URL` plus `VITE_SUPABASE_ANON_KEY` in the Vercel dashboard.

**Guardrail:** Keep route rewrites in repo and verify env-dependent pages in production, not only locally.

### Checkout stored parent password in `orders.parent_details`
**Issue:** A production test order captured the plain-text checkout password in `orders.parent_details`.

**Root cause:** Checkout spread the full `resolvedParentDetails` object into the payload snapshot.

**Fix:** `/Users/matthews/EMCS/src/pages/Checkout.jsx` now constructs `checkoutParentDetails` without `password`, and the previously retained production test row was scrubbed manually.

**Guardrail:** Build API payloads from explicit allowlists for sensitive forms; never spread full form state into persisted JSON.

### Admin UI surfaced generic edge-function errors instead of falling back
**Issue:** The first local admin-browser pass showed only `Edge Function returned a non-2xx status code` when `manage-user` on the server did not yet know the new actions.

**Root cause:** `supabase.functions.invoke` error handling in the admin UI did not parse JSON error bodies or distinguish authorization failures from missing-action failures.

**Fix:** `/Users/matthews/EMCS/src/pages/admin/AdminDashboard.jsx` now parses `error.context`, preserves real authorization failures, and falls back to direct table/function calls only when the deployed function is older.

**Guardrail:** When using Edge Functions from the browser, always parse structured error bodies before deciding whether a fallback is safe.

### `/admin` does not yet redirect to the dashboard in production
**Issue:** `https://www.canadaemcs.com/admin` still lands on the public site while `https://www.canadaemcs.com/admin/dashboard` works.

**Root cause:** The route table only defined `/admin/dashboard`.

**Fix:** Local patch in `/Users/matthews/EMCS/src/App.jsx` adds `/admin` -> `/admin/dashboard` behind `ProtectedRoute`.

**Guardrail:** Test both the canonical protected route and the shorthand route a stakeholder is likely to type.

### Migration 012 is not idempotent
**Issue:** `/Users/matthews/EMCS/supabase/migrations/012_school_admin_dashboard_access.sql` applies bare `CREATE POLICY` statements without guards, unlike 010 and 011 which wrap every policy in `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE ...) THEN CREATE POLICY ...; END IF; END $$;`.

**Root cause:** Oversight during drafting — the idempotency pattern already in use in 010 and 011 was not carried forward.

**Fix:** None retroactive — 012 applied cleanly on first run against production. Any future re-apply (new Supabase project, branch, or restore) will fail with `policy "…" already exists`.

**Guardrail:** All new migrations under `/Users/matthews/EMCS/supabase/migrations/` must wrap `CREATE POLICY` (and other non-idempotent DDL) in `DO $$ … IF NOT EXISTS … END $$` blocks. If 012 ever needs to be re-run, backfill guards first.

### `supabase db push` is blocked by Claude Code permission rules
**Issue:** Claude Code hooks in this environment deny `supabase db push` and `supabase db push --dry-run` with reason "Production Deploy / Blind Apply" — no interactive approval is surfaced by the hook.

**Root cause:** User's permission settings classify `supabase db push` as a production deploy action.

**Fix (this session):** User explicitly re-approved each run; the CLI then prompted `Do you want to push these migrations? [Y/n]` interactively and applied cleanly.

**Guardrail:** Before attempting `supabase db push`, confirm with the user. If blocked, offer three paths: (a) user approves the Claude Code prompt, (b) user runs it themselves in a terminal, (c) paste SQL into the Supabase dashboard SQL editor at `https://supabase.com/dashboard/project/gbclamtkotqcdcgveget/sql`. Never attempt workarounds.

### Footer and contact pages contained dead `#` links inside the checkout path
**Issue:** The checkout and other public pages still rendered placeholder footer/contact anchors with `href="#"`, so the browser proof correctly flagged dead links even when the core transaction worked.

**Root cause:** Social and legal footer links were left as placeholders, and the contact page copied the same pattern.

**Fix:** Local worktree now replaces fake legal links with real pages in `/Users/matthews/EMCS/src/pages/LegalPage.jsx` and converts unsupported social destinations into non-clickable “coming soon” UI in `/Users/matthews/EMCS/src/components/Footer.jsx` and `/Users/matthews/EMCS/src/pages/Contact.jsx`.

**Guardrail:** Never ship placeholder anchors in user-facing navigation. If a destination is not live, render it as non-interactive UI or provide a real fallback route.

### `createProfile` still shows a non-blocking JWT mismatch after redeploy
**Issue:** Browser signup still logs a `401 UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM` from `createProfile` even after redeploying the function with `verify_jwt = false` in local config.

**Root cause:** The exact remaining deployment/config mismatch is still unresolved. The DB trigger creates the `profiles` row anyway, so signup and checkout continue to work.

**Fix:** None yet for the warning itself. The fallback trigger in `/Users/matthews/EMCS/supabase/migrations/001_profiles.sql` remains the operational safeguard.

**Guardrail:** Treat `createProfile` as best-effort until the JWT mismatch is understood; always verify that the `profiles` trigger path still works before changing signup assumptions.

### Browser proof captures some request-aborted noise during reload/navigation
**Issue:** Successful Playwright runs still record `net::ERR_ABORTED` on some Supabase REST requests when the harness intentionally reloads or navigates between portal pages.

**Root cause:** The browser cancels in-flight XHR requests during route changes and full page reloads, and the harness records those cancellations as `requestfailed` diagnostics.

**Fix:** None required for product behavior. The latest successful proof still completed with correct Supabase rows, admin actions, and student login. Keep treating these as harness noise unless the same request fails without a navigation or reload.

**Guardrail:** Differentiate between diagnostic noise and user-visible failures. A failed request only counts as a regression when it blocks the workflow or reproduces on a stable page.

### `Docker is not running` warning on `supabase functions deploy` is non-blocking
**Issue:** Every `supabase functions deploy <name>` prints `WARNING: Docker is not running`.

**Root cause:** Supabase CLI 2.90.0 prefers local Docker-based bundling; falls back to remote bundling when Docker is absent.

**Fix:** None needed — remote bundling succeeds and deploys go through. Warning is informational.

**Guardrail:** Do not start Docker on the user's behalf to silence the warning. Deploys are considered successful when the `Deployed Functions on project <ref>: <name>` line appears.

## Open Questions / Next Steps
- Deploy the local `/admin` redirect patch in `/Users/matthews/EMCS/src/App.jsx` so `https://www.canadaemcs.com/admin` behaves the same as `/admin/dashboard`.
- Decide whether student portal accounts should continue to be created manually by admins or be auto-provisioned during checkout/enrollment.
- Add real school scoping for `school_admin`. Current role access is platform-wide because the schema lacks a clean `school_id` linkage for operational tables.
- Deploy the local frontend upload/dead-link/legal-page changes to Vercel so the live site exposes the new document-upload workflow, not just the local browser proof.
- After the next frontend deploy, rerun the document workflow proof against `https://www.canadaemcs.com` rather than `http://127.0.0.1:4173` so the uploaded-document UI is proven in production as well as locally.
- Decide whether admin and student portals should expose signed download links for uploaded documents. The current implementation surfaces metadata and file paths only.
- Finish Stripe integration: set `STRIPE_SECRET_KEY`, wire the frontend confirmation flow, and test `webhook-stripe`.
- Finish Moodle integration: connect `sync-school`, create Moodle users for registrations, and replace placeholder LMS account generation with real provisioning.
- Investigate why `createProfile` still returns ES256 auth errors after redeploy even though the DB trigger covers profile creation.
- Decide whether `/Users/matthews/EMCS/scripts/document-workflow-check.mjs` should be wired into `package.json` as a formal script and/or CI smoke test once secrets handling is settled.

## Context for the Next Agent
- Project root is `/Users/matthews/EMCS`. Notes live at `/Users/matthews/EMCS/Project_notes_folder/PROJECT_NOTES.md`.
- Package versions actually installed in this workspace at note time: `react@18.3.1`, `react-dom@18.3.1`, `react-router-dom@6.30.2`, `@supabase/supabase-js@2.103.0`, `vite@6.4.1`, `@playwright/test@1.59.1`.
- Useful commands used repeatedly in this session:
  - `npm run build`
  - `npm run dev -- --host 127.0.0.1 --port 4173`
  - `curl -I https://www.canadaemcs.com/admin/dashboard`
  - `curl -I https://www.canadaemcs.com/auth`
  - `POST https://api.supabase.com/v1/projects/gbclamtkotqcdcgveget/database/query` with `SUPABASE_ACCESS_TOKEN`
  - `node --input-type=module` with Playwright `chromium` for disposable production walkthroughs
  - `TEST_BASE_URL=http://127.0.0.1:4173 TEST_SUPABASE_URL=https://gbclamtkotqcdcgveget.supabase.co TEST_SUPABASE_SERVICE_ROLE_KEY=<service-role-key> node /Users/matthews/EMCS/scripts/document-workflow-check.mjs`
  - `TEST_BASE_URL=http://127.0.0.1:4173 TEST_SUPABASE_SERVICE_ROLE_KEY="$(npx supabase projects api-keys --project-ref gbclamtkotqcdcgveget -o json | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const rows=JSON.parse(s);const key=(rows.find(r=>String(r.name||r.type||"").toLowerCase().includes("service_role"))||rows.find(r=>String(r.name||r.type||"").toLowerCase().includes("service")))?.api_key;if(!key) process.exit(1);process.stdout.write(key)})')\" node /Users/matthews/EMCS/scripts/document-workflow-check.mjs`
- The repo contains unrelated untracked files at `/Users/matthews/EMCS/emcs-brand-marketing.json`, `/Users/matthews/EMCS/emcs-complete-site-data.json`, and `/Users/matthews/EMCS/extract-site-data.mjs`. Leave them alone unless explicitly asked.
- The current live admin proof used disposable accounts and records, then cleaned them up. Follow the same pattern for future live tests: seed minimal data, verify, then delete `auth.users`, `profiles`, `students`, `orders`, `order_items`, `enrollments`, `report_cards`, `email_log`, and `audit_log` rows tied to the test.
- For email testing, plus-address aliases under `matthew@schoolconex.com` worked well for disposable runs without polluting a primary mailbox.
- The final local document-workflow proof succeeded, but `browserErrors` still captured a non-blocking `createProfile` 401 plus some aborted REST requests caused by reload/navigation during the browser run. Treat those aborted requests as harness noise unless they reproduce without a route change.
- The 2026-04-19 verification rerun also succeeded and again produced non-blocking diagnostics only: one `401` resource load during parent signup plus aborted portal/profile requests caused by navigation. No blocking browser errors were observed on the public route sweep.
- The agent portal and student/parent portals are real dashboards now, but teacher workflows are still absent. `teacher` still redirects to `/teacher/dashboard`, which does not exist yet.
- `school_admin` is authorized in code and RLS, but not yet constrained by school ownership. Treat it as powerful and potentially over-broad until schema scoping is added.
- When updating these notes, merge changes into the existing sections instead of appending a new dated block at the end.
- Supabase CLI version observed working in this environment: `2.90.0`. `supabase migration list` and `supabase functions list` are safe read-only diagnostics when auditing deploy drift.
- For Claude agents specifically: `supabase db push` is blocked by this workspace's permission hook (see Failures & Resolutions). Always confirm with the user and expect interactive `[Y/n]` prompting from the CLI after approval.
- Recent session commits for quick reference: `4bdcdfb` (portal reload + free-order checkout fixes, config.toml, vercel.json), `2eeb6fc` (Checkout password-leak fix), `9397a4e` (admin dashboard + migration 012 + manage-user admin actions).
