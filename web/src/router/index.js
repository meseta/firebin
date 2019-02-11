import Vue from 'vue'
import Router from 'vue-router'
import Firebin from '@/components/Firebin'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Firebin',
      component: Firebin
    }
  ]
})
