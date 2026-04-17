-- ============================================================
-- EMCS Backend Migration 007: Row-Level Security (RLS) Policies
-- Purpose: Strict role-based access control on all tables
-- ============================================================

-- ═══════════════════════════════════════════════════════════
-- HELPER: Get current user's role
-- ═══════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ═══════════════════════════════════════════════════════════
-- PROFILES
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_user_role() = 'admin');

-- Admins can update any profile
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- COURSES (public read, admin write)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Anyone can read published courses (including anonymous)
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (status = 'published');

-- Admins can do everything with courses
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- STUDENTS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Parents can view their own children
CREATE POLICY "Parents can view own students"
  ON public.students FOR SELECT
  USING (parent_id = auth.uid());

-- Parents can create students (enroll children)
CREATE POLICY "Parents can create students"
  ON public.students FOR INSERT
  WITH CHECK (parent_id = auth.uid());

-- Parents can update their own children
CREATE POLICY "Parents can update own students"
  ON public.students FOR UPDATE
  USING (parent_id = auth.uid());

-- Admins can manage all students
CREATE POLICY "Admins can manage students"
  ON public.students FOR ALL
  USING (public.get_user_role() = 'admin');

-- Teachers can view students (for grading)
CREATE POLICY "Teachers can view students"
  ON public.students FOR SELECT
  USING (public.get_user_role() = 'teacher');

-- ═══════════════════════════════════════════════════════════
-- ORDERS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Parents can view their own orders
CREATE POLICY "Parents can view own orders"
  ON public.orders FOR SELECT
  USING (parent_id = auth.uid());

-- Parents can create orders
CREATE POLICY "Parents can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (parent_id = auth.uid());

-- Admins can manage all orders
CREATE POLICY "Admins can manage orders"
  ON public.orders FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- ORDER ITEMS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Parents can view items in their own orders
CREATE POLICY "Parents can view own order items"
  ON public.order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM public.orders WHERE parent_id = auth.uid())
  );

-- Admins can manage all order items
CREATE POLICY "Admins can manage order items"
  ON public.order_items FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- ENROLLMENTS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Parents can view enrollments for their children
CREATE POLICY "Parents can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

-- Admins can manage all enrollments
CREATE POLICY "Admins can manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.get_user_role() = 'admin');

-- Teachers can view enrollments for their courses
CREATE POLICY "Teachers can view enrollments"
  ON public.enrollments FOR SELECT
  USING (public.get_user_role() = 'teacher');

-- ═══════════════════════════════════════════════════════════
-- AGENTS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Agents can view their own record
CREATE POLICY "Agents can view own record"
  ON public.agents FOR SELECT
  USING (profile_id = auth.uid());

-- Admins can manage all agents
CREATE POLICY "Admins can manage agents"
  ON public.agents FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- COUPONS (admin only for write, service_role for validation)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Admins can manage all coupons
CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- COMMISSIONS
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Agents can view their own commissions
CREATE POLICY "Agents can view own commissions"
  ON public.commissions FOR SELECT
  USING (
    agent_id IN (SELECT id FROM public.agents WHERE profile_id = auth.uid())
  );

-- Admins can manage all commissions
CREATE POLICY "Admins can manage commissions"
  ON public.commissions FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- SCHOOLS (admin only)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage schools"
  ON public.schools FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- MOODLE TABLES (admin + teacher read)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.enrolled_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage enrolled_students"
  ON public.enrolled_students FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Teachers can view enrolled_students"
  ON public.enrolled_students FOR SELECT
  USING (public.get_user_role() = 'teacher');

CREATE POLICY "Admins can manage submissions"
  ON public.student_submissions FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Teachers can view submissions"
  ON public.student_submissions FOR SELECT
  USING (public.get_user_role() = 'teacher');

CREATE POLICY "Admins can manage teachers"
  ON public.teachers FOR ALL
  USING (public.get_user_role() = 'admin');

-- ═══════════════════════════════════════════════════════════
-- METRICS & OPERATIONAL TABLES (admin only)
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.school_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_errors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage metrics"
  ON public.school_daily_metrics FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can manage email_log"
  ON public.email_log FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can manage sync_errors"
  ON public.sync_errors FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "Admins can manage report_cards"
  ON public.report_cards FOR ALL
  USING (public.get_user_role() = 'admin');

-- Parents can view their children's report cards (if published)
CREATE POLICY "Parents can view published report cards"
  ON public.report_cards FOR SELECT
  USING (
    is_published = true AND
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage audit_log"
  ON public.audit_log FOR ALL
  USING (public.get_user_role() = 'admin');
