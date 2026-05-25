import { computed, onMounted, ref, watch } from 'vue'
import { coursesService } from '@/services/coursesService'
import { waitingListService } from '@/services/waitingListService'
import type { CourseRecord } from '@/types/courses'
import type { WaitingListEntry } from '@/types/waitingList'

export const useWaitingList = () => {
  const courses = ref<CourseRecord[]>([])
  const selectedCourseId = ref<string>('')
  const entries = ref<WaitingListEntry[]>([])
  const loadingCourses = ref(false)
  const loadingEntries = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const courseNameById = computed(() => {
    const map = new Map<string, string>()
    for (const course of courses.value) {
      map.set(String(course.id), course.name)
    }
    return map
  })

  const selectedCourse = computed(() =>
    courses.value.find((course) => String(course.id) === selectedCourseId.value) ?? null,
  )

  const filteredEntries = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    const base = [...entries.value].sort((a, b) => a.position - b.position)

    if (!query) return base

    return base.filter((entry) => {
      const courseName = courseNameById.value.get(String(entry.course_id))
      const searchable = [
        entry.position,
        entry.user_id,
        entry.course_id,
        courseName,
        entry.user?.name,
        entry.user?.email,
        entry.course?.name,
      ]
        .filter((item) => item !== null && item !== undefined)
        .join(' ')
        .toLowerCase()

      return searchable.includes(query)
    })
  })

  const loadCourses = async () => {
    loadingCourses.value = true
    error.value = null

    try {
      const loaded = await coursesService.getCourses()
      courses.value = loaded
      if (!selectedCourseId.value && loaded.length > 0) {
        const firstCourse = loaded[0]
        if (firstCourse) {
          selectedCourseId.value = String(firstCourse.id)
        }
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'No se pudieron cargar los cursos.'
    } finally {
      loadingCourses.value = false
    }
  }

  const loadEntries = async () => {
    if (!selectedCourseId.value) {
      entries.value = []
      return
    }

    loadingEntries.value = true
    error.value = null

    try {
      entries.value = await waitingListService.getWaitingListByCourse(selectedCourseId.value)
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'No se pudo cargar la lista de espera.'
      entries.value = []
    } finally {
      loadingEntries.value = false
    }
  }

  watch(selectedCourseId, () => {
    loadEntries()
  })

  onMounted(async () => {
    await loadCourses()
    await loadEntries()
  })

  return {
    courses,
    courseNameById,
    selectedCourse,
    selectedCourseId,
    entries: filteredEntries,
    loadingCourses,
    loadingEntries,
    error,
    searchQuery,
    loadCourses,
    loadEntries,
  }
}
