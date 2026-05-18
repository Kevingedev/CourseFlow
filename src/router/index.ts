import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('../views/CoursesView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    // Admin routes protected by authentication and role validation
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard',
      meta: { requiresAuth: true, roles: ['admin', 'suadmin'] },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/AdminDashboard.vue'),
        },
        {
          path: 'requests',
          name: 'admin-requests',
          component: () => import('../views/admin/PlaceholderView.vue'),
          meta: { title: 'Gestión de Solicitudes' }
        },
        {
          path: 'courses',
          name: 'admin-courses',
          component: () => import('../views/admin/PlaceholderView.vue'),
          meta: { title: 'Gestión de Cursos' }
        },
        {
          path: 'waiting-list',
          name: 'admin-waiting-list',
          component: () => import('../views/admin/PlaceholderView.vue'),
          meta: { title: 'Lista de Espera' }
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/PlaceholderView.vue'),
          meta: { title: 'Gestión de Usuarios' }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Find if any parent route requires auth
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Find allowed roles for this route (checking all matched nested routes)
  const allowedRoles = to.matched.reduce<string[]>((roles, record) => {
    if (record.meta.roles) {
      return record.meta.roles as string[]
    }
    return roles
  }, [])

  // If user is authenticated and tries to go to login, redirect back
  if (to.name === 'login' && authStore.isAuthenticated) {
    if (authStore.isAdminOrSuadmin) {
      return next({ name: 'admin-dashboard' })
    }
    return next({ name: 'home' })
  }

  if (requiresAuth) {
    // 1. Check if token/session exists
    if (!authStore.isAuthenticated) {
      return next({ 
        name: 'login', 
        query: { redirect: to.fullPath } 
      })
    }
    
    // 2. Check if user's role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(authStore.userRole || '')) {
      // Role not allowed, redirect to public home
      return next({ name: 'home' })
    }
  }

  next()
})

export default router
