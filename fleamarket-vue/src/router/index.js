import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Market from "../views/Market";
import Arbitration from "../views/Arbitration";
import User from "../views/User";
import Login from "../views/Login";

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: '首页',
    component: Home
  },
  {
    path: '/market',
    name: '市场',
    component: Market
  },
  {
    path: '/arbitration',
    name: '仲裁',
    component: Arbitration
  },
  {
    path: '/user',
    name: '个人中心',
    component: User
  },
  {
    path: '/login',
    name: '登录/注册',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
