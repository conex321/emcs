-- ============================================================
-- EMCS Backend Migration 005: Schools & Moodle Integration
-- Purpose: Moodle LMS integration (same pattern as SISConex)
-- ============================================================

-- ─── SCHOOLS ───────────────────────────────────────────────
-- Moodle instance configurations
CREATE TABLE IF NOT EXISTS public.schools (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  moodle_url      TEXT,                      -- e.g., https://moodle.emcs.ca
  moodle_token    TEXT,                      -- WS token (service_role access only!)
  timezone        TEXT DEFAULT 'America/Toronto',
  is_active       BOOLEAN DEFAULT true,
  last_synced_at  TIMESTAMPTZ,
  sync_status     TEXT DEFAULT 'idle'
                  CHECK (sync_status IN ('idle', 'syncing', 'error', 'success')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── ENROLLED STUDENTS (Moodle Snapshot) ───────────────────
-- Mirrors Moodle enrollment data pulled during sync
CREATE TABLE IF NOT EXISTS public.enrolled_students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  moodle_user_id  INTEGER NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  full_name       TEXT,
  username        TEXT,
  email           TEXT,
  courses         TEXT[],                   -- Array of course shortnames
  course_ids      INTEGER[],               -- Array of Moodle course IDs
  roles           TEXT[],                  -- e.g., {'student', 'editingteacher'}
  last_access     TIMESTAMPTZ,
  profile_image   TEXT,
  synced_at       TIMESTAMPTZ DEFAULT now(),

  UNIQUE (school_id, moodle_user_id)
);

CREATE INDEX IF NOT EXISTS idx_enrolled_students_school ON public.enrolled_students(school_id);
CREATE INDEX IF NOT EXISTS idx_enrolled_students_moodle_uid ON public.enrolled_students(moodle_user_id);

-- ─── STUDENT SUBMISSIONS ──────────────────────────────────
-- Assignment submission records from Moodle
CREATE TABLE IF NOT EXISTS public.student_submissions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id           UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id          UUID REFERENCES public.students(id) ON DELETE SET NULL,
  moodle_user_id      INTEGER,
  course_code         TEXT,
  course_name         TEXT,
  moodle_course_id    INTEGER,

  -- Assignment details
  assignment_name     TEXT,
  assignment_cmid     INTEGER,
  activity_type       TEXT,                 -- 'assign', 'quiz', 'forum', etc.

  -- Submission details
  submitted_at        TIMESTAMPTZ,
  status              TEXT,                 -- 'submitted', 'new', 'draft'
  attempt_number      INTEGER DEFAULT 1,

  -- Grading
  is_graded           BOOLEAN DEFAULT false,
  grade_raw           NUMERIC,
  grade_max           NUMERIC,
  grade_percent       NUMERIC,
  graded_at           TIMESTAMPTZ,
  graded_by           TEXT,                 -- Teacher name who graded
  grader_id           INTEGER,              -- Moodle user ID of grader

  -- Feedback
  feedback            TEXT,

  synced_at           TIMESTAMPTZ DEFAULT now(),

  UNIQUE (school_id, moodle_user_id, assignment_cmid)
);

CREATE INDEX IF NOT EXISTS idx_submissions_school ON public.student_submissions(school_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.student_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_course ON public.student_submissions(course_code);

-- ─── TEACHER TRACKING ──────────────────────────────────────
-- Teachers/graders synced from Moodle
CREATE TABLE IF NOT EXISTS public.teachers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  profile_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  moodle_user_id  INTEGER,
  full_name       TEXT NOT NULL,
  email           TEXT,
  courses_teaching TEXT[],
  is_active       BOOLEAN DEFAULT true,
  synced_at       TIMESTAMPTZ DEFAULT now(),

  UNIQUE (school_id, moodle_user_id)
);

CREATE INDEX IF NOT EXISTS idx_teachers_school ON public.teachers(school_id);

COMMENT ON TABLE public.schools IS 'Moodle instance configurations. moodle_token is restricted to service_role access.';
COMMENT ON TABLE public.enrolled_students IS 'Snapshot of Moodle enrollment data. Refreshed during twice-daily sync.';
COMMENT ON TABLE public.student_submissions IS 'Assignment submissions and grades pulled from Moodle.';
COMMENT ON TABLE public.teachers IS 'Teacher roster synced from Moodle for grading attribution.';
