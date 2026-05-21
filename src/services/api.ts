import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// Response Interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.clearSession()

      // Dispatch custom event so the UI can notify the user
      window.dispatchEvent(new CustomEvent('auth:expired', {
        detail: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
      }))
    }
    return Promise.reject(error)
  }
)

export default api
