-- ============================================================
-- Migration: 014_pricing_revamp_april_2026
-- Purpose:   Apply the April 2026 pricing revamp to public.courses.
--
-- New pricing model (all tiers in CAD):
--   Non-Academic Ontario Record (academic-prep / non-credit), all grades:
--     $50 per course
--
--   Academic Ontario Record — Self-paced (credit / official-ontario):
--     Grades 1-8:  $350 per course
--     Grades 9-12: $400 per course
--       (+$50 surcharge applied in cart/edge function if exactly 1 G9-12 credit
--        in cart → effective $450 standalone; capped at $1,800 bundle at 6+)
--
--   Live Teacher (annual, not priced per-course in DB): handled separately via
--   bundle SKU; not represented in the courses table per-row.
--
-- Retired: $3,500 + $2,000 French Primary Foundation Legacy tier.
--
-- Upgrade path: +$350 delta applied at cart time (total $400/course after upgrade);
-- stored via the existing upgrade workflow, not on the courses row.
-- ============================================================

BEGIN;

-- Non-Academic Ontario Record (all grades): $50/course
UPDATE public.courses
SET list_price       = 50,
    base_price       = 50,
    sale_price       = NULL,
    per_course_price = 50
WHERE storefront IN ('academic-prep', 'non-credit');

-- Academic Ontario Record self-paced, Grades 1-8: $350/course
-- The `grade` column is TEXT formatted "Grade N" (see migration 002), so we
-- extract the numeric portion via regex.
UPDATE public.courses
SET list_price       = 350,
    base_price       = 350,
    sale_price       = NULL,
    per_course_price = 350
WHERE storefront IN ('official-ontario', 'credit')
  AND grade ~ 'Grade\s+\d+'
  AND substring(grade FROM 'Grade\s+(\d+)')::int BETWEEN 1 AND 8;

-- Academic Ontario Record self-paced, Grades 9-12: $400/course
-- (The $450 single-credit standalone rate and $1,800 bundle cap are applied
--  by src/context/CartContext.jsx and supabase/functions/process-payment.)
UPDATE public.courses
SET list_price       = 400,
    base_price       = 400,
    sale_price       = NULL,
    per_course_price = 400
WHERE storefront IN ('official-ontario', 'credit')
  AND grade ~ 'Grade\s+\d+'
  AND substring(grade FROM 'Grade\s+(\d+)')::int BETWEEN 9 AND 12;

-- Sanity check: any rows left untouched in these storefronts?
-- (Will surface in logs if any courses have a non-numeric grade.)
DO $$
DECLARE
  untouched_count int;
BEGIN
  SELECT COUNT(*) INTO untouched_count
  FROM public.courses
  WHERE storefront IN ('academic-prep', 'non-credit', 'official-ontario', 'credit')
    AND (grade IS NULL OR grade !~ 'Grade\s+\d+');
  IF untouched_count > 0 THEN
    RAISE NOTICE 'pricing revamp: % courses have non-numeric grade and were not updated', untouched_count;
  END IF;
END $$;

COMMIT;
