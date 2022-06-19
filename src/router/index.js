import { createRouter, createWebHistory } from 'vue-router'
import GridComponentView from '../views/GridComponentView.vue'

const routes = [
  {
    path: '/',
    name: 'GridComponentView',
    component: GridComponentView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
