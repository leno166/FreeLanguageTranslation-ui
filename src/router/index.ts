import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // // 根路径重定向到 /large（推荐做法）
  // {
  //   path: '/',
  //   redirect: '/'
  // },

  // 正常页面：normal
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/NormalLayout.vue'),

    children: [
      {
        path: '', // 默认子路由（即 / 本身）
        name: 'Home',
        component: () => import('@/components/HomePage.vue')
      },

      {
        path: 'setting', // 对应 /large/setting
        name: 'setting',
        component: () => import('@/components/NormalSetting.vue')
      }
    ]
  },

  // 小页面：mini
  {
    path: '/mini',
    name: 'mini',
    component: () => import('@/components/MiniHomePage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
