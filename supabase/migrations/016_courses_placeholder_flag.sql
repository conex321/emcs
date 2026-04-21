-- ============================================================
-- EMCS Backend Migration 016: Courses placeholder flag
-- Purpose: For the April 2026 launch we only have 55 real Moodle
--          courses covering Grades 1-8. Grades 9-12 are listed on
--          the site for informational purposes but are not yet
--          enrollable. Admin flips `is_placeholder` to false (and
--          sets `moodle_course_id`) when a course goes live in Moodle.
--
--          Checkout blocks cart items whose course has is_placeholder=true.
-- ============================================================

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS is_placeholder BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_courses_placeholder
  ON public.courses(is_placeholder)
  WHERE is_placeholder = true;

-- Backfill: all high school grades (9, 10, 11, 12) start as placeholders.
-- Admin will toggle these off per-course once each one is matched in Moodle.
UPDATE public.courses
   SET is_placeholder = true
 WHERE grade IN ('9', '10', '11', '12');

COMMENT ON COLUMN public.courses.is_placeholder IS
  'True = course is listed for display only, not purchasable or enrollable. Admin flips to false once matched to a live Moodle course.';
