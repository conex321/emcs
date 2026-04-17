-- ============================================================
-- EMCS Database Seed Data
-- Run after all migrations have been applied
-- ============================================================

-- ─── COURSES (Academic Prep - free) ──────────────────────
INSERT INTO public.courses (code, title, grade, storefront, subject, course_type, list_price, base_price, status)
VALUES
  ('EMCS-AP-ENG-G1', 'English Foundations', 'Grade 1', 'academic-prep', 'English', 'Elementary', 0, 0, 'published'),
  ('EMCS-AP-MATH-G1', 'Math Foundations', 'Grade 1', 'academic-prep', 'Mathematics', 'Elementary', 0, 0, 'published'),
  ('EMCS-AP-SCI-G1', 'Science Foundations', 'Grade 1', 'academic-prep', 'Science', 'Elementary', 0, 0, 'published')
ON CONFLICT (code) DO NOTHING;

-- ─── COURSES (Non-Credit - ESL) ──────────────────────────
INSERT INTO public.courses (code, title, grade, storefront, subject, course_type, list_price, base_price, status)
VALUES
  ('EMCS-NC-ESL-A1', 'ESL Level A1', 'Beginner', 'non-credit', 'English', 'Open', 299, 249, 'published'),
  ('EMCS-NC-ESL-A2', 'ESL Level A2', 'Elementary', 'non-credit', 'English', 'Open', 299, 249, 'published'),
  ('EMCS-NC-IELTS', 'IELTS Preparation', 'Advanced', 'non-credit', 'English', 'Open', 449, 399, 'published')
ON CONFLICT (code) DO NOTHING;

-- ─── COURSES (Credit - OSSD) ─────────────────────────────
INSERT INTO public.courses (code, title, grade, storefront, subject, course_type, is_ossd, credit_value, list_price, base_price, status, ontario_code)
VALUES
  ('ENG1D', 'English, Grade 9, Academic', 'Grade 9', 'credit', 'English', 'Academic', true, 1, 1500, 1200, 'published', 'ENG1D'),
  ('MPM1D', 'Mathematics, Grade 9, Academic', 'Grade 9', 'credit', 'Mathematics', 'Academic', true, 1, 1500, 1200, 'published', 'MPM1D'),
  ('SNC1D', 'Science, Grade 9, Academic', 'Grade 9', 'credit', 'Science', 'Academic', true, 1, 1500, 1200, 'published', 'SNC1D'),
  ('ENG4U', 'English, Grade 12, University', 'Grade 12', 'credit', 'English', 'University', true, 1, 1500, 1200, 'published', 'ENG4U'),
  ('MHF4U', 'Advanced Functions, Grade 12', 'Grade 12', 'credit', 'Mathematics', 'University', true, 1, 1500, 1200, 'published', 'MHF4U'),
  ('MCV4U', 'Calculus and Vectors, Grade 12', 'Grade 12', 'credit', 'Mathematics', 'University', true, 1, 1500, 1200, 'published', 'MCV4U')
ON CONFLICT (code) DO NOTHING;

-- ─── AGENT (Demo) ────────────────────────────────────────
INSERT INTO public.agents (agent_code, contact_name, contact_email, commission_rate_credit, commission_rate_noncredit, is_active)
VALUES
  ('AGENT-DEMO', 'Demo Agent', 'agent@emcs.ca', 52, 10, true)
ON CONFLICT (agent_code) DO NOTHING;

-- ─── COUPONS ──────────────────────────────────────────────
INSERT INTO public.coupons (code, type, value, is_active, max_uses, use_count)
VALUES
  ('WELCOME10', 'percent', 10, true, 100, 0),
  ('FLAT50', 'fixed', 50, true, 50, 0)
ON CONFLICT (code) DO NOTHING;
