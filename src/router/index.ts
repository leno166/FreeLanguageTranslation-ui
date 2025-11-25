import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 根路径重定向到 /large（推荐做法）
  {
    path: '/',
    redirect: '/large'
  },

  // 主页面：large
  {
    path: '/large',
    name: 'large',
    component: () => import('../App.vue')
  },

  // {
  //   path: '/small',
  //   name: 'small',
  //   component: () => import('../App.vue')
  // },
  //
  // {
  //   path: '/large/setting',
  //   name: 'setting',
  //   component: () => import('../App.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
