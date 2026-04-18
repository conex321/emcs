-- ============================================================
-- EMCS Backend Migration 010: Portal Access Policies
-- Purpose: Allow students and agents to load their own portal data
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'students'
      AND policyname = 'Students can view own student record'
  ) THEN
    CREATE POLICY "Students can view own student record"
      ON public.students FOR SELECT
      USING (
        lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'enrollments'
      AND policyname = 'Students can view own enrollments'
  ) THEN
    CREATE POLICY "Students can view own enrollments"
      ON public.enrollments FOR SELECT
      USING (
        student_id IN (
          SELECT id
          FROM public.students
          WHERE lower(coalesce(email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND policyname = 'Agents can view referred orders'
  ) THEN
    CREATE POLICY "Agents can view referred orders"
      ON public.orders FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM public.agents
          WHERE profile_id = auth.uid()
            AND is_active = true
            AND agent_code = orders.agent_code
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'order_items'
      AND policyname = 'Agents can view referred order items'
  ) THEN
    CREATE POLICY "Agents can view referred order items"
      ON public.order_items FOR SELECT
      USING (
        order_id IN (
          SELECT id
          FROM public.orders
          WHERE EXISTS (
            SELECT 1
            FROM public.agents
            WHERE profile_id = auth.uid()
              AND is_active = true
              AND agent_code = orders.agent_code
          )
        )
      );
  END IF;
END $$;
