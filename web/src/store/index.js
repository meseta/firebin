import Vue from 'vue'
import Vuex from 'vuex'
// import router from '@/router'
// import * as firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/firestore'

Vue.use(Vuex)

const state = {
  newText: '',
  canSave: true,
  canCopy: false
}

const getters = {
  getNewText () {
    return state.newText || ''
  }
}

const mutations = {
  setNewText (state, payload) {
    state.newText = payload
  }
}

const actions = {

}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
