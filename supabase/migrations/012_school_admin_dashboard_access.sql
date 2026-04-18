-- ============================================================
-- EMCS Backend Migration 012: School Admin Dashboard Access
-- Purpose: Let school_admin use the same operational dashboard
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_admin_dashboard_access()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() IN ('admin', 'school_admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "School admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage students"
  ON public.students FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage orders"
  ON public.orders FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage order items"
  ON public.order_items FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage schools"
  ON public.schools FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage enrolled_students"
  ON public.enrolled_students FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage submissions"
  ON public.student_submissions FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage teachers"
  ON public.teachers FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage metrics"
  ON public.school_daily_metrics FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage email_log"
  ON public.email_log FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage sync_errors"
  ON public.sync_errors FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage report_cards"
  ON public.report_cards FOR ALL
  USING (public.get_user_role() = 'school_admin');

CREATE POLICY "School admins can manage audit_log"
  ON public.audit_log FOR ALL
  USING (public.get_user_role() = 'school_admin');
