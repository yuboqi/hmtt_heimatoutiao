import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/token'
import { Notify } from 'vant'
// import Login from '@/views/Login/LoginViews.vue'
// import User from '@/views/User/UserViews.vue'
// import UserEdit from '@/views/User/UserEdit.vue'
// import Home from '@/views/Home/HomeViews.vue'
// import Layout from '@/views/Layout/LayoutViews.vue'
// import Search from '@/views/Serach/SearchView.vue'
// import SearchResult from '@/views/Serach/SearchResult/SearchResult.vue'
// import ArticleDetail from '@/views/ArticleDetail/ArticleDetail.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout/home'
  },
  {
    path: '/chat',
    component: () => import('@/views/Chat/ChatView.vue')
  },
  {
    path: '/user_editor',
    component: () => import('@/views/User/UserEdit.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/Login/LoginViews.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('@/views/ArticleDetail/ArticleDetail.vue')
  },
  {
    path: '/search',
    component: () => import('@/views/Serach/SearchView.vue')
  },
  {
    path: '/search/:keywords',
    component: () => import('@/views/Serach/SearchResult/SearchResult.vue'),
    meta: { screenY: 0 }
  },
  {
    path: '/layout',
    component: () => import('@/views/Layout/LayoutViews.vue'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home/HomeViews.vue'),
        meta: { screenT: 0 }
      },
      {
        path: 'user',
        component: () => import('@/views/User/UserViews.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (getToken()?.length > 0 && to.path === '/login') {
    Notify({ type: 'danger', message: '跳转失败' })
    next(`${from.path}`)
  } else {
    next()
  }
})

export default router
