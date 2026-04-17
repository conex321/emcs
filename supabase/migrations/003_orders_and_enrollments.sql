-- ============================================================
-- EMCS Backend Migration 003: Students, Orders, Enrollments
-- Purpose: Core enrollment and transaction pipeline
-- ============================================================

-- ─── STUDENTS ──────────────────────────────────────────────
-- Student profiles (children linked to a parent account)
CREATE TABLE IF NOT EXISTS public.students (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  date_of_birth   DATE,
  current_grade   TEXT,
  previous_school TEXT,
  email           TEXT,                      -- Optional student email for older students
  moodle_user_id  INTEGER,                   -- Linked Moodle account
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_parent ON public.students(parent_id);

CREATE TRIGGER set_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── ORDERS ────────────────────────────────────────────────
-- Course purchase orders
CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,
  parent_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'paid', 'processing', 'failed', 'refunded', 'cancelled')),

  -- Financials
  subtotal        NUMERIC NOT NULL DEFAULT 0,
  discount        NUMERIC DEFAULT 0,
  tax             NUMERIC DEFAULT 0,
  total           NUMERIC NOT NULL DEFAULT 0,
  currency        TEXT DEFAULT 'CAD',

  -- Coupon/Agent
  coupon_code     TEXT,
  agent_code      TEXT,

  -- Payment
  payment_method  TEXT CHECK (payment_method IN ('card', 'flywire', 'bank_transfer', 'free')),
  payment_intent_id TEXT,                    -- Stripe PaymentIntent ID
  flywire_ref     TEXT,                      -- Flywire transaction reference

  -- Snapshot of form data at time of purchase
  parent_details  JSONB NOT NULL DEFAULT '{}',
  student_details JSONB DEFAULT '[]',        -- Array of student info snapshots

  -- Metadata
  metadata        JSONB DEFAULT '{}',
  notes           TEXT,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_parent ON public.orders(parent_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Generate order number: EMCS-YYYYMMDD-XXXX
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(order_number, '-', 3) AS INTEGER)
  ), 0) + 1 INTO seq_num
  FROM public.orders
  WHERE order_number LIKE 'EMCS-' || TO_CHAR(now(), 'YYYYMMDD') || '-%';

  NEW.order_number := 'EMCS-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION public.generate_order_number();

-- ─── ORDER ITEMS ───────────────────────────────────────────
-- Individual courses in an order
CREATE TABLE IF NOT EXISTS public.order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  course_id       UUID REFERENCES public.courses(id),
  student_id      UUID REFERENCES public.students(id),
  course_code     TEXT NOT NULL,              -- Denormalized for quick reference
  course_title    TEXT NOT NULL,              -- Denormalized snapshot
  price           NUMERIC NOT NULL DEFAULT 0,
  is_bundled      BOOLEAN DEFAULT false,
  bundle_reason   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_student ON public.order_items(student_id);

-- ─── ENROLLMENTS ───────────────────────────────────────────
-- Active course enrollments (created after payment confirmed)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES public.students(id) ON DELETE CASCADE,
  course_id       UUID REFERENCES public.courses(id),
  order_item_id   UUID REFERENCES public.order_items(id),
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'active', 'completed', 'withdrawn', 'suspended')),
  enrolled_at     TIMESTAMPTZ DEFAULT now(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,

  -- Moodle linkage
  moodle_enrolment_id INTEGER,

  -- Progress tracking
  progress_pct    NUMERIC DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  final_grade     TEXT,
  final_mark      NUMERIC,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),

  -- One enrollment per student per course
  UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);

CREATE TRIGGER set_enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.students IS 'Student profiles linked to parent accounts. Children can be enrolled in multiple courses.';
COMMENT ON TABLE public.orders IS 'Course purchase orders with payment tracking.';
COMMENT ON TABLE public.order_items IS 'Individual courses within an order, linked to students.';
COMMENT ON TABLE public.enrollments IS 'Active course enrollments. Created after payment confirmation via webhook.';
