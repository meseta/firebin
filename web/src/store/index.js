import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import * as firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/firestore'
import pako from 'pako'

Vue.use(Vuex)

const state = {
  error: null,
  success: null,

  viewText: '',
  loadingText: false,
  newText: '',
  canEdit: true,
  newDialog: false,
  canSave: true,
  busySave: false,
  canCopy: false,
  busyCopy: false,

  darkMode: true
}

const getters = {
  getNewText () {
    return state.newText || ''
  },
  canNew () {
    return true
  },
  canSave () {
    return state.canSave && state.newText.length > 0
  }
}

const mutations = {
  setError (state, payload) {
    state.error = payload
    state.success = null
  },
  setSuccess (state, payload) {
    state.success = payload
    state.error = null
  },

  setViewText (state, value) { state.viewText = value },
  setLoadingText (state, value) { state.loadingText = value },

  setNewText (state, value) { state.newText = value },
  setCanEdit (state, value) { state.canEdit = value },
  setNewDialog (state, value) { state.newDialog = value },

  setCanSave (state, value) { state.canSave = value },
  setBusySave (state, value) { state.busySave = value },
  setCanCopy (state, value) { state.canCopy = value },
  setBusyCopy (state, value) { state.busyCopy = value },

  setDarkMode (state, value) { state.darkMode = value }
}

const actions = {
  toggleDark ({commit, state}) {
    localStorage.darkMode = !state.darkMode
    commit('setDarkMode', !state.darkMode)
  },
  newFirebin ({commit, state}) {
    if (router.currentRoute.path === '/') {
      if (state.newText.length > 0) {
        if (state.newDialog === false) {
          commit('setNewDialog', true)
        } else {
          commit('setNewDialog', false)
          commit('setNewText', '')
        }
      }
    } else {
      router.push('/')
    }
  },
  saveFirebin ({commit, state}) {
    commit('setBusySave', true)
    commit('setCanEdit', false)

    let data = state.newText
    let encode = 'text'
    let compress = 'none'
    let input = new TextEncoder('utf-8').encode(data)
    let b64str

    try {
      let compress = pako.deflate(input)
      let blob = firebase.firestore.Blob.fromUint8Array(compress)
      b64str = blob.toBase64()
    } catch (err) {
      console.log(err)
      commit('setError', 'Could not compress data for sending')
      commit('setCanEdit', true)
      commit('setBusySave', false)
      return
    }

    if (b64str.length < state.newText.length) {
      data = b64str
      encode = 'base64'
      compress = 'zlib'
    }

    let saveFirebinFunc = firebase.functions().httpsCallable('saveFirebin')
    saveFirebinFunc({
      data: data,
      encode: encode,
      compress: compress
    }).then(res => {
      commit('setSuccess', 'Successfully saved firebin')
      commit('setNewText', '')
      commit('setCanEdit', true)
      commit('setBusySave', false)
      router.push('/' + res.data.binId)
    }).catch(err => {
      console.log(err)
      commit('setError', 'Could not save firebin')
      commit('setCanEdit', true)
      commit('setBusySave', false)
    })
  },
  loadFirebin ({commit, state}, binId) {
    commit('setLoadingText', true)

    return firebase.firestore().collection('firebin').doc(binId).get()
      .then(doc => {
        if (!doc.exists) {
          throw new Error()
        }

        let data = doc.get('data')
        let decode
        switch (doc.get('encode')) {
          case 'base64':
            decode = firebase.firestore.Blob.fromBase64String(data).toUint8Array()
            break
          default:
            decode = data
        }

        let result
        switch (doc.get('compress')) {
          case 'zlib':
            result = new TextDecoder('utf-8').decode(pako.inflate(decode))
            break
          default:
            result = decode
        }

        commit('setViewText', result)
        commit('setCanCopy', true)
        commit('setLoadingText', false)
      }).catch(err => {
        console.log(err)
        commit('setError', 'Could not load firebin')
        commit('setLoadingText', false)
        commit('setViewText', '')
      })
  },
  copyFirebin ({commit, state}, key) {
    commit('setNewText', state.viewText)
    commit('setSuccess', 'You can now edit the copy')
    router.push('/')
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
