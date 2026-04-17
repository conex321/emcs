-- ============================================================
-- EMCS Backend Migration 009: Email & Registration Enhancements
-- Purpose: Resend integration tracking + Moodle credential storage
-- ============================================================

-- ─── EMAIL LOG ENHANCEMENTS ───────────────────────────────
-- Track Resend message IDs and distinguish email types
ALTER TABLE public.email_log
  ADD COLUMN IF NOT EXISTS resend_id TEXT;

ALTER TABLE public.email_log
  ADD COLUMN IF NOT EXISTS email_type TEXT;

-- Add check constraint for email_type (safe: only if column doesn't have one)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'email_log_email_type_check'
  ) THEN
    ALTER TABLE public.email_log
      ADD CONSTRAINT email_log_email_type_check
      CHECK (email_type IN (
        'purchase_receipt',
        'registration',
        'admin_notification',
        'enrollment_confirmation'
      ));
  END IF;
END $$;

-- Index for Resend tracking
CREATE INDEX IF NOT EXISTS idx_email_log_resend_id ON public.email_log(resend_id);
CREATE INDEX IF NOT EXISTS idx_email_log_type ON public.email_log(email_type);

-- ─── STUDENT MOODLE CREDENTIALS ──────────────────────────
-- Store auto-generated LMS credentials per student
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS moodle_username TEXT;

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS moodle_password TEXT;

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS moodle_credentials_generated BOOLEAN DEFAULT false;

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS registration_email_sent BOOLEAN DEFAULT false;

ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS receipt_email_sent BOOLEAN DEFAULT false;

-- Index for quick credential lookups
CREATE INDEX IF NOT EXISTS idx_students_moodle_username ON public.students(moodle_username);

-- ─── COMMENTS ─────────────────────────────────────────────
COMMENT ON COLUMN public.email_log.resend_id IS 'Resend message ID for delivery tracking';
COMMENT ON COLUMN public.email_log.email_type IS 'Type of transactional email: purchase_receipt, registration, admin_notification, enrollment_confirmation';
COMMENT ON COLUMN public.students.moodle_username IS 'Auto-generated or synced Moodle LMS username';
COMMENT ON COLUMN public.students.moodle_password IS 'Temporary Moodle password (plain text until Moodle API consumes it)';
COMMENT ON COLUMN public.students.moodle_credentials_generated IS 'Whether Moodle credentials have been auto-generated';
COMMENT ON COLUMN public.students.registration_email_sent IS 'Whether registration email with LMS credentials has been sent';
COMMENT ON COLUMN public.students.receipt_email_sent IS 'Whether purchase receipt email has been sent';
