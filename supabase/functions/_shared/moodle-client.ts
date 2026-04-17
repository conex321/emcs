// ============================================================
// EMCS Shared: Moodle Web Services Client
// Direct port of SISConex MoodleClient, adapted for EMCS
// ============================================================

interface MoodleWSParams {
  [key: string]: string | number | boolean | undefined
}

export class MoodleClient {
  private baseUrl: string
  private token: string
  private delayMs: number

  constructor(baseUrl: string, token: string, delayMs = 50) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.token = token
    this.delayMs = delayMs
  }

  /** Generic Web Services call */
  private async call<T>(wsfunction: string, params: MoodleWSParams = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/webservice/rest/server.php`)
    url.searchParams.set('wstoken', this.token)
    url.searchParams.set('wsfunction', wsfunction)
    url.searchParams.set('moodlewsrestformat', 'json')

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }

    // Rate-limit to avoid hammering Moodle
    if (this.delayMs > 0) {
      await new Promise(res => setTimeout(res, this.delayMs))
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`Moodle WS error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Moodle returns errors as { exception, errorcode, message }
    if (data?.exception) {
      throw new Error(`Moodle error [${data.errorcode}]: ${data.message}`)
    }

    return data as T
  }

  // ─── COURSES ───────────────────────────────────────────
  async getCourses(): Promise<any[]> {
    return this.call('core_course_get_courses')
  }

  // ─── ENROLLED USERS ────────────────────────────────────
  async getEnrolledUsers(courseId: number): Promise<any[]> {
    return this.call('core_enrol_get_enrolled_users', { courseid: courseId })
  }

  // ─── ASSIGNMENTS ───────────────────────────────────────
  async getAssignments(courseIds: number[]): Promise<any> {
    const params: MoodleWSParams = {}
    courseIds.forEach((id, i) => {
      params[`courseids[${i}]`] = id
    })
    return this.call('mod_assign_get_assignments', params)
  }

  // ─── SUBMISSIONS ──────────────────────────────────────
  async getSubmissions(assignmentIds: number[]): Promise<any> {
    const params: MoodleWSParams = {}
    assignmentIds.forEach((id, i) => {
      params[`assignmentids[${i}]`] = id
    })
    return this.call('mod_assign_get_submissions', params)
  }

  // ─── GRADES ────────────────────────────────────────────
  async getGradeItems(courseId: number, userId?: number): Promise<any> {
    const params: MoodleWSParams = { courseid: courseId }
    if (userId) params.userid = userId
    return this.call('gradereport_user_get_grade_items', params)
  }

  // ─── USER MANAGEMENT (for auto-provisioning) ──────────
  async createUser(user: {
    username: string
    password: string
    firstname: string
    lastname: string
    email: string
  }): Promise<any> {
    return this.call('core_user_create_users', {
      'users[0][username]': user.username,
      'users[0][password]': user.password,
      'users[0][firstname]': user.firstname,
      'users[0][lastname]': user.lastname,
      'users[0][email]': user.email,
    })
  }

  async enrolUser(userId: number, courseId: number, roleId = 5): Promise<any> {
    return this.call('enrol_manual_enrol_users', {
      'enrolments[0][roleid]': roleId,       // 5 = student
      'enrolments[0][userid]': userId,
      'enrolments[0][courseid]': courseId,
    })
  }

  // ─── SITE INFO ─────────────────────────────────────────
  async getSiteInfo(): Promise<any> {
    return this.call('core_webservice_get_site_info')
  }
}
