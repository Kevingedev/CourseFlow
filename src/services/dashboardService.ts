import api from './api'
import type { Course, Application, WaitingListEntry } from '@/types/dashboard'
import type { User } from '@/types/auth'

export const dashboardService = {

  /**
   * Fetches all courses
   */
  async getCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses')
    return response.data
  },

  /**
   * Fetches all applications
   */
  async getApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>('/applications')
    return response.data
  },

  /**
   * Fetches all waiting list items
   */
  async getWaitingList(): Promise<WaitingListEntry[]> {
    const response = await api.get<WaitingListEntry[]>('/waiting_list')
    return response.data
  },

  /**
   * Fetches all users
   */
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users')
    return response.data
  }
}
