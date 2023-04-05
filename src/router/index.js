import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import Manage from '../views/Manage.vue'
import Song from '../views/Song.vue'
import { use_user_store } from '../stores/user'


const routes = [
  {
    path:'',
    name:'home',
    component:Home,
  },
  {
    path:'/about',
    name:'about',
    component:About,
  },
  {
    path:'/manage',
    name:'manage',
    component: Manage,
    meta:{
      requires_auth:true,
    }
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song
  },
  {
    path: '/:catchAll(.*)*',
    redirect:{name:'home'}
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass:'text-yellow-500'
})

router.beforeEach((to,from,next) => {
  if(!to.meta.requires_auth){
    next()
    return
  }
  const store=use_user_store()
  if(store.user_logged_in){
    next()
  } else {
    next({name:'home'})
  }
})

export default router
