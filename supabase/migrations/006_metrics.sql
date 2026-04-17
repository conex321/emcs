-- ============================================================
-- EMCS Backend Migration 006: Metrics & Operational Tables
-- Purpose: Analytics, email tracking, sync errors, report cards
-- ============================================================

-- ─── SCHOOL DAILY METRICS ──────────────────────────────────
-- Aggregated daily stats (same as SISConex)
CREATE TABLE IF NOT EXISTS public.school_daily_metrics (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  metric_date     DATE NOT NULL,
  total_students  INTEGER DEFAULT 0,
  active_students INTEGER DEFAULT 0,
  total_enrollments INTEGER DEFAULT 0,
  new_enrollments INTEGER DEFAULT 0,
  total_submissions INTEGER DEFAULT 0,
  graded_submissions INTEGER DEFAULT 0,
  total_revenue   NUMERIC DEFAULT 0,
  new_orders      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),

  UNIQUE (school_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_metrics_school_date ON public.school_daily_metrics(school_id, metric_date);

-- ─── EMAIL LOG ─────────────────────────────────────────────
-- All transactional emails sent by the platform
CREATE TABLE IF NOT EXISTS public.email_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient       TEXT NOT NULL,
  template        TEXT NOT NULL,             -- e.g., 'enrollment_confirmation', 'password_reset'
  subject         TEXT,
  status          TEXT DEFAULT 'sent'
                  CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'bounced')),
  error_message   TEXT,
  metadata        JSONB DEFAULT '{}',        -- Template variables, order ref, etc.
  sent_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON public.email_log(recipient);
CREATE INDEX IF NOT EXISTS idx_email_log_template ON public.email_log(template);

-- ─── SYNC ERRORS ───────────────────────────────────────────
-- Error and warning log from Moodle sync jobs
CREATE TABLE IF NOT EXISTS public.sync_errors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  sync_type       TEXT,                      -- 'students', 'submissions', 'grades', 'full'
  severity        TEXT CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  message         TEXT,
  details         JSONB DEFAULT '{}',
  resolved        BOOLEAN DEFAULT false,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sync_errors_school ON public.sync_errors(school_id);
CREATE INDEX IF NOT EXISTS idx_sync_errors_severity ON public.sync_errors(severity);

-- ─── REPORT CARDS ──────────────────────────────────────────
-- Report card file metadata (files stored in Supabase Storage)
CREATE TABLE IF NOT EXISTS public.report_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES public.students(id) ON DELETE CASCADE,
  school_id       UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  term            TEXT NOT NULL,             -- e.g., 'Fall 2026', 'Winter 2027'
  academic_year   TEXT,                      -- e.g., '2026-2027'
  file_name       TEXT NOT NULL,
  file_path       TEXT NOT NULL,             -- Supabase Storage path
  file_type       TEXT DEFAULT 'pdf'
                  CHECK (file_type IN ('pdf', 'docx', 'doc')),
  file_size_bytes INTEGER,
  uploaded_by     UUID REFERENCES public.profiles(id),
  uploaded_at     TIMESTAMPTZ DEFAULT now(),
  is_published    BOOLEAN DEFAULT false,     -- Visible to parent/student

  UNIQUE (student_id, term, academic_year)
);

CREATE INDEX IF NOT EXISTS idx_report_cards_student ON public.report_cards(student_id);

-- ─── AUDIT LOG ─────────────────────────────────────────────
-- Admin action audit trail
CREATE TABLE IF NOT EXISTS public.audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id        UUID REFERENCES public.profiles(id),
  action          TEXT NOT NULL,             -- e.g., 'user.role_change', 'order.refund'
  target_type     TEXT,                      -- e.g., 'profile', 'order', 'enrollment'
  target_id       UUID,
  old_values      JSONB,
  new_values      JSONB,
  ip_address      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_log(action);

COMMENT ON TABLE public.school_daily_metrics IS 'Aggregated daily stats per school. Used for admin dashboard.';
COMMENT ON TABLE public.email_log IS 'Transactional email audit trail.';
COMMENT ON TABLE public.sync_errors IS 'Error log from Moodle sync pipeline.';
COMMENT ON TABLE public.report_cards IS 'Report card metadata. Actual files stored in Supabase Storage bucket.';
COMMENT ON TABLE public.audit_log IS 'Admin action audit trail for compliance and debugging.';
