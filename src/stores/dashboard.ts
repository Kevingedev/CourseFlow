import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { dashboardService } from '@/services/dashboardService'
import type { Course, Application, WaitingListEntry } from '@/types/dashboard'
import type { User } from '@/types/auth'
import axios from 'axios'

export const useDashboardStore = defineStore('dashboard', () => {
  const courses = ref<Course[]>([])
  const applications = ref<Application[]>([])
  const waitingList = ref<WaitingListEntry[]>([])
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getRequestErrorMessage = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        return 'Tu sesión no es válida o ha expirado. Vuelve a iniciar sesión.'
      }

      if (err.response?.status === 403) {
        return 'Tu rol no tiene permisos para consultar algunos datos del dashboard.'
      }

      if (typeof err.response?.data?.detail === 'string') {
        return err.response.data.detail
      }

      if (err.message === 'Network Error') {
        return 'No se pudo conectar con el backend. Revisa que el servidor esté levantado y que CORS permita http://localhost:5173.'
      }
    }

    return err instanceof Error ? err.message : 'Error al cargar los datos del panel.'
  }

  // Live dynamic metrics calculated from collections
  const totalCourses = computed(() => {
    return courses.value.filter(c => c.is_active).length
  })

  const pendingApplications = computed(() => {
    return applications.value.filter(a => a.status === 'pending').length
  })

  const admittedStudents = computed(() => {
    return applications.value.filter(a => a.status === 'accepted').length
  })

  const waitingListCount = computed(() => {
    return waitingList.value.length
  })

  // Chart data selectors
  const applicationsStatusData = computed(() => {
    const statusCounts = {
      pending: 0,
      accepted: 0,
      rejected: 0
    }

    applications.value.forEach(app => {
      if (app.status === 'accepted') {
        statusCounts.accepted++
      } else if (app.status === 'pending') {
        statusCounts.pending++
      } else if (app.status === 'rejected') {
        statusCounts.rejected++
      }
    })

    return {
      labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
      datasets: [
        {
          label: 'Estado de Solicitudes',
          backgroundColor: ['#FFC107', '#4CAF50', '#64748B'],
          hoverBackgroundColor: ['#FFD54F', '#81C784', '#94A3B8'],
          borderWidth: 2,
          borderColor: '#ffffff',
          data: [statusCounts.pending, statusCounts.accepted, statusCounts.rejected]
        }
      ]
    }
  })

  const studentsPerCourseData = computed(() => {
    // Get enrollment count per course
    const courseMap = new Map<string | number, { name: string; enrolled: number; capacity: number }>()

    // Initialize map with all courses
    courses.value.forEach(course => {
      courseMap.set(course.id, {
        name: course.name,
        enrolled: 0,
        capacity: course.capacity ?? 0
      })
    })

    // Count admitted students
    applications.value.forEach(app => {
      if (app.status === 'accepted') {
        const courseData = courseMap.get(app.course_id)
        if (courseData) {
          courseData.enrolled++
        }
      }
    })

    const labels: string[] = []
    const enrolledData: number[] = []
    const capacityData: number[] = []

    courseMap.forEach(data => {
      labels.push(data.name.length > 20 ? data.name.substring(0, 20) + '...' : data.name)
      enrolledData.push(data.enrolled)
      capacityData.push(data.capacity)
    })

    return {
      labels,
      datasets: [
        {
          label: 'Alumnos Admitidos',
          backgroundColor: '#4311B9',
          hoverBackgroundColor: '#724CCA',
          borderRadius: 6,
          data: enrolledData
        },
        {
          label: 'Capacidad del Curso',
          backgroundColor: '#E5DFF3',
          hoverBackgroundColor: '#F5F2FA',
          borderRadius: 6,
          data: capacityData
        }
      ]
    }
  })

  async function fetchDashboardData() {
    loading.value = true
    error.value = null
    try {
      const coursesRes = await dashboardService.getCourses()
      courses.value = coursesRes

      const courseIds = coursesRes.map((course) => course.id)

      const [applicationsByCourse, waitingListByCourse] = await Promise.all([
        Promise.allSettled(courseIds.map((courseId) => dashboardService.getCourseApplications(courseId))),
        Promise.allSettled(courseIds.map((courseId) => dashboardService.getWaitingListByCourse(courseId))),
      ])

      applications.value = applicationsByCourse.flatMap((result) => {
        if (result.status === 'fulfilled') {
          return result.value
        }

        console.warn('Dashboard applications request failed:', result.reason)
        return []
      })

      waitingList.value = waitingListByCourse.flatMap((result) => {
        if (result.status === 'fulfilled') {
          return result.value
        }

        console.warn('Dashboard waiting list request failed:', result.reason)
        return []
      })

      users.value = []
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      error.value = getRequestErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  return {
    courses,
    applications,
    waitingList,
    users,
    loading,
    error,
    totalCourses,
    pendingApplications,
    admittedStudents,
    waitingListCount,
    applicationsStatusData,
    studentsPerCourseData,
    fetchDashboardData
  }
})
