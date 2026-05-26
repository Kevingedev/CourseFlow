import { computed, onMounted, ref, watch } from 'vue'
import { coursesService } from '@/services/coursesService'
import { waitingListService } from '@/services/waitingListService'
import { applicationsService } from '@/services/applicationsService'
import type { CourseRecord } from '@/types/courses'
import type { WaitingListEntry } from '@/types/waitingList'

export const useWaitingList = () => {
  const courses = ref<CourseRecord[]>([])
  const selectedCourseId = ref<string>('all')
  const entries = ref<WaitingListEntry[]>([])
  const loadingCourses = ref(false)
  const loadingEntries = ref(false)
  const updatingEntryId = ref<string | number | null>(null)
  const deletingEntryId = ref<string | number | null>(null)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const isAllCoursesSelected = computed(() => selectedCourseId.value === 'all')

  const courseNameById = computed(() => {
    const map = new Map<string, string>()
    for (const course of courses.value) {
      map.set(String(course.id), course.name)
    }
    return map
  })

  const selectedCourse = computed(
    () => courses.value.find((course) => String(course.id) === selectedCourseId.value) ?? null,
  )

  const filteredEntries = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()

    // Ordenar primero por curso y luego por posición o fecha de creación
    const sorted = [...entries.value].sort((a, b) => {
      if (Number(a.course_id) !== Number(b.course_id)) {
        return Number(a.course_id) - Number(b.course_id)
      }
      if (a.position !== b.position) {
        return (a.position || 0) - (b.position || 0)
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    })

    // Indexar posiciones secuencialmente por cada curso para que escalen de forma continua
    const courseCounters = new Map<number, number>()
    const base = sorted.map((entry) => {
      const cId = Number(entry.course_id)
      const currentCount = courseCounters.get(cId) || 0
      const nextCount = currentCount + 1
      courseCounters.set(cId, nextCount)
      return {
        ...entry,
        position: nextCount,
      }
    })

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
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'No se pudieron cargar los cursos.'
    } finally {
      loadingCourses.value = false
    }
  }

  const loadEntries = async () => {
    loadingEntries.value = true
    error.value = null

    try {
      // Obtener todas las solicitudes para cruzar y conseguir nombre y correo de usuario
      const userMap = new Map<number, { name: string; email: string }>()
      try {
        const apps = await applicationsService.getApplications()
        for (const app of apps) {
          if (app.user_id && app.user) {
            userMap.set(Number(app.user_id), {
              name: app.user.name,
              email: app.user.email,
            })
          }
        }
      } catch (appErr) {
        console.warn(
          '[useWaitingList] No se pudieron cargar las solicitudes para cruzar datos:',
          appErr,
        )
      }

      let rawEntries: WaitingListEntry[] = []
      if (isAllCoursesSelected.value) {
        const all = await Promise.allSettled(
          courses.value.map((course) => waitingListService.getWaitingListByCourse(course.id)),
        )
        rawEntries = all.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
      } else {
        rawEntries = await waitingListService.getWaitingListByCourse(selectedCourseId.value)
      }

      // Rellenar datos de usuario a partir del mapa de solicitudes
      entries.value = rawEntries.map((entry) => {
        const mappedUser = userMap.get(Number(entry.user_id))
        return {
          ...entry,
          user: mappedUser
            ? { id: entry.user_id, name: mappedUser.name, email: mappedUser.email }
            : entry.user,
        }
      })
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'No se pudo cargar la lista de espera.'
      entries.value = []
    } finally {
      loadingEntries.value = false
    }
  }

  const moveEntryToPending = async (entry: WaitingListEntry) => {
    updatingEntryId.value = entry.id
    error.value = null

    try {
      await waitingListService.moveToPending(entry.id)
      await loadEntries()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'No se pudo devolver a pendiente.'
    } finally {
      updatingEntryId.value = null
    }
  }

  const deleteEntry = async (entry: WaitingListEntry) => {
    deletingEntryId.value = entry.id
    error.value = null

    try {
      await waitingListService.deleteWaitingEntry(entry.id)
      await loadEntries()
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'No se pudo eliminar de la lista de espera.'
    } finally {
      deletingEntryId.value = null
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
    updatingEntryId,
    deletingEntryId,
    error,
    searchQuery,
    loadCourses,
    loadEntries,
    moveEntryToPending,
    deleteEntry,
  }
}
