import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Preferences from "../views/Preferences";
import Snippets from "../views/Snippets";
import Tools from "../views/Commands";
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tinker',
    name: 'Tinker',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Interpreter2.vue')
  },
  {
    path: '/preferences',
    name: 'Preferences',
    component: Preferences
  },
  {
    path: '/snippets',
    name: 'Snippets',
    component: Snippets
  },
  {
    path: '/commands',
    name: 'Commands',
    component: Tools
  },
]

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
