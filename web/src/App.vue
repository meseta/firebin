<template>
  <v-app :class="darkMode ? 'brown darken-4': 'grey lighten-4'" :dark="darkMode">
    <v-toolbar flat app :class="darkMode ? 'deep-orange darken-4': 'grey lighten-4'">
      <v-toolbar-title
        class="text-uppercase primary--text font-weight-light"
        style="cursor: pointer"
        v-on:click="aboutDialog=true">
        FireBin
      </v-toolbar-title>

      <v-tooltip bottom>
        <template #activator="data">
          <v-btn fab small flat v-on="data.on" v-on:click="aboutDialog=true" >
            <v-icon class="secondary--text">info</v-icon>
          </v-btn>
        </template>
        <span>About</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="data">
          <v-btn fab small flat v-on="data.on" v-on:click="toggleDark()" >
            <v-icon v-if="darkMode" class="secondary--text">brightness_3</v-icon>
            <v-icon v-else class="secondary--text">brightness_5</v-icon>
          </v-btn>
        </template>
        <span>Toggle dark mode</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="data">
          <v-btn fab small flat :disabled="!canSave" v-on="data.on" v-on:click="saveDraft(true)" >
            <v-icon class="secondary--text">save_alt</v-icon>
          </v-btn>
        </template>
        <span>Save draft</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template #activator="data">
          <v-btn fab small :flat="!inPreview" :disabled="!canSave" v-on="data.on" v-on:click="toggleInPreview()" >
            <v-icon class="secondary--text" v-if="inPreview">close</v-icon>
            <v-icon class="secondary--text" v-else>image_search</v-icon>
          </v-btn>
        </template>
        <span v-if="inPreview">Close preview</span>
        <span v-else>Preview</span>
      </v-tooltip>

	  <v-spacer class="hidden-sm-and-down"></v-spacer>
      <v-toolbar-items>
        <v-btn v-on:click="newFirebin()" :disabled="!canNew" flat class="secondary--text">
          <v-icon left>add_box</v-icon>New
        </v-btn>
        <v-btn v-on:click="saveFirebin()" flat class="primary--text" :disabled="!canSave" :loading="busySave">
          <v-icon left>save</v-icon>Save
        </v-btn>
        <v-btn v-on:click="copyFirebin()" flat class="secondary--text" :disabled="!canCopy" :loading="busyCopy">
          <v-icon left>file_copy</v-icon>Copy
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-snackbar top color="error" :timeout="0" v-model="errorFlag">
      {{ error }}
      <v-btn flat @click="errorFlag=false">Aww</v-btn>
    </v-snackbar>
    <v-snackbar top color="success" v-model="successFlag">
      {{ success }}
      <v-btn flat @click="successFlag=false">OK</v-btn>
    </v-snackbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-dialog v-model="aboutDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Firebin</v-card-title>
        <v-card-text>
          <p>
            Firebin is an online text snippet storage service hosted on Google Firebase<br />
            Author: <a href="http://meseta.io">Meseta</a>
          </p>
          <p><b>Privacy Policy:</b></p>
          <p style="white-space: pre-wrap">{{ privacyPolicyText }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="aboutDialog=false">Cool, OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import privacyPolicy from './privacyPolicy.txt'

export default {
  name: 'App',
  data () {
    return {
      errorFlag: false,
      successFlag: false,
      aboutDialog: false,
      privacyPolicyText: privacyPolicy
    }
  },
  computed: {
    ...mapState([
      'canCopy', 'busySave', 'busyCopy', 'error', 'success',
      'inPreview', 'darkMode'
    ]),
    ...mapGetters(['canNew', 'canSave'])
  },
  methods: {
    ...mapActions([
      'newFirebin', 'saveFirebin', 'copyFirebin', 'toggleDark',
      'toggleInPreview', 'saveDraft'
    ]),
    ...mapMutations(['setDarkMode'])
  },
  watch: {
    error (value) {
      if (value) {
        this.errorFlag = true
        this.successFlag = false
      }
    },
    success (value) {
      if (value) {
        this.successFlag = true
        this.errorFlag = false
      }
    },
    errorFlag (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    },
    successFlag (value) {
      if (!value) {
        this.$store.commit('setSuccess', null)
      }
    }
  },
  mounted () {
    if (localStorage.darkMode) {
      this.$store.commit('setDarkMode', JSON.parse(localStorage.darkMode))
    }
  }
}
</script>

<style>
@import 'highlight.js/styles/gml.css';

.hljs-string-replacement { /* replacement color to make it darker  */
  color: #aaaa00;
}

pre code {
  padding: 10px;
}

pre code:after {
  content: none;
}

.render-text {
  counter-reset: line;
}

.render-text .render-line {
  display: inline-block;
  margin-left: 3em;
}

.render-text .render-line:before {
  counter-increment: line;
  content: counter(line);
  display: inline-block;
  padding-right: 1.0em;
  width: 3em;
  text-align: right;
  margin-right: 1.0em;
  margin-left: -3em;
  color: #888;
}

div#app {
    min-width:100%;
    width: fit-content;
    height: fit-content;
    min-height: 100vh;
}
</style>
