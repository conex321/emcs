-- ============================================================
-- EMCS Backend Migration 004: Agents, Coupons, Commissions
-- Purpose: Referral/recruitment partner system
-- ============================================================

-- ─── AGENTS ────────────────────────────────────────────────
-- Recruitment/referral agents (partners)
CREATE TABLE IF NOT EXISTS public.agents (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id                 UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  agent_code                 TEXT UNIQUE NOT NULL,
  company_name               TEXT,
  contact_name               TEXT,
  contact_email              TEXT,
  country                    TEXT,
  commission_rate_credit     NUMERIC DEFAULT 52,    -- $52 per credit student
  commission_rate_noncredit  NUMERIC DEFAULT 10,    -- $10 per non-credit student
  commission_type            TEXT DEFAULT 'fixed'
                             CHECK (commission_type IN ('fixed', 'percent')),
  is_active                  BOOLEAN DEFAULT true,
  total_referrals            INTEGER DEFAULT 0,
  total_commission_earned    NUMERIC DEFAULT 0,
  created_at                 TIMESTAMPTZ DEFAULT now(),
  updated_at                 TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_code ON public.agents(agent_code);
CREATE INDEX IF NOT EXISTS idx_agents_profile ON public.agents(profile_id);

CREATE TRIGGER set_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── COUPONS ───────────────────────────────────────────────
-- Discount codes: agent-linked and promotional
CREATE TABLE IF NOT EXISTS public.coupons (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                   TEXT UNIQUE NOT NULL,
  type                   TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value                  NUMERIC NOT NULL,
  description            TEXT,
  agent_id               UUID REFERENCES public.agents(id) ON DELETE SET NULL,

  -- Restrictions
  restrict_to_storefront TEXT CHECK (restrict_to_storefront IN (
    'credit', 'non-credit', 'academic-prep', 'official-ontario', NULL
  )),
  min_cart_value         NUMERIC,
  max_discount           NUMERIC,             -- Cap for percent coupons (e.g., max 60%)
  max_uses               INTEGER,
  use_count              INTEGER DEFAULT 0,
  single_use_per_user    BOOLEAN DEFAULT false,

  -- Validity
  starts_at              TIMESTAMPTZ,
  expires_at             TIMESTAMPTZ,
  is_active              BOOLEAN DEFAULT true,

  created_at             TIMESTAMPTZ DEFAULT now(),
  updated_at             TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_agent ON public.coupons(agent_id);

CREATE TRIGGER set_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── COMMISSIONS ───────────────────────────────────────────
-- Agent commission records (one per enrollment)
CREATE TABLE IF NOT EXISTS public.commissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  order_id        UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  student_id      UUID REFERENCES public.students(id) ON DELETE SET NULL,
  amount          NUMERIC NOT NULL,
  currency        TEXT DEFAULT 'CAD',
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  paid_at         TIMESTAMPTZ,
  items           JSONB DEFAULT '[]',        -- Detail of which courses earned commission
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commissions_agent ON public.commissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);

CREATE TRIGGER set_commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON TABLE public.agents IS 'Recruitment/referral agents. Each has a unique agent_code for coupon generation.';
COMMENT ON TABLE public.coupons IS 'Discount codes. Can be agent-linked or standalone promotional codes.';
COMMENT ON TABLE public.commissions IS 'Agent commission records. Created when a referred student enrolls and pays.';
