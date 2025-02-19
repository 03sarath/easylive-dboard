import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignOut from '../views/SignOut.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import testView from '@/components/testView.vue'

Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   },
//   {
//     path: '/logout',
//     name: 'logout',
//     component: SignOut
//   },
// ]

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      },
      {
        path: '/logout',
        name:'logout',
        component: SignOut
      },
      {
        path: '/testview',
        name:'testview',
        component: testView
      },
      // {
      //   path: '/c2',
      //   component: () => import('@/components/C2.vue')
      // }
    ]
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
