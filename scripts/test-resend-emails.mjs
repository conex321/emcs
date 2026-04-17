#!/usr/bin/env node
// ============================================================
// EMCS: Local Test Script — Send Test Emails via Resend
// Usage: RESEND_API_KEY=re_xxx node scripts/test-resend-emails.mjs
// Purpose: End-to-end test without deploying Edge Functions
// ============================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY
if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY env var. Export it before running this script.')
    process.exit(1)
}
const TEST_EMAIL = 'matthew@schoolconex.com'
const ADMIN_EMAIL = 'admin@canadaemcs.com'
const FROM = 'Toronto EMCS <noreply@noreply.canadaemcs.com>'

const SUPABASE_URL = 'https://gbclamtkotqcdcgveget.supabase.co'

// ── Helpers ──────────────────────────────────────────────────

function generateMoodleUsername(first, last) {
  const sanitize = (s) =>
    s.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20)
  return `${sanitize(first)}.${sanitize(last)}`
}

function generateTempPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghjkmnpqrstuvwxyz'
  const digits = '23456789'
  const all = upper + lower + digits
  const pick = (set) => set[Math.floor(Math.random() * set.length)]
  const parts = [
    pick(upper), pick(upper),
    pick(lower), pick(lower), pick(lower), pick(lower),
    pick(digits), pick(digits),
    pick(all), pick(all), pick(all), pick(all),
  ]
  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [parts[i], parts[j]] = [parts[j], parts[i]]
  }
  return parts.join('')
}

async function sendEmail({ to, subject, html, tags }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      tags,
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    return { success: false, error: data?.message || data?.error || `HTTP ${res.status}` }
  }
  return { success: true, resend_id: data.id }
}

// ── Email Templates (inline for standalone execution) ─────────

const LMS_URL = 'https://app.canadaemcs.com'

function baseLayout(body) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>EMCS</title>
<style>
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
body{margin:0;padding:0;width:100%!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a1a2e}
img{border:0;max-width:100%}table{border-collapse:collapse!important}
.container{max-width:600px;margin:0 auto;background:#fff}
.header{background:linear-gradient(135deg,#0f3460 0%,#16213e 100%);padding:32px 40px;text-align:center}
.header img{width:80px;height:auto;margin-bottom:12px}
.header h1{color:#fff;font-size:22px;font-weight:700;margin:0;letter-spacing:.5px}
.body-content{padding:40px}
.greeting{font-size:20px;font-weight:600;color:#0f3460;margin:0 0 20px}
.info-card{background:#f8f9fc;border:1px solid #e8eaf0;border-radius:12px;padding:24px;margin:24px 0}
.info-card h3{margin:0 0 12px;font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:600}
.course-item{padding:12px 16px;border-left:4px solid #e94560;background:#fef7f8;border-radius:0 8px 8px 0;margin:8px 0}
.course-name{font-weight:600;color:#1a1a2e;font-size:15px}
.course-code{font-size:13px;color:#6b7280}
.course-price{font-weight:600;color:#0f3460;font-size:14px}
.bundled-tag{display:inline-block;background:#10b981;color:#fff;font-size:11px;padding:2px 8px;border-radius:4px;font-weight:600}
.total-row{padding:16px 0;border-top:2px solid #0f3460;margin-top:16px}
.cta-button{display:inline-block;background:linear-gradient(135deg,#e94560 0%,#c73e54 100%);color:#fff!important;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px;margin:24px 0}
.warning-box{background:#fffbeb;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin:16px 0;font-size:14px;color:#92400e}
.footer{background:#f8f9fc;padding:24px 40px;text-align:center;border-top:1px solid #e8eaf0}
.footer p{font-size:13px;color:#9ca3af;margin:4px 0}
.footer a{color:#0f3460;text-decoration:none}
</style></head>
<body style="background-color:#eef0f5;padding:20px 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<div class="container" style="border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
${body}
</div></td></tr></table></body></html>`
}

function receiptEmail(data) {
  const courseRows = data.courses.map(c => `
    <div class="course-item">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div><div class="course-name">${c.title}</div><div class="course-code">${c.code}</div></div>
        <div>${c.bundled ? '<span class="bundled-tag">BUNDLED FREE</span>' : `<span class="course-price">$${c.price.toFixed(2)}</span>`}</div>
      </div>
    </div>`).join('')

  return baseLayout(`
    <div class="header"><div style="font-family:'Outfit',-apple-system,BlinkMacSystemFont,sans-serif;font-size:32px;font-weight:700;letter-spacing:2px;color:#fff;margin-bottom:8px">EMCS</div><h1>Purchase Confirmation</h1></div>
    <div class="body-content">
      <p class="greeting">Hello ${data.name}!</p>
      <p>Thank you for your purchase with <strong>Toronto EMCS</strong>. Your order has been confirmed.</p>
      <div class="info-card"><h3>Order Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:6px 0;font-weight:600;color:#374151;font-size:14px">Order Number</td><td style="padding:6px 0;text-align:right;color:#0f3460;font-weight:600">${data.orderNumber}</td></tr>
          <tr><td style="padding:6px 0;font-weight:600;color:#374151;font-size:14px">Date</td><td style="padding:6px 0;text-align:right;color:#374151">${data.date}</td></tr>
        </table>
      </div>
      <div class="info-card"><h3>Courses Enrolled</h3>${courseRows}
        <div class="total-row" style="display:flex;justify-content:space-between">
          <span style="font-weight:700;font-size:18px;color:#0f3460">Total</span>
          <span style="font-weight:700;font-size:18px;color:#e94560">$${data.total.toFixed(2)} CAD</span>
        </div>
      </div>
      <div class="info-card"><h3>What's Next?</h3>
        <p>1. You will receive a separate email with your <strong>LMS login credentials</strong> shortly.</p>
        <p>2. Log in to the LMS to access your course materials and begin learning.</p>
        <p>3. Review your course schedule in your LMS dashboard.</p>
      </div>
      <p style="font-size:14px;color:#6b7280">Questions? Contact <a href="mailto:support@canadaemcs.com" style="color:#0f3460;font-weight:600">support@canadaemcs.com</a></p>
    </div>
    <div class="footer"><p><strong>Toronto EMCS</strong></p><p><a href="https://canadaemcs.com">canadaemcs.com</a></p><p style="margin-top:12px;font-size:12px">Automated email — please do not reply</p></div>`)
}

function registrationEmail(data) {
  return baseLayout(`
    <div class="header"><div style="font-family:'Outfit',-apple-system,BlinkMacSystemFont,sans-serif;font-size:32px;font-weight:700;letter-spacing:2px;color:#fff;margin-bottom:8px">EMCS</div><h1>Welcome to EMCS!</h1></div>
    <div class="body-content">
      <p class="greeting">Hello ${data.firstName}! 👋</p>
      <p>Welcome to <strong>Toronto EMCS</strong>! Your account has been created and you're all set to start learning.</p>
      <div class="info-card"><h3>Your Course</h3>
        <div class="course-item"><div class="course-name">${data.courseName}</div><div class="course-code">${data.courseCode}</div></div>
      </div>
      <div class="info-card" style="border-color:#0f3460;border-width:2px"><h3>🔐 Your LMS Login Credentials</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8eaf0;font-weight:600;color:#374151;font-size:14px">LMS URL</td><td style="padding:10px 0;text-align:right;border-bottom:1px solid #e8eaf0"><a href="${LMS_URL}" style="color:#0f3460;font-weight:600">${LMS_URL}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e8eaf0;font-weight:600;color:#374151;font-size:14px">Username</td><td style="padding:10px 0;text-align:right;border-bottom:1px solid #e8eaf0"><span style="color:#0f3460;font-family:'Courier New',monospace;font-size:15px;font-weight:600;background:#eef0f5;padding:4px 10px;border-radius:4px">${data.username}</span></td></tr>
          <tr><td style="padding:10px 0;font-weight:600;color:#374151;font-size:14px">Password</td><td style="padding:10px 0;text-align:right"><span style="color:#e94560;font-family:'Courier New',monospace;font-size:15px;font-weight:600;background:#fef7f8;padding:4px 10px;border-radius:4px">${data.password}</span></td></tr>
        </table>
      </div>
      <div class="warning-box">⚠️ <strong>Important:</strong> Please change your password after your first login for security purposes.</div>
      <div style="text-align:center"><a href="${LMS_URL}" class="cta-button">Log In to Your LMS →</a></div>
      <div class="info-card"><h3>Getting Started</h3>
        <p>1. Click the button above or visit <a href="${LMS_URL}" style="color:#0f3460;font-weight:600">${LMS_URL}</a></p>
        <p>2. Enter your username and password</p>
        <p>3. Change your password when prompted</p>
        <p>4. Navigate to your course dashboard and begin learning!</p>
      </div>
      <p style="font-size:14px;color:#6b7280">Need help? Contact <a href="mailto:support@canadaemcs.com" style="color:#0f3460;font-weight:600">support@canadaemcs.com</a></p>
    </div>
    <div class="footer"><p><strong>Toronto EMCS</strong></p><p><a href="https://canadaemcs.com">canadaemcs.com</a></p><p style="margin-top:12px;font-size:12px">Automated email — please do not reply</p></div>`)
}

function adminEmail(data) {
  return baseLayout(`
    <div class="header" style="background:linear-gradient(135deg,#1e3a5f 0%,#0f3460 100%)"><div style="font-family:'Outfit',-apple-system,BlinkMacSystemFont,sans-serif;font-size:32px;font-weight:700;letter-spacing:2px;color:#fff;margin-bottom:8px">EMCS</div><h1>New Student Registration</h1></div>
    <div class="body-content">
      <p class="greeting">Admin Notification</p>
      <p>A new student has been registered following a successful course purchase.</p>
      <div class="info-card"><h3>Student Information</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;font-weight:600;color:#374151;font-size:14px">Name</td><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;text-align:right;color:#0f3460;font-weight:600">${data.name}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;font-weight:600;color:#374151;font-size:14px">Email</td><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;text-align:right">${data.email}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;font-weight:600;color:#374151;font-size:14px">LMS Username</td><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;text-align:right;font-family:'Courier New',monospace;color:#0f3460;font-weight:600">${data.username}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;font-weight:600;color:#374151;font-size:14px">Course</td><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;text-align:right">${data.course}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;font-weight:600;color:#374151;font-size:14px">Order</td><td style="padding:8px 0;border-bottom:1px solid #e8eaf0;text-align:right;font-weight:600">${data.orderNumber}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;color:#374151;font-size:14px">Registered</td><td style="padding:8px 0;text-align:right">${data.registeredAt}</td></tr>
        </table>
      </div>
      <p style="font-size:14px;color:#6b7280"><strong>Action Required:</strong> Verify the student account has been provisioned in Moodle and course enrollment is active.</p>
    </div>
    <div class="footer"><p><strong>EMCS Admin System</strong></p><p style="font-size:12px">Automated admin notification from CanadaEMCS.com</p></div>`)
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════')
  console.log('  EMCS Post-Purchase Email Test')
  console.log(`  Target: ${TEST_EMAIL}`)
  console.log('═══════════════════════════════════════════════\n')

  const username = generateMoodleUsername('Matthew', 'Test')
  const password = generateTempPassword()
  const orderNumber = `EMCS-TEST-${Date.now()}`
  const date = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

  console.log(`Generated credentials: ${username} / ${password}`)
  console.log(`Test order: ${orderNumber}\n`)

  // 1. Purchase Receipt
  console.log('📧 [1/3] Sending purchase receipt...')
  const r1 = await sendEmail({
    to: TEST_EMAIL,
    subject: `EMCS Purchase Confirmed — Order ${orderNumber}`,
    html: receiptEmail({
      name: 'Matthew',
      orderNumber,
      date,
      courses: [
        { code: 'ENG4U', title: 'English, Grade 12, University', price: 1500, bundled: false },
        { code: 'MHF4U', title: 'Advanced Functions, Grade 12', price: 1500, bundled: false },
        { code: 'MCV4U', title: 'Calculus and Vectors, Grade 12', price: 0, bundled: true },
      ],
      total: 3000,
    }),
    tags: [{ name: 'email_type', value: 'purchase_receipt' }, { name: 'test', value: 'true' }],
  })
  console.log(`   ${r1.success ? '✅ Sent' : '❌ Failed'} — ${r1.resend_id || r1.error}\n`)

  // 2. Registration / LMS Credentials
  console.log('📧 [2/3] Sending registration / LMS credentials...')
  const r2 = await sendEmail({
    to: TEST_EMAIL,
    subject: 'Welcome to EMCS — Your LMS Login Credentials',
    html: registrationEmail({
      firstName: 'Matthew',
      lastName: 'Test',
      courseName: 'English, Grade 12, University',
      courseCode: 'ENG4U',
      username,
      password,
    }),
    tags: [{ name: 'email_type', value: 'registration' }, { name: 'test', value: 'true' }],
  })
  console.log(`   ${r2.success ? '✅ Sent' : '❌ Failed'} — ${r2.resend_id || r2.error}\n`)

  // 3. Admin Notification
  console.log('📧 [3/3] Sending admin notification...')
  const r3 = await sendEmail({
    to: ADMIN_EMAIL,
    subject: '[EMCS Admin] New Registration — Matthew Test',
    html: adminEmail({
      name: 'Matthew Test',
      email: TEST_EMAIL,
      username,
      course: 'English, Grade 12, University (ENG4U)',
      orderNumber,
      registeredAt: new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' }),
    }),
    tags: [{ name: 'email_type', value: 'admin_notification' }, { name: 'test', value: 'true' }],
  })
  console.log(`   ${r3.success ? '✅ Sent' : '❌ Failed'} — ${r3.resend_id || r3.error}\n`)

  // Summary
  console.log('═══════════════════════════════════════════════')
  console.log('  RESULTS')
  console.log('═══════════════════════════════════════════════')
  console.log(`  Purchase Receipt:  ${r1.success ? '✅' : '❌'}  ${r1.resend_id || r1.error}`)
  console.log(`  Registration:      ${r2.success ? '✅' : '❌'}  ${r2.resend_id || r2.error}`)
  console.log(`  Admin Notif:       ${r3.success ? '✅' : '❌'}  ${r3.resend_id || r3.error}`)
  console.log(`\n  LMS Username: ${username}`)
  console.log(`  LMS Password: ${password}`)
  console.log('═══════════════════════════════════════════════')

  const allOk = r1.success && r2.success && r3.success
  if (allOk) {
    console.log('\n🎉 All emails sent! Check matthew@schoolconex.com inbox.')
  } else {
    console.log('\n⚠️  Some emails failed. Check errors above.')
  }
}

main().catch(console.error)
