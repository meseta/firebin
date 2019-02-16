import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import * as firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/firestore'
import pako from 'pako'

import hljs from 'highlight.js'

Vue.use(Vuex)

const state = {
  error: null,
  success: null,

  viewText: '',
  formattedText: '',
  loadingText: false,

  newText: '',
  canEdit: true,
  newDialog: false,
  inPreview: false,

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
    return state.canSave && !state.busySave && state.newText.length > 0
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
  setFormattedText (state, value) { state.formattedText = value },
  setLoadingText (state, value) { state.loadingText = value },

  setNewText (state, value) { state.newText = value },
  setCanEdit (state, value) { state.canEdit = value },
  setNewDialog (state, value) { state.newDialog = value },
  setInPreview (state, value) { state.inPreview = value },

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
  toggleInPreview ({commit, state, dispatch}) {
    if (state.inPreview) {
      commit('setInPreview', false)
    } else {
      dispatch('renderText', {text: state.newText})
      commit('setInPreview', true)
    }
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
  saveFirebin ({commit, state, dispatch}) {
    commit('setBusySave', true)
    commit('setCanEdit', false)

    dispatch('saveDraft', false) // save just in case

    let data = state.newText
    let encode = 'text'
    let compress = 'none'
    let input = new TextEncoder('utf-8').encode(data)
    let b64str

    // guess language
    let hlText = hljs.highlightAuto(data)
    let language = null
    if (hlText.relevance > 20) {
      language = hlText.language
    }

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
      compress: compress,
      language: language
    }).then(res => {
      commit('setSuccess', 'Successfully saved firebin')
      commit('setNewText', '')
      dispatch('saveDraft', false) // saving here will save empty string thus clearing draft
      commit('setCanEdit', true)
      commit('setBusySave', false)

      let path = '/' + res.data.binId
      if (language) {
        path = path + '.' + language
      }
      router.push(path)
    }).catch(err => {
      console.log(err)
      commit('setError', 'Could not save firebin')
      commit('setCanEdit', true)
      commit('setBusySave', false)
    })
  },
  loadFirebin ({commit, state, dispatch}, payload) {
    commit('setLoadingText', true)

    let binId = payload.binId
    let language = payload.language

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

        dispatch('renderText', {text: result, language: language})
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
  },
  saveDraft ({commit, state}, notify) {
    localStorage.draft = state.newText
    if (notify) {
      commit('setSuccess', 'Draft saved')
    }
  },
  loadDraft ({commit}) {
    commit('setNewText', localStorage.draft)
  },
  clearDraft ({commit, state}) {
    localStorage.draft = ''
  },
  renderText ({commit}, payload) {
    let text = payload.text
    let language = payload.language

    let hlText
    if (language) {
      hlText = hljs.highlightAuto(text, [language])
    } else {
      hlText = hljs.highlightAuto(text)
    }
    let formatted = hljs.fixMarkup(hlText.value)
    language = hlText.language

    // hack to change the color of strings
    formatted = formatted.replace(/<span class="hljs-string">/g, '<span class="hljs-string-replacement">')

    commit('setFormattedText', formatted)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: process.env.NODE_ENV !== 'production'
})
