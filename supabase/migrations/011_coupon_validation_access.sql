-- ============================================================
-- EMCS Backend Migration 011: Coupon Validation Access
-- Purpose: Let the storefront validate active coupons from the browser
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'coupons'
      AND policyname = 'Anyone can view active coupons for validation'
  ) THEN
    CREATE POLICY "Anyone can view active coupons for validation"
      ON public.coupons FOR SELECT
      USING (
        is_active = true
        AND (starts_at IS NULL OR starts_at <= now())
        AND (expires_at IS NULL OR expires_at > now())
      );
  END IF;
END $$;
