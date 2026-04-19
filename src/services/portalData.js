export function isCreditStorefront(storefront) {
  return storefront === 'credit' || storefront === 'official-ontario'
}

export function getProgressValue(value) {
  const numericValue = Number(value ?? 0)

  if (!Number.isFinite(numericValue)) {
    return 0
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)))
}

export function formatPortalDate(value) {
  if (!value) {
    return '—'
  }

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) {
    return '—'
  }

  return parsedDate.toLocaleDateString()
}

export function normalizeCourse(course) {
  if (!course) {
    return null
  }

  return {
    ...course,
    course_code: course.course_code ?? course.code ?? '',
    grade_level: course.grade_level ?? course.grade ?? null,
  }
}

export function normalizeEnrollment(enrollment) {
  if (!enrollment) {
    return null
  }

  return {
    ...enrollment,
    enrollment_date: enrollment.enrollment_date ?? enrollment.enrolled_at ?? enrollment.created_at ?? null,
    progress: getProgressValue(enrollment.progress ?? enrollment.progress_pct),
    grade: enrollment.grade ?? enrollment.final_grade ?? enrollment.final_mark ?? null,
    courses: normalizeCourse(enrollment.courses),
  }
}

export function normalizeOrder(order) {
  if (!order) {
    return null
  }

  const orderItems = Array.isArray(order.order_items) ? order.order_items : []

  return {
    ...order,
    total_amount: Number(order.total_amount ?? order.total ?? 0),
    items_count: Number(order.items_count ?? orderItems.length),
    order_items: orderItems,
  }
}

export function getDocumentTypeLabel(documentType) {
  switch (documentType) {
    case 'transcript':
      return 'Transcript / Report Card'
    case 'id_document':
      return 'ID Document'
    case 'supporting_document':
      return 'Supporting Document'
    case 'report_card':
      return 'Report Card'
    default:
      return 'Document'
  }
}
