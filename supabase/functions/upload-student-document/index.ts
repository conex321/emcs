// ============================================================
// Edge Function: upload-student-document
// Purpose: Store registration proof documents in Storage + metadata table
// ============================================================
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'
import { createServiceClient, createUserClient } from '../_shared/supabase-client.ts'

const BUCKET = 'student-documents'
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
])

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const supabaseAdmin = createServiceClient()

    const formData = await req.formData()
    const orderId = String(formData.get('order_id') || '').trim()
    const documentType = String(formData.get('document_type') || '').trim()
    const studentIndex = Number(formData.get('student_index') || 0)
    const studentEmail = String(formData.get('student_email') || '').trim()
    const studentFirstName = String(formData.get('student_first_name') || '').trim()
    const studentLastName = String(formData.get('student_last_name') || '').trim()
    const parentEmail = String(formData.get('parent_email') || '').trim()
    const file = formData.get('file')

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'order_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['transcript', 'id_document', 'supporting_document'].includes(documentType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid document_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'A file upload is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File exceeds 10MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Please upload PDF, DOC, DOCX, JPG, or PNG.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, parent_id')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let uploadedBy: string | null = null
    const authHeader = req.headers.get('Authorization')

    if (authHeader) {
      try {
        const supabaseUser = createUserClient(req)
        const { data: { user } } = await supabaseUser.auth.getUser()
        uploadedBy = user?.id || null
      } catch {
        uploadedBy = null
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const safeName = sanitizeFileName(file.name || `${documentType}.bin`) || `${documentType}.bin`
    const filePath = `${orderId}/${studentIndex}/${timestamp}-${safeName}`

    const { error: uploadError } = await supabaseAdmin
      .storage
      .from(BUCKET)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: documentRecord, error: documentError } = await supabaseAdmin
      .from('student_documents')
      .insert({
        order_id: orderId,
        uploaded_by: uploadedBy || order.parent_id || null,
        student_index: Number.isFinite(studentIndex) ? studentIndex : 0,
        student_email: studentEmail || null,
        student_first_name: studentFirstName || null,
        student_last_name: studentLastName || null,
        parent_email: parentEmail || null,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
        mime_type: file.type,
        file_size_bytes: file.size,
        status: 'uploaded',
      })
      .select()
      .single()

    if (documentError) {
      throw documentError
    }

    return new Response(
      JSON.stringify({
        success: true,
        document: documentRecord,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('upload-student-document error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
