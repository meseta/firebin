<template>
  <v-app class="grey lighten-4">
    <v-toolbar flat app>
      <v-toolbar-title class="text-uppercase primary--text font-weight-light">
        FireBin
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-on:click="newFirebin()" :disabled="!canNew" flat class="secondary--text">
          <v-icon left>add_box</v-icon>New
        </v-btn>
        <v-btn v-on:click="saveText()" flat class="primary--text" :disabled="!canSave" :loading="busySave">
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
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      errorFlag: false,
      successFlag: false
    }
  },
  computed: {
    ...mapState(['canCopy', 'busySave', 'busyCopy', 'error', 'success']),
    ...mapGetters(['canNew', 'canSave'])
  },
  methods: {
    ...mapActions(['newFirebin', 'saveText', 'copyFirebin'])
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
  }
}
</script>
