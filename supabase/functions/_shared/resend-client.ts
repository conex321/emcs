// ============================================================
// EMCS Shared: Resend Email Client for Edge Functions
// Domain: noreply.canadaemcs.com
// ============================================================

const RESEND_API_URL = 'https://api.resend.com/emails'
const DEFAULT_FROM = 'Toronto EMCS <noreply@noreply.canadaemcs.com>'

interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
  cc?: string[]
  bcc?: string[]
  tags?: Array<{ name: string; value: string }>
}

interface ResendResponse {
  id: string
}

interface SendEmailResult {
  success: boolean
  resend_id?: string
  error?: string
}

/**
 * Send an email via Resend API.
 * Requires RESEND_API_KEY to be set as a Supabase Edge Function secret.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    console.error('[resend] RESEND_API_KEY not configured')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  const payload: Record<string, unknown> = {
    from: params.from || DEFAULT_FROM,
    to: Array.isArray(params.to) ? params.to : [params.to],
    subject: params.subject,
    html: params.html,
  }

  if (params.replyTo) payload.reply_to = params.replyTo
  if (params.cc) payload.cc = params.cc
  if (params.bcc) payload.bcc = params.bcc
  if (params.tags) payload.tags = params.tags

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[resend] API error:', JSON.stringify(data))
      return {
        success: false,
        error: data?.message || data?.error || `Resend API returned ${res.status}`,
      }
    }

    const response = data as ResendResponse
    console.log(`[resend] Email sent successfully. ID: ${response.id}`)
    return {
      success: true,
      resend_id: response.id,
    }
  } catch (err) {
    console.error('[resend] Network error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error sending email',
    }
  }
}

/**
 * Generate a Moodle-compatible username from student name.
 * Format: firstname.lastname (lowercase, sanitized)
 */
export function generateMoodleUsername(firstName: string, lastName: string): string {
  const sanitize = (s: string) =>
    s.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')   // Remove diacritics
      .replace(/[^a-z0-9]/g, '')          // Only alphanumeric
      .slice(0, 20)                        // Max 20 chars per part

  return `${sanitize(firstName)}.${sanitize(lastName)}`
}

/**
 * Generate a secure temporary password.
 * 12 chars meeting Moodle default policy: upper, lower, digit, non-alphanumeric.
 */
export function generateTempPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghjkmnpqrstuvwxyz'
  const digits = '23456789'
  const symbols = '!@#$%&*?-'
  const all = upper + lower + digits + symbols

  const pick = (set: string) => set[Math.floor(Math.random() * set.length)]

  const parts = [
    pick(upper),
    pick(upper),
    pick(lower),
    pick(lower),
    pick(lower),
    pick(lower),
    pick(digits),
    pick(digits),
    pick(symbols),
    pick(all),
    pick(all),
    pick(all),
  ]

  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [parts[i], parts[j]] = [parts[j], parts[i]]
  }

  return parts.join('')
}
