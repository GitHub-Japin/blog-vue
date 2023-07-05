import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/client/ClientLogin'
import Blogs from '@/views/client/Blogs'
import BlogDetail from '@/views/client/BlogDetail'

import BlogEdit from '@/views/common/BlogEdit'
import ServerInfo from "../components/server/ServerInfo";

Vue.use(Router)

export default new Router({
  routes: [
    {//首个为首页
      path: '/',
      name: 'Index',
      redirect:{name : "Blogs"}
    },
    {
      path: '/blogs',
      name: 'Blogs',
      component: Blogs
    },
    {
    path: '/login',
    name: 'Login',
    component: Login
    },
    {
      path: '/blog/add',
      name: 'BlogEdit',
      component: BlogEdit,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/blog/:blogId',
      name: 'BlogDetail',
      component: BlogDetail
    },
    {
      path: '/blog/:blogId/edit',
      name: 'BlogEdit',
      component: BlogEdit,
      meta: {//需要权限，登录后才进入
        requireAuth: true,
        requireLogin: true
      }
    },
    {
      path: '/serverinfo',
      name: 'serverinfo',
      component: ServerInfo
    },
    {
      path: "/welcome",//懒加载
      component: () =>
        import("../views/server/Welcome.vue")
    },
    {
      path: "/categoryInfo",
      component: () =>
        import("../views/server/categoryInfo.vue")
    },
    {
      path: "/blogInfo",
      component: () =>
        import("../views/server/BlogInfo.vue")
    },
    {
      path: "/userInfo",
      meta: {//需要权限，登录后才进入
        requireLogin: true
      },
      component: () =>
        import("../views/server/UserInfo.vue")
    }
]})
