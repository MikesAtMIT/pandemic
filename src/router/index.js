import Vue from 'vue'
import VueRouter from 'vue-router'
import Board from '../views/Board.vue'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Board,
  },
  {
    path: 'old',
    name: 'old',
    component: HomeView,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
