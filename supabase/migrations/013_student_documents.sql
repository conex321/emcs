-- ============================================================
-- EMCS Backend Migration 013: Student Registration Documents
-- Purpose: Store proof documents uploaded during checkout
-- ============================================================

CREATE TABLE IF NOT EXISTS public.student_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id         UUID REFERENCES public.students(id) ON DELETE CASCADE,
  order_id           UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  uploaded_by        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_index      INTEGER DEFAULT 0,
  student_email      TEXT,
  student_first_name TEXT,
  student_last_name  TEXT,
  parent_email       TEXT,
  document_type      TEXT NOT NULL
                    CHECK (document_type IN ('transcript', 'id_document', 'supporting_document')),
  file_name          TEXT NOT NULL,
  file_path          TEXT NOT NULL,
  mime_type          TEXT,
  file_size_bytes    INTEGER,
  status             TEXT DEFAULT 'uploaded'
                    CHECK (status IN ('uploaded', 'linked', 'reviewed', 'rejected')),
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_documents_student ON public.student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_order ON public.student_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_student_email ON public.student_documents(student_email);

CREATE TRIGGER set_student_documents_updated_at
  BEFORE UPDATE ON public.student_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own student documents"
  ON public.student_documents FOR SELECT
  USING (
    student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
    OR order_id IN (SELECT id FROM public.orders WHERE parent_id = auth.uid())
  );

CREATE POLICY "Students can view own student documents"
  ON public.student_documents FOR SELECT
  USING (
    student_id IN (
      SELECT id
      FROM public.students
      WHERE lower(email) = lower(COALESCE((SELECT email FROM public.profiles WHERE id = auth.uid()), ''))
    )
  );

CREATE POLICY "Admins can manage student documents"
  ON public.student_documents FOR ALL
  USING (public.get_user_role() = 'admin');

CREATE POLICY "School admins can manage student documents"
  ON public.student_documents FOR ALL
  USING (public.get_user_role() = 'school_admin');

INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.student_documents IS 'Registration proof documents uploaded during checkout. File bytes are stored in the Supabase Storage bucket student-documents.';
