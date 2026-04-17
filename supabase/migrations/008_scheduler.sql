-- ============================================================
-- EMCS Backend Migration 008: pg_cron Scheduler
-- Purpose: Automated twice-daily Moodle sync jobs
-- ============================================================

-- Enable pg_cron extension (Supabase has this available)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres
GRANT USAGE ON SCHEMA cron TO postgres;

-- ─── Twice-daily school sync (9 AM and 9 PM EST / 14:00 and 02:00 UTC) ──
SELECT cron.schedule(
  'sync-schools-morning',
  '0 14 * * *',  -- 9:00 AM EST (14:00 UTC)
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/sync-school',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'sync-schools-evening',
  '0 2 * * *',   -- 9:00 PM EST (02:00 UTC next day)
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/sync-school',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{}'::jsonb
  );
  $$
);

-- ─── Daily metrics aggregation (midnight EST / 05:00 UTC) ──
SELECT cron.schedule(
  'aggregate-daily-metrics',
  '0 5 * * *',   -- 12:00 AM EST (05:00 UTC)
  $$
  INSERT INTO public.school_daily_metrics (school_id, metric_date, total_students, active_students, total_enrollments, new_enrollments, total_submissions, graded_submissions)
  SELECT
    s.id,
    CURRENT_DATE - 1,
    (SELECT COUNT(*) FROM public.enrolled_students WHERE school_id = s.id),
    (SELECT COUNT(*) FROM public.enrolled_students WHERE school_id = s.id AND last_access > now() - interval '7 days'),
    (SELECT COUNT(*) FROM public.enrollments e JOIN public.students st ON e.student_id = st.id WHERE e.status = 'active'),
    (SELECT COUNT(*) FROM public.enrollments e WHERE e.enrolled_at >= CURRENT_DATE - 1 AND e.enrolled_at < CURRENT_DATE),
    (SELECT COUNT(*) FROM public.student_submissions WHERE school_id = s.id),
    (SELECT COUNT(*) FROM public.student_submissions WHERE school_id = s.id AND is_graded = true)
  FROM public.schools s
  WHERE s.is_active = true
  ON CONFLICT (school_id, metric_date) DO UPDATE SET
    total_students = EXCLUDED.total_students,
    active_students = EXCLUDED.active_students,
    total_enrollments = EXCLUDED.total_enrollments,
    new_enrollments = EXCLUDED.new_enrollments,
    total_submissions = EXCLUDED.total_submissions,
    graded_submissions = EXCLUDED.graded_submissions;
  $$
);

COMMENT ON EXTENSION pg_cron IS 'Automated scheduler for Moodle sync (9AM/9PM EST) and daily metrics aggregation';
