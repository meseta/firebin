import Vue from 'vue'
import Router from 'vue-router'
import ViewFirebin from '@/components/ViewFirebin'
import NewFirebin from '@/components/NewFirebin'
import NotFound from '@/components/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Firebin',
      component: NewFirebin
    },
    {
      path: '/:binId',
      name: 'View Firebin',
      component: ViewFirebin
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})
