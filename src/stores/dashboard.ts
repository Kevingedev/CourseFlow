import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { dashboardService } from '@/services/dashboardService'
import type { Course, Application, WaitingListEntry } from '@/types/dashboard'
import type { User } from '@/types/auth'

export const useDashboardStore = defineStore('dashboard', () => {
  const courses = ref<Course[]>([])
  const applications = ref<Application[]>([])
  const waitingList = ref<WaitingListEntry[]>([])
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Live dynamic metrics calculated from collections
  const totalCourses = computed(() => {
    return courses.value.filter(c => c.is_active).length
  })

  const pendingApplications = computed(() => {
    return applications.value.filter(a => a.status === 'Pending').length
  })

  const admittedStudents = computed(() => {
    return applications.value.filter(a => a.status === 'Approved' || a.status === 'Admitted').length
  })

  const waitingListCount = computed(() => {
    return waitingList.value.length
  })

  // Chart data selectors
  const applicationsStatusData = computed(() => {
    const statusCounts = {
      Pending: 0,
      Approved: 0,
      Rejected: 0
    }

    applications.value.forEach(app => {
      // Map both 'Approved' and 'Admitted' to the approved category
      if (app.status === 'Approved' || app.status === 'Admitted') {
        statusCounts.Approved++
      } else if (app.status === 'Pending') {
        statusCounts.Pending++
      } else if (app.status === 'Rejected') {
        statusCounts.Rejected++
      }
    })

    return {
      labels: ['Pendientes', 'Aprobadas', 'Rechazadas'],
      datasets: [
        {
          label: 'Estado de Solicitudes',
          backgroundColor: ['#FFC107', '#4CAF50', '#F44336'],
          hoverBackgroundColor: ['#FFD54F', '#81C784', '#E57373'],
          borderWidth: 2,
          borderColor: '#ffffff',
          data: [statusCounts.Pending, statusCounts.Approved, statusCounts.Rejected]
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
        capacity: course.capacity
      })
    })

    // Count admitted students
    applications.value.forEach(app => {
      if (app.status === 'Approved' || app.status === 'Admitted') {
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
          backgroundColor: '#5418C1',
          hoverBackgroundColor: '#6523D4',
          borderRadius: 6,
          data: enrolledData
        },
        {
          label: 'Capacidad del Curso',
          backgroundColor: '#E0D4F7',
          hoverBackgroundColor: '#ECE5FA',
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
      const [coursesRes, applicationsRes, waitingListRes, usersRes] = await Promise.all([
        dashboardService.getCourses(),
        dashboardService.getApplications(),
        dashboardService.getWaitingList(),
        dashboardService.getUsers()
      ])

      courses.value = coursesRes
      applications.value = applicationsRes
      waitingList.value = waitingListRes
      users.value = usersRes
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      error.value = err instanceof Error ? err.message : 'Error al cargar los datos del panel.'
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
