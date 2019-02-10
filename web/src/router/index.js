import Vue from 'vue'
import Router from 'vue-router'
import NewFirebin from '@/components/NewFirebin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'NewFirebin',
      component: NewFirebin
    }
  ]
})
