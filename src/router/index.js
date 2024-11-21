import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../components/HomePage.vue'
import LoginPage from '../components/LoginPage.vue'
import UserPortal from '../components/UserPortal.vue'
import RegisterPage from '../components/RegisterPage.vue'
import AdminPortal from '../components/AdminPortal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/user',
    name: 'UserPortal',
    component: UserPortal,
    //meta: { requiresAuth: true, role: 'user' }
  },

  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/admin',
    name: 'AdminPortal',
    component: AdminPortal,
    //meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/*
// Add Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check if user is logged in
  const userRole = localStorage.getItem('role'); // Get user role

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return next('/login');
    }

    // Check role-based access
    if (to.meta.role && to.meta.role !== userRole) {
      // Redirect to home if role doesn't match
      return next('/');
    }
  }

  // Allow access if no restrictions
  next();
});
*/

export default router
