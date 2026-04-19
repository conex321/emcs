import path from 'node:path'
import process from 'node:process'
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'
const supabaseUrl = process.env.TEST_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('TEST_SUPABASE_URL and TEST_SUPABASE_SERVICE_ROLE_KEY are required.')
  process.exit(1)
}

const adminDb = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const ts = Date.now()
const couponCode = `WORKFLOW100DOC${ts}`
const parentEmail = `matthew+doc-parent-${ts}@schoolconex.com`
const studentEmail = `matthew+doc-student-${ts}@schoolconex.com`
const adminEmail = `matthew+doc-admin-${ts}@schoolconex.com`
const parentPassword = `Parent!${ts}Aa`
const adminPassword = `Admin!${ts}Bb`
const studentFirstName = 'Documented'
const studentLastName = `Learner${String(ts).slice(-4)}`
const parentFirstName = 'Portal'
const parentLastName = `Guardian${String(ts).slice(-4)}`
const transcriptFile = path.resolve('/Users/matthews/EMCS/audit-home.png')
const idFile = path.resolve('/Users/matthews/EMCS/audit-courses.png')

const browserErrors = []
let browser
let order = null
let studentRow = null
let parentProfile = null
let adminProfile = null
let studentProfile = null
let documentRows = []
let emailRows = []
let auditRows = []

function log(step, details) {
  console.log(`\n[${step}] ${details}`)
}

async function poll(fn, { timeoutMs = 30000, intervalMs = 1000, label = 'condition' } = {}) {
  const started = Date.now()
  let lastError = null

  while (Date.now() - started < timeoutMs) {
    try {
      const result = await fn()
      if (result) return result
    } catch (error) {
      lastError = error
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  if (lastError) throw lastError
  throw new Error(`Timed out waiting for ${label}`)
}

function attachDiagnostics(context, name) {
  context.on('page', (page) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        browserErrors.push(`${name} console error: ${msg.text()}`)
      }
    })

    page.on('pageerror', (error) => {
      browserErrors.push(`${name} page error: ${error.message}`)
    })

    page.on('requestfailed', (request) => {
      browserErrors.push(
        `${name} request failed: ${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'unknown'}`
      )
    })
  })
}

async function createAdminUser() {
  const { data, error } = await adminDb.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { full_name: 'Document Workflow Admin', role: 'school_admin' },
  })

  if (error) throw error

  const { error: profileError } = await adminDb.from('profiles').upsert({
    id: data.user.id,
    full_name: 'Document Workflow Admin',
    email: adminEmail,
    role: 'school_admin',
  }, { onConflict: 'id' })

  if (profileError) throw profileError

  return data.user
}

async function setup() {
  log('setup', 'Creating disposable coupon and school admin account')

  const { error: couponError } = await adminDb.from('coupons').insert({
    code: couponCode,
    description: '100% document workflow test coupon',
    type: 'percent',
    value: 100,
    max_discount: 100,
    max_uses: 1,
    use_count: 0,
    is_active: true,
    starts_at: new Date(Date.now() - 60_000).toISOString(),
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  })

  if (couponError) throw couponError

  const adminUser = await createAdminUser()
  adminProfile = { id: adminUser.id, email: adminEmail }
}

async function cleanup() {
  log('cleanup', 'Removing disposable rows and storage objects')

  try {
    const profileResult = await adminDb
      .from('profiles')
      .select('id, email, role')
      .in('email', [parentEmail, studentEmail, adminEmail])

    const profiles = profileResult.data || []
    parentProfile = profiles.find((item) => item.email === parentEmail) || parentProfile
    studentProfile = profiles.find((item) => item.email === studentEmail) || studentProfile
    adminProfile = profiles.find((item) => item.email === adminEmail) || adminProfile

    const { data: students } = await adminDb
      .from('students')
      .select('id, email')
      .in('email', [studentEmail])

    studentRow = students?.[0] || studentRow

    if (studentRow?.id) {
      const { data } = await adminDb
        .from('student_documents')
        .select('id, file_path')
        .eq('student_id', studentRow.id)

      documentRows = data || documentRows
    }

    if (order?.id) {
      const { data } = await adminDb
        .from('student_documents')
        .select('id, file_path')
        .eq('order_id', order.id)

      documentRows = data || documentRows
    }

    const paths = [...new Set((documentRows || []).map((row) => row.file_path).filter(Boolean))]
    if (paths.length > 0) {
      await adminDb.storage.from('student-documents').remove(paths)
    }

    const targetIds = [studentRow?.id, parentProfile?.id, studentProfile?.id, adminProfile?.id, order?.id].filter(Boolean)
    if (targetIds.length > 0) {
      const { data } = await adminDb
        .from('audit_log')
        .select('id')
        .or(targetIds.map((id) => `target_id.eq.${id}`).join(','))

      auditRows = data || auditRows
    }

    const emailCandidates = [parentEmail, studentEmail, adminEmail, 'admin@canadaemcs.com']
    const { data: emailData } = await adminDb
      .from('email_log')
      .select('id, recipient, metadata')
      .in('recipient', emailCandidates)

    emailRows = (emailData || []).filter((row) => {
      const blob = JSON.stringify(row.metadata || {})
      return (
        blob.includes(studentEmail) ||
        blob.includes(parentEmail) ||
        blob.includes(order?.id || '') ||
        row.recipient === parentEmail ||
        row.recipient === studentEmail ||
        row.recipient === adminEmail
      )
    })

    if (auditRows.length > 0) {
      await adminDb.from('audit_log').delete().in('id', auditRows.map((row) => row.id))
    }

    if (emailRows.length > 0) {
      await adminDb.from('email_log').delete().in('id', emailRows.map((row) => row.id))
    }

    if (order?.id) {
      await adminDb.from('student_documents').delete().eq('order_id', order.id)
      await adminDb.from('enrollments').delete().eq('student_id', studentRow?.id || '00000000-0000-0000-0000-000000000000')
      await adminDb.from('order_items').delete().eq('order_id', order.id)
      await adminDb.from('orders').delete().eq('id', order.id)
    }

    if (studentRow?.id) {
      await adminDb.from('students').delete().eq('id', studentRow.id)
    }

    await adminDb.from('coupons').delete().eq('code', couponCode)

    const authIds = [parentProfile?.id, studentProfile?.id, adminProfile?.id].filter(Boolean)
    for (const userId of authIds) {
      await adminDb.auth.admin.deleteUser(userId)
    }
  } catch (error) {
    console.error('Cleanup failed:', error)
  }
}

async function verifyNoHashLinks(page, label) {
  const count = await page.locator('a[href="#"]').count()
  if (count > 0) {
    throw new Error(`${label} still contains ${count} placeholder # links`)
  }
}

async function fillGroupInput(page, labelText, value) {
  const group = page.locator('.form-group').filter({ has: page.locator('label', { hasText: labelText }) }).first()
  await group.locator('input').first().fill(value)
}

async function selectGroupValue(page, labelText, value) {
  const group = page.locator('.form-group').filter({ has: page.locator('label', { hasText: labelText }) }).first()
  await group.locator('select').first().selectOption(value)
}

try {
  await setup()

  browser = await chromium.launch({ headless: true })

  const parentContext = await browser.newContext()
  attachDiagnostics(parentContext, 'parent-flow')
  const parentPage = await parentContext.newPage()

  log('parent', 'Selecting ENG1D and moving into checkout')
  await parentPage.goto(`${baseUrl}/official-ontario/course/ENG1D`, { waitUntil: 'networkidle' })
  await parentPage.getByRole('button', { name: 'Add to Cart' }).click()
  await parentPage.getByRole('link', { name: 'View Cart' }).click()
  await parentPage.locator('.coupon-input-group input').fill(couponCode)
  await parentPage.getByRole('button', { name: 'Apply' }).click()
  await parentPage.locator('.coupon-success').waitFor({ timeout: 10000 })
  await parentPage.getByRole('link', { name: /Proceed/i }).click()
  await parentPage.locator('h2').filter({ hasText: 'Review Your Order' }).waitFor({ timeout: 10000 })
  await verifyNoHashLinks(parentPage, 'Checkout step 1')
  await parentPage.getByRole('button', { name: /Continue/i }).click()

  log('parent', 'Completing details and uploading proof documents')
  await fillGroupInput(parentPage, 'First Name', parentFirstName)
  await fillGroupInput(parentPage, 'Last Name', parentLastName)
  await fillGroupInput(parentPage, 'Email', parentEmail)
  await fillGroupInput(parentPage, 'Phone', '+1 416 555 0132')
  await parentPage.locator('.account-creation-section .checkbox-label input').check()
  await parentPage.locator('.account-creation-section input[type="password"]').fill(parentPassword)
  await fillGroupInput(parentPage, 'Student First Name', studentFirstName)
  await fillGroupInput(parentPage, 'Student Last Name', studentLastName)
  await fillGroupInput(parentPage, 'Student Email', studentEmail)
  await selectGroupValue(parentPage, 'Current Grade', '10')
  await fillGroupInput(parentPage, 'Previous School', 'Workflow Collegiate')
  const fileInputs = parentPage.locator('input[type="file"]')
  await fileInputs.nth(0).setInputFiles(transcriptFile)
  await fileInputs.nth(1).setInputFiles(idFile)
  await parentPage.getByRole('button', { name: /Continue/i }).click()

  log('parent', 'Submitting free order and waiting for confirmation')
  await parentPage.locator('.agreements .checkbox-label input').first().check()
  await parentPage.getByRole('button', { name: 'Complete Enrollment' }).click()
  await parentPage.locator('.order-number').waitFor({ timeout: 60000 })
  const orderNumberText = (await parentPage.locator('.order-number').textContent())?.trim() || ''
  log('parent', `Checkout succeeded with ${orderNumberText}`)

  await parentPage.getByRole('link', { name: /Go to Your Portal/i }).click()
  await parentPage.waitForURL(/\/portal\/parent/, { timeout: 30000 })
  await parentPage.locator('.portal-header').waitFor({ timeout: 20000 })
  await parentPage.reload({ waitUntil: 'networkidle' })
  await parentPage.locator('.portal-header').waitFor({ timeout: 20000 })

  log('db', 'Verifying order, student, enrollment, and uploaded document rows')
  parentProfile = await poll(async () => {
    const { data } = await adminDb.from('profiles').select('id, email').eq('email', parentEmail).maybeSingle()
    return data || null
  }, { label: 'parent profile' })

  order = await poll(async () => {
    const { data } = await adminDb
      .from('orders')
      .select('id, order_number, status, total, parent_id')
      .eq('parent_id', parentProfile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    return data || null
  }, { label: 'created order' })

  studentRow = await poll(async () => {
    const { data } = await adminDb
      .from('students')
      .select('id, email, first_name, last_name, is_active, moodle_credentials_generated, registration_email_sent')
      .eq('email', studentEmail)
      .maybeSingle()

    return data || null
  }, { label: 'student row' })

  const { data: enrollmentRows, error: enrollmentsError } = await adminDb
    .from('enrollments')
    .select('id, status, student_id, order_item_id')
    .eq('student_id', studentRow.id)

  if (enrollmentsError) throw enrollmentsError
  if (!enrollmentRows?.length) throw new Error('No enrollment rows were created')

  documentRows = await poll(async () => {
    const { data } = await adminDb
      .from('student_documents')
      .select('id, student_id, order_id, document_type, file_name, file_path, status')
      .eq('order_id', order.id)
      .order('created_at', { ascending: true })

    return data?.length ? data : null
  }, { label: 'student documents' })

  if (documentRows.length !== 2) {
    throw new Error(`Expected 2 uploaded student documents, found ${documentRows.length}`)
  }

  if (documentRows.some((row) => row.student_id !== studentRow.id || row.status !== 'linked')) {
    throw new Error(`Uploaded documents were not linked to the created student correctly: ${JSON.stringify(documentRows)}`)
  }

  const { data: storageEntries, error: storageError } = await adminDb.storage
    .from('student-documents')
    .list(`${order.id}/0`, { limit: 20 })

  if (storageError) throw storageError
  if ((storageEntries || []).length !== 2) {
    throw new Error(`Expected 2 storage objects, found ${(storageEntries || []).length}`)
  }

  log('parent', 'Opening parent-access student portal and confirming document visibility')
  await parentPage.goto(`${baseUrl}/portal/student`, { waitUntil: 'networkidle' })
  await parentPage.locator('h1').filter({ hasText: 'Welcome back' }).waitFor({ timeout: 20000 })
  for (const document of documentRows) {
    await parentPage.getByText(document.file_name).waitFor({ timeout: 20000 })
  }
  await verifyNoHashLinks(parentPage, 'Student portal')

  log('admin', 'Logging in as school admin and reviewing the registration documents')
  const adminContext = await browser.newContext()
  attachDiagnostics(adminContext, 'admin-flow')
  const adminPage = await adminContext.newPage()
  await adminPage.goto(`${baseUrl}/auth`, { waitUntil: 'networkidle' })
  await adminPage.fill('#login-email', adminEmail)
  await adminPage.fill('#login-password', adminPassword)
  await adminPage.locator('form.auth-form').getByRole('button', { name: 'Sign In' }).click()
  await adminPage.waitForURL(/\/admin\/dashboard/, { timeout: 30000 })
  await adminPage.goto(`${baseUrl}/admin`, { waitUntil: 'networkidle' })
  await adminPage.waitForURL(/\/admin\/dashboard/, { timeout: 30000 })
  await adminPage.getByRole('button', { name: 'Documents' }).click()
  const docPathMatches = adminPage.locator('.admin-doc-path').filter({ hasText: order.id })
  const docPathCount = await docPathMatches.count()
  if (docPathCount < 2) {
    throw new Error(`Expected at least 2 admin document paths for ${order.id}, found ${docPathCount}`)
  }

  await adminPage.getByRole('button', { name: 'Registrations' }).click()
  const registrationCard = adminPage.locator('.admin-registration-card', { hasText: studentEmail }).first()
  await registrationCard.waitFor({ timeout: 20000 })
  await registrationCard.getByRole('button', { name: 'Approve' }).click()
  await adminPage.getByText('is approved and ready for active enrollment').waitFor({ timeout: 20000 })
  await registrationCard.getByRole('button', { name: 'Create Portal Account' }).click()
  await registrationCard.locator('.admin-temp-password code').waitFor({ timeout: 20000 })
  const studentPassword = (await registrationCard.locator('.admin-temp-password code').textContent())?.trim()
  if (!studentPassword) throw new Error('Student temporary password was not shown in the admin dashboard')
  await registrationCard.getByRole('button', { name: 'Email Student' }).click()
  await adminPage.getByText(`Registration email sent to ${studentEmail}`).waitFor({ timeout: 20000 })
  await verifyNoHashLinks(adminPage, 'Admin dashboard')

  log('db', 'Verifying admin-side effects and email activity')
  const { data: studentAfterAdmin, error: studentAfterAdminError } = await adminDb
    .from('students')
    .select('id, is_active, registration_email_sent, moodle_credentials_generated')
    .eq('id', studentRow.id)
    .single()

  if (studentAfterAdminError) throw studentAfterAdminError
  if (!studentAfterAdmin.is_active) throw new Error('Student was not approved by the admin action')

  studentProfile = await poll(async () => {
    const { data } = await adminDb.from('profiles').select('id, email, role').eq('email', studentEmail).maybeSingle()
    return data || null
  }, { label: 'student portal profile' })

  if (studentProfile.role !== 'student') {
    throw new Error(`Expected created portal profile to have role student, got ${studentProfile.role}`)
  }

  const { data: rawEmailRows } = await adminDb
    .from('email_log')
    .select('id, recipient, template, status, metadata')
    .in('recipient', [parentEmail, studentEmail, 'admin@canadaemcs.com'])
    .order('created_at', { ascending: false })

  emailRows = (rawEmailRows || []).filter((row) => {
    const blob = JSON.stringify(row.metadata || {})
    return blob.includes(studentEmail) || blob.includes(parentEmail) || row.recipient === parentEmail || row.recipient === studentEmail
  })

  const { data: auditData, error: auditError } = await adminDb
    .from('audit_log')
    .select('id, action, actor_id, target_id')
    .eq('actor_id', adminProfile.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (auditError) throw auditError

  auditRows = (auditData || []).filter((row) => row.target_id === studentRow.id || row.target_id === studentProfile.id)
  const actions = auditRows.map((row) => row.action)
  for (const requiredAction of ['student.approve', 'student.registration_email.send', 'user.create']) {
    if (!actions.includes(requiredAction)) {
      throw new Error(`Missing audit action ${requiredAction}`)
    }
  }

  log('student', 'Logging in with the admin-created student portal account')
  const studentContext = await browser.newContext()
  attachDiagnostics(studentContext, 'student-flow')
  const studentPage = await studentContext.newPage()
  await studentPage.goto(`${baseUrl}/auth`, { waitUntil: 'networkidle' })
  await studentPage.fill('#login-email', studentEmail)
  await studentPage.fill('#login-password', studentPassword)
  await studentPage.locator('form.auth-form').getByRole('button', { name: 'Sign In' }).click()
  await studentPage.waitForURL(/\/portal\/student/, { timeout: 30000 })
  await studentPage.locator('h1').filter({ hasText: 'Welcome back' }).waitFor({ timeout: 20000 })
  await studentPage.getByText('ENG1D').waitFor({ timeout: 20000 })
  for (const document of documentRows) {
    await studentPage.getByText(document.file_name).waitFor({ timeout: 20000 })
  }
  await studentPage.reload({ waitUntil: 'networkidle' })
  await studentPage.getByText('ENG1D').waitFor({ timeout: 20000 })
  await verifyNoHashLinks(studentPage, 'Student direct portal')

  const result = {
    couponCode,
    parentEmail,
    studentEmail,
    adminEmail,
    orderNumber: order.order_number,
    orderId: order.id,
    studentId: studentRow.id,
    documentCount: documentRows.length,
    documentFiles: documentRows.map((row) => row.file_name),
    emailTemplates: emailRows.map((row) => ({ recipient: row.recipient, template: row.template, status: row.status })),
    auditActions: [...new Set(actions)],
    browserErrors,
  }

  console.log('\nRESULT_JSON_START')
  console.log(JSON.stringify(result, null, 2))
  console.log('RESULT_JSON_END')

  await parentContext.close()
  await adminContext.close()
  await studentContext.close()
  await browser.close()
  browser = null
  await cleanup()
} catch (error) {
  console.error('\nTEST_FAILED:', error)
  if (browser) {
    await browser.close().catch(() => {})
  }
  await cleanup()
  process.exitCode = 1
}
