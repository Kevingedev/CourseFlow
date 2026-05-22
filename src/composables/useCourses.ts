import { computed, onMounted, reactive, ref } from 'vue'
import { coursesService } from '@/services/coursesService'
import type {
  CourseFormValues,
  CourseRecord,
  CoursesFeedback,
} from '@/types/courses'

const createInitialForm = (): CourseFormValues => ({
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  capacity: null,
  is_active: true,
})

export const useCourses = () => {
  const courses = ref<CourseRecord[]>([])
  const loading = ref(false)
  const submitting = ref(false)
  const deletingCourseId = ref<number | null>(null)
  const selectedCourseId = ref<number | null>(null)
  const feedback = ref<CoursesFeedback | null>(null)
  const form = reactive<CourseFormValues>(createInitialForm())

  const isEditing = computed(() => selectedCourseId.value !== null)
  const selectedCourse = computed(
    () => courses.value.find((c) => c.id === selectedCourseId.value) ?? null,
  )
  const searchQuery = ref('')

  const sortedCourses = computed(() =>
    [...courses.value].sort((left, right) => left.name.localeCompare(right.name, 'es')),
  )

  const filteredCourses = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return sortedCourses.value

    return sortedCourses.value.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query)),
    )
  })
  const canSubmit = computed(() => {
    const hasName = form.name.trim().length > 0
    const hasStartDate = form.start_date.trim().length > 0
    const hasEndDate = form.end_date.trim().length > 0

    if (!hasName || !hasStartDate || !hasEndDate) {
      return false
    }

    // Validate end_date > start_date
    if (form.start_date && form.end_date) {
      return new Date(form.end_date) > new Date(form.start_date)
    }

    return true
  })

  const resetFeedback = () => {
    feedback.value = null
  }

  const resetForm = () => {
    Object.assign(form, createInitialForm())
    selectedCourseId.value = null
  }

  const hydrateFormForEdit = (course: CourseRecord) => {
    form.name = course.name
    form.description = course.description ?? ''
    form.start_date = course.start_date
    form.end_date = course.end_date
    form.capacity = course.capacity
    form.is_active = course.is_active
    selectedCourseId.value = course.id
    resetFeedback()
  }

  const loadCourses = async () => {
    loading.value = true

    try {
      courses.value = await coursesService.getCourses()
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo cargar la lista de cursos.',
      }
    } finally {
      loading.value = false
    }
  }

  const submitForm = async () => {
    if (!canSubmit.value) {
      feedback.value = {
        type: 'error',
        message: 'Completa nombre, fecha de inicio y fecha de fin para guardar el curso.',
      }
      return
    }

    submitting.value = true
    resetFeedback()

    try {
      if (isEditing.value && selectedCourseId.value) {
        const updatedCourse = await coursesService.updateCourse(selectedCourseId.value, {
          name: form.name.trim(),
          description: form.description.trim() || null,
          start_date: form.start_date,
          end_date: form.end_date,
          capacity: form.capacity,
          is_active: form.is_active,
        })

        courses.value = courses.value.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course,
        )
        feedback.value = {
          type: 'success',
          message: 'Curso actualizado correctamente.',
        }
      } else {
        const createdCourse = await coursesService.createCourse({
          name: form.name.trim(),
          description: form.description.trim() || null,
          start_date: form.start_date,
          end_date: form.end_date,
          capacity: form.capacity,
          is_active: form.is_active,
        })

        courses.value = [...courses.value, createdCourse]
        feedback.value = {
          type: 'success',
          message: 'Curso creado correctamente.',
        }
      }

      resetForm()
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo guardar el curso.',
      }
    } finally {
      submitting.value = false
    }
  }

  const removeCourse = async (course: CourseRecord) => {
    deletingCourseId.value = course.id
    resetFeedback()

    try {
      await coursesService.deleteCourse(course.id)
      courses.value = courses.value.filter((item) => item.id !== course.id)

      if (selectedCourseId.value === course.id) {
        resetForm()
      }

      feedback.value = {
        type: 'success',
        message: 'Curso desactivado correctamente.',
      }
    } catch (error: unknown) {
      feedback.value = {
        type: 'error',
        message:
          error instanceof Error ? error.message : 'No se pudo desactivar el curso.',
      }
    } finally {
      deletingCourseId.value = null
    }
  }

  onMounted(loadCourses)

  return {
    courses: filteredCourses,
    canSubmit,
    deletingCourseId,
    feedback,
    form,
    isEditing,
    loading,
    selectedCourse,
    submitting,
    hydrateFormForEdit,
    loadCourses,
    removeCourse,
    resetFeedback,
    resetForm,
    searchQuery,
    submitForm,
  }
}
