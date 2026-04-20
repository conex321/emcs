// ============================================================
// EMCS Shared: Moodle Provisioning Orchestration
// Wraps MoodleClient with idempotent user/enrolment provisioning
// against the EMCS Supabase tables (students, enrollments, courses).
// ============================================================
import { MoodleClient } from './moodle-client.ts'

type SupabaseLike = {
  from: (table: string) => any
}

export function getMoodleClient(): MoodleClient | null {
  const endpoint = Deno.env.get('MOODLE_WS_ENDPOINT')
  const token = Deno.env.get('MOODLE_WS_TOKEN')
  if (!endpoint || !token) {
    console.warn('[moodle] MOODLE_WS_ENDPOINT or MOODLE_WS_TOKEN not configured — skipping Moodle provisioning')
    return null
  }
  return new MoodleClient(endpoint, token)
}

export interface StudentForProvisioning {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  moodle_user_id?: number | null
  moodle_username: string | null
  moodle_password: string | null
}

/**
 * Idempotently ensure the student exists in Moodle and persist the Moodle user ID.
 * - No-op if students.moodle_user_id is already set.
 * - On username/email collision, falls back to lookup by email and adopts that ID.
 */
export async function provisionMoodleUser(
  supabase: SupabaseLike,
  client: MoodleClient,
  student: StudentForProvisioning
): Promise<number | null> {
  if (student.moodle_user_id) {
    return student.moodle_user_id
  }

  if (!student.email || !student.moodle_username || !student.moodle_password) {
    console.warn(`[moodle] Cannot provision student ${student.id}: missing email or generated credentials`)
    return null
  }

  let moodleUserId: number | null = null

  try {
    const created = await client.createUser({
      username: student.moodle_username,
      password: student.moodle_password,
      firstname: student.first_name || 'Student',
      lastname: student.last_name || 'EMCS',
      email: student.email,
    })
    if (Array.isArray(created) && created[0]?.id) {
      moodleUserId = created[0].id
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/usernameexists|emailexists|invalidusername|user_exists|already exist/i.test(message)) {
      console.warn(`[moodle] User collision for ${student.email}, looking up existing account`)
      const existing = await client.getUserByEmail(student.email)
      if (existing?.id) {
        moodleUserId = existing.id
      } else {
        console.error(`[moodle] Collision but no user found by email ${student.email}: ${message}`)
        throw err
      }
    } else {
      throw err
    }
  }

  if (moodleUserId) {
    await supabase
      .from('students')
      .update({ moodle_user_id: moodleUserId })
      .eq('id', student.id)
  }

  return moodleUserId
}

/**
 * For every active enrolment that isn't yet linked to Moodle, resolve the
 * course's moodle_course_id (lazy-fetched by Ontario code as Moodle idnumber)
 * and call enrol_manual_enrol_users. Persists moodle_enrolment_id on success.
 */
export async function enrolStudentInActiveCourses(
  supabase: SupabaseLike,
  client: MoodleClient,
  studentId: string
): Promise<void> {
  const { data: student } = await supabase
    .from('students')
    .select('moodle_user_id')
    .eq('id', studentId)
    .single()

  const moodleUserId = student?.moodle_user_id
  if (!moodleUserId) {
    console.warn(`[moodle] Student ${studentId} has no moodle_user_id — cannot enrol`)
    return
  }

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, course_id, moodle_enrolment_id, courses ( id, code, moodle_course_id )')
    .eq('student_id', studentId)
    .eq('status', 'active')
    .is('moodle_enrolment_id', null)

  for (const enrolment of (enrollments || [])) {
    const course = enrolment.courses
    if (!course) continue

    let moodleCourseId: number | null = course.moodle_course_id || null

    if (!moodleCourseId && course.code) {
      try {
        const found = await client.getCourseByIdnumber(course.code)
        if (found?.id) {
          moodleCourseId = found.id
          await supabase
            .from('courses')
            .update({ moodle_course_id: moodleCourseId })
            .eq('id', course.id)
        }
      } catch (lookupErr) {
        console.warn(`[moodle] Course lookup failed for ${course.code}:`, lookupErr)
      }
    }

    if (!moodleCourseId) {
      console.warn(`[moodle] No Moodle course found for ${course.code} (idnumber). Skipping enrolment ${enrolment.id}`)
      try {
        await supabase.from('sync_errors').insert({
          sync_type: 'enrolment',
          severity: 'warning',
          message: `No Moodle course matches idnumber=${course.code} for enrolment ${enrolment.id}`,
        })
      } catch (_) { /* sync_errors table may have school_id NOT NULL — best-effort */ }
      continue
    }

    try {
      await client.enrolUser(moodleUserId, moodleCourseId, 5)
      await supabase
        .from('enrollments')
        .update({ moodle_enrolment_id: moodleCourseId })
        .eq('id', enrolment.id)
      console.log(`[moodle] Enrolled user ${moodleUserId} in course ${moodleCourseId} (${course.code})`)
    } catch (enrolErr) {
      console.error(`[moodle] Failed to enrol user ${moodleUserId} in course ${moodleCourseId}:`, enrolErr)
    }
  }
}
