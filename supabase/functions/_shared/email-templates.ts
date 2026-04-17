// ============================================================
// EMCS Shared: HTML Email Templates
// Brand: Toronto EMCS / CanadaEMCS.com
// ============================================================

const MOODLE_LMS_URL = 'https://app.canadaemcs.com'
const SUPPORT_EMAIL = 'support@canadaemcs.com'
const WEBSITE_URL = 'https://canadaemcs.com'

// ─── Base Layout ─────────────────────────────────────────────
function baseLayout(bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EMCS</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    body { margin: 0; padding: 0; width: 100% !important; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; max-width: 100%; }
    table { border-collapse: collapse !important; }

    /* Typography */
    body, td {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a2e;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }

    .header {
      background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
      padding: 32px 40px;
      text-align: center;
    }

    .header img {
      width: 80px;
      height: auto;
      margin-bottom: 12px;
    }

    .header h1 {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.5px;
    }

    .body-content {
      padding: 40px;
    }

    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #0f3460;
      margin: 0 0 20px 0;
    }

    .info-card {
      background: #f8f9fc;
      border: 1px solid #e8eaf0;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }

    .info-card h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #6b7280;
      font-weight: 600;
    }

    .credential-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #e8eaf0;
    }

    .credential-row:last-child {
      border-bottom: none;
    }

    .credential-label {
      font-weight: 600;
      color: #374151;
      min-width: 120px;
      font-size: 14px;
    }

    .credential-value {
      color: #0f3460;
      font-family: 'Courier New', monospace;
      font-size: 15px;
      font-weight: 600;
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
    }

    .course-item {
      padding: 12px 16px;
      border-left: 4px solid #e94560;
      background: #fef7f8;
      border-radius: 0 8px 8px 0;
      margin: 8px 0;
    }

    .course-name {
      font-weight: 600;
      color: #1a1a2e;
      font-size: 15px;
    }

    .course-code {
      font-size: 13px;
      color: #6b7280;
    }

    .course-price {
      font-weight: 600;
      color: #0f3460;
      font-size: 14px;
    }

    .bundled-tag {
      display: inline-block;
      background: #10b981;
      color: #fff;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 16px 0;
      border-top: 2px solid #0f3460;
      margin-top: 16px;
    }

    .total-label {
      font-weight: 700;
      font-size: 18px;
      color: #0f3460;
    }

    .total-amount {
      font-weight: 700;
      font-size: 18px;
      color: #e94560;
    }

    .steps-list {
      counter-reset: steps;
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }

    .steps-list li {
      counter-increment: steps;
      padding: 10px 0 10px 48px;
      position: relative;
      border-bottom: 1px solid #f0f1f3;
    }

    .steps-list li::before {
      content: counter(steps);
      position: absolute;
      left: 0;
      top: 8px;
      width: 32px;
      height: 32px;
      background: #0f3460;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 32px;
      text-align: center;
    }

    .footer {
      background: #f8f9fc;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e8eaf0;
    }

    .footer p {
      font-size: 13px;
      color: #9ca3af;
      margin: 4px 0;
    }

    .footer a {
      color: #0f3460;
      text-decoration: none;
    }

    .warning-box {
      background: #fffbeb;
      border: 1px solid #fbbf24;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      font-size: 14px;
      color: #92400e;
    }

    @media screen and (max-width: 600px) {
      .body-content { padding: 24px 20px; }
      .header { padding: 24px 20px; }
      .footer { padding: 20px; }
    }
  </style>
</head>
<body style="background-color: #eef0f5; padding: 20px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="container" style="border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          ${bodyContent}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Purchase Receipt Template ───────────────────────────────

interface CourseItem {
  course_code: string
  course_title: string
  price: number
  is_bundled: boolean
}

interface PurchaseReceiptData {
  parentFirstName: string
  orderNumber: string
  orderDate: string
  courses: CourseItem[]
  subtotal: number
  discount: number
  total: number
  currency: string
}

export function buildPurchaseReceiptEmail(data: PurchaseReceiptData): string {
  const courseRows = data.courses
    .map(
      (c) => `
        <div class="course-item">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="course-name">${c.course_title}</div>
              <div class="course-code">${c.course_code}</div>
            </div>
            <div>
              ${
                c.is_bundled
                  ? '<span class="bundled-tag">BUNDLED FREE</span>'
                  : `<span class="course-price">$${c.price.toFixed(2)}</span>`
              }
            </div>
          </div>
        </div>`
    )
    .join('')

  const bodyContent = `
    <!-- Header -->
    <div class="header">
      <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.08em; color: #1B4332;">EMCS</div>
      <h1>Purchase Confirmation</h1>
    </div>

    <!-- Body -->
    <div class="body-content">
      <p class="greeting">Hello ${data.parentFirstName}!</p>
      <p>Thank you for your purchase with <strong>Toronto EMCS</strong>. Your order has been confirmed and is being processed.</p>

      <!-- Order Summary -->
      <div class="info-card">
        <h3>Order Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #374151; font-size: 14px;">Order Number</td>
            <td style="padding: 6px 0; text-align: right; color: #0f3460; font-weight: 600;">${data.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #374151; font-size: 14px;">Date</td>
            <td style="padding: 6px 0; text-align: right; color: #374151;">${data.orderDate}</td>
          </tr>
        </table>
      </div>

      <!-- Courses -->
      <div class="info-card">
        <h3>Courses Enrolled</h3>
        ${courseRows}

        ${
          data.discount > 0
            ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
              <tr>
                <td style="padding: 4px 0; color: #6b7280; font-size: 14px;">Subtotal</td>
                <td style="padding: 4px 0; text-align: right; color: #374151;">$${data.subtotal.toFixed(2)} ${data.currency}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #10b981; font-size: 14px; font-weight: 600;">Discount</td>
                <td style="padding: 4px 0; text-align: right; color: #10b981; font-weight: 600;">-$${data.discount.toFixed(2)} ${data.currency}</td>
              </tr>
            </table>`
            : ''
        }

        <div class="total-row">
          <span class="total-label">Total</span>
          <span class="total-amount">$${data.total.toFixed(2)} ${data.currency}</span>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="info-card">
        <h3>What's Next?</h3>
        <ol class="steps-list">
          <li>You will receive a separate email with your <strong>Learning Management System (LMS)</strong> login credentials shortly.</li>
          <li>Log in to the LMS to access your course materials and begin learning.</li>
          <li>Review your course schedule and start dates in your LMS dashboard.</li>
        </ol>
      </div>

      <p style="font-size: 14px; color: #6b7280;">If you have any questions about your enrollment, please contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #0f3460; font-weight: 600;">${SUPPORT_EMAIL}</a>.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Toronto EMCS</strong></p>
      <p><a href="${WEBSITE_URL}">${WEBSITE_URL}</a></p>
      <p style="margin-top: 12px; font-size: 12px;">This is an automated email. Please do not reply directly.</p>
    </div>`

  return baseLayout(bodyContent)
}

// ─── Registration / LMS Credentials Template ─────────────────

interface RegistrationData {
  studentFirstName: string
  studentLastName: string
  courseName: string
  courseCode: string
  moodleUsername: string
  moodlePassword: string
  moodleUrl?: string
}

export function buildRegistrationEmail(data: RegistrationData): string {
  const lmsUrl = data.moodleUrl || MOODLE_LMS_URL

  const bodyContent = `
    <!-- Header -->
    <div class="header">
      <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.08em; color: #1B4332;">EMCS</div>
      <h1>Welcome to EMCS!</h1>
    </div>

    <!-- Body -->
    <div class="body-content">
      <p class="greeting">Hello ${data.studentFirstName}! 👋</p>
      <p>Welcome to <strong>Toronto EMCS</strong>! Your account has been created and you're all set to start learning.</p>

      <!-- Course Info -->
      <div class="info-card">
        <h3>Your Course</h3>
        <div class="course-item">
          <div class="course-name">${data.courseName}</div>
          <div class="course-code">${data.courseCode}</div>
        </div>
      </div>

      <!-- LMS Credentials -->
      <div class="info-card" style="border-color: #0f3460; border-width: 2px;">
        <h3>🔐 Your LMS Login Credentials</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8eaf0;">
              <span style="font-weight: 600; color: #374151; font-size: 14px;">LMS URL</span>
            </td>
            <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #e8eaf0;">
              <a href="${lmsUrl}" style="color: #0f3460; font-weight: 600; text-decoration: none;">${lmsUrl}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e8eaf0;">
              <span style="font-weight: 600; color: #374151; font-size: 14px;">Username</span>
            </td>
            <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #e8eaf0;">
              <span style="color: #0f3460; font-family: 'Courier New', monospace; font-size: 15px; font-weight: 600; background: #eef0f5; padding: 4px 10px; border-radius: 4px;">${data.moodleUsername}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <span style="font-weight: 600; color: #374151; font-size: 14px;">Password</span>
            </td>
            <td style="padding: 10px 0; text-align: right;">
              <span style="color: #e94560; font-family: 'Courier New', monospace; font-size: 15px; font-weight: 600; background: #fef7f8; padding: 4px 10px; border-radius: 4px;">${data.moodlePassword}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Warning -->
      <div class="warning-box">
        ⚠️ <strong>Important:</strong> Please change your password after your first login for security purposes.
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="${lmsUrl}" class="cta-button">Log In to Your LMS →</a>
      </div>

      <!-- Next Steps -->
      <div class="info-card">
        <h3>Getting Started</h3>
        <ol class="steps-list">
          <li>Click the button above or visit <a href="${lmsUrl}" style="color: #0f3460; font-weight: 600;">${lmsUrl}</a></li>
          <li>Enter your username and password to log in</li>
          <li>Change your password when prompted</li>
          <li>Navigate to your course dashboard and begin learning!</li>
        </ol>
      </div>

      <p style="font-size: 14px; color: #6b7280;">Need help? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: #0f3460; font-weight: 600;">${SUPPORT_EMAIL}</a>.</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Toronto EMCS</strong></p>
      <p><a href="${WEBSITE_URL}">${WEBSITE_URL}</a></p>
      <p style="margin-top: 12px; font-size: 12px;">This is an automated email. Please do not reply directly.</p>
    </div>`

  return baseLayout(bodyContent)
}

// ─── Admin Notification Template ─────────────────────────────

interface AdminNotificationData {
  studentFirstName: string
  studentLastName: string
  studentEmail: string
  courseName: string
  courseCode: string
  moodleUsername: string
  orderNumber: string
  registeredAt: string
}

export function buildAdminNotificationEmail(data: AdminNotificationData): string {
  const bodyContent = `
    <!-- Header -->
    <div class="header" style="background: linear-gradient(135deg, #1e3a5f 0%, #0f3460 100%);">
      <div style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.08em; color: #1B4332;">EMCS</div>
      <h1>New Student Registration</h1>
    </div>

    <!-- Body -->
    <div class="body-content">
      <p class="greeting">Admin Notification</p>
      <p>A new student has been registered following a successful course purchase.</p>

      <!-- Student Details -->
      <div class="info-card">
        <h3>Student Information</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; font-weight: 600; color: #374151; font-size: 14px;">Name</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; text-align: right; color: #0f3460; font-weight: 600;">${data.studentFirstName} ${data.studentLastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; font-weight: 600; color: #374151; font-size: 14px;">Email</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; text-align: right;">${data.studentEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; font-weight: 600; color: #374151; font-size: 14px;">LMS Username</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; text-align: right; font-family: 'Courier New', monospace; color: #0f3460; font-weight: 600;">${data.moodleUsername}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; font-weight: 600; color: #374151; font-size: 14px;">Course</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; text-align: right;">${data.courseName} (${data.courseCode})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; font-weight: 600; color: #374151; font-size: 14px;">Order Number</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e8eaf0; text-align: right; font-weight: 600;">${data.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #374151; font-size: 14px;">Registered At</td>
            <td style="padding: 8px 0; text-align: right;">${data.registeredAt}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 14px; color: #6b7280;">
        <strong>Action Required:</strong> Verify the student account has been provisioned in Moodle and course enrollment is active.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>EMCS Admin System</strong></p>
      <p style="font-size: 12px;">This is an automated admin notification from CanadaEMCS.com</p>
    </div>`

  return baseLayout(bodyContent)
}
