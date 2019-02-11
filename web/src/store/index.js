import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
// import * as firebase from 'firebase/app'
// import 'firebase/auth'
// import 'firebase/firestore'

Vue.use(Vuex)

const state = {
  viewText: '',
  loadingText: false,
  newText: '',
  canEdit: true,
  newDialog: false,
  canSave: true,
  busySave: false,
  canCopy: false,
  busyCopy: false
}

const getters = {
  getNewText () {
    return state.newText || ''
  }
}

const mutations = {
  setViewText (state, value) { state.viewText = value },
  setLoadingText (state, value) { state.loadingText = value },

  setNewText (state, value) { state.newText = value },
  setCanEdit (state, value) { state.canEdit = value },
  setNewDialog (state, value) { state.newDialog = value },

  setCanSave (state, value) { state.canSave = value },
  setBusySave (state, value) { state.busySave = value },
  setCanCopy (state, value) { state.canCopy = value },
  setBusyCopy (state, value) { state.busyCopy = value }
}

const actions = {
  newFirebin ({commit, state}) {
    if (router.currentRoute.path === '/') {
      if (state.newDialog === false) {
        commit('setNewDialog', true)
      } else {
        commit('setNewDialog', false)
        commit('setNewText', '')
      }
    } else {
      router.push('/')
    }
  },
  saveText ({commit, state}, text) {
    commit('setBusySave', true)
    commit('setCanEdit', false)
    // commit('setBusySave', false)
  },
  loadText ({commit, state}, key) {
    commit('setLoadingText', true)
    console.log('load' + key)
    commit('setLoadingText', false)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
