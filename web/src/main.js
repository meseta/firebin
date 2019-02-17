// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import './plugins/vuetify'
import App from './App'
import router from './router'
import store from './store'

import colors from 'vuetify/es5/util/colors'

import config from './config/firebase.js'
import * as firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp(config)

Vue.use(Vuetify, {
  theme: {
    primary: colors.red,
    secondary: colors.orange,
    success: colors.lightGreen,
    error: colors.deepOrange
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
