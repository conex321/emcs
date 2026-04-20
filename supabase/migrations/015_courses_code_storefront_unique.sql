-- ============================================================
-- EMCS Backend Migration 015: Composite (code, storefront) unique on courses
-- Purpose: Allow the same Moodle-backed course to exist as two SKUs —
--          once on the academic-prep storefront ($50/course, no Ontario record)
--          and once on the official-ontario storefront ($350/course, credit-bearing).
--          The previous single-column UNIQUE on `code` blocked this.
-- ============================================================

-- Drop the legacy single-column unique constraint on code.
ALTER TABLE public.courses
  DROP CONSTRAINT IF EXISTS courses_code_key;

-- Add a composite unique on (code, storefront). One Moodle course (idnumber)
-- can now appear up to four times — once per storefront enum value
-- ('credit', 'non-credit', 'academic-prep', 'official-ontario').
CREATE UNIQUE INDEX IF NOT EXISTS courses_code_storefront_key
  ON public.courses (code, storefront);

-- The plain index on code stays for fast equality lookups during enrollment.
-- (Already created in migration 002 as idx_courses_code.)
