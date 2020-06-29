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
    name: 'Home',
    component: Home,
    title: '首页'
  },
  {
    path: '/market',
    name: 'Market',
    component: Market,
    title: '市场'
  },
  {
    path: '/arbitration',
    name: 'Arbitration',
    component: Arbitration,
    title: '仲裁'
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    title: '个人中心'
  },
  {
    path: '/login',
    name: 'Login/Register',
    component: Login,
    title: '登录/注册'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
