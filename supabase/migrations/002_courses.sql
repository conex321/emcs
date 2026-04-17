-- ============================================================
-- EMCS Backend Migration 002: Courses
-- Purpose: Full course catalog supporting both storefronts
-- ============================================================

-- courses: The master course catalog (mirrors src/data/courses.js)
CREATE TABLE IF NOT EXISTS public.courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL,
  grade           TEXT NOT NULL,
  subject         TEXT,
  storefront      TEXT NOT NULL DEFAULT 'credit'
                  CHECK (storefront IN ('credit', 'non-credit', 'academic-prep', 'official-ontario')),
  program         TEXT,
  ontario_code    TEXT,
  course_type     TEXT CHECK (course_type IN (
    'University', 'University/College', 'College', 'Workplace', 'Open',
    'Academic', 'Applied', 'Destreamed', 'Elementary',
    'Academic Preparation', 'Official Ontario Program'
  )),
  prerequisite    TEXT,
  overview        TEXT,
  description     TEXT,
  learning_outcomes JSONB DEFAULT '[]',
  units           JSONB DEFAULT '[]',
  curriculum_focus JSONB DEFAULT '[]',
  evaluation      JSONB,
  features        JSONB DEFAULT '[]',
  credit_value    NUMERIC DEFAULT 0,
  is_ossd         BOOLEAN DEFAULT false,
  delivery_method TEXT CHECK (delivery_method IN ('live-online', 'self-paced', 'hybrid')),
  schedule        JSONB,                     -- For official-ontario: start/end dates, hours/week

  -- Pricing
  list_price      NUMERIC NOT NULL DEFAULT 0,
  base_price      NUMERIC NOT NULL DEFAULT 0,
  sale_price      NUMERIC,
  per_course_price NUMERIC,                  -- For official-ontario flat pricing
  currency        TEXT DEFAULT 'CAD',
  sku             TEXT,

  -- Status
  status          TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),

  -- Moodle integration
  moodle_course_id INTEGER,

  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_courses_storefront ON public.courses(storefront);
CREATE INDEX IF NOT EXISTS idx_courses_grade ON public.courses(grade);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON public.courses(subject);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_code ON public.courses(code);

-- Auto-update timestamp
CREATE TRIGGER set_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.courses IS 'Master course catalog. Supports credit, non-credit, academic-prep, and official-ontario storefronts.';
