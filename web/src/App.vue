<template>
  <v-app class="grey lighten-4">
    <v-toolbar flat app>
      <v-toolbar-title class="text-uppercase primary--text font-weight-light">
          FireBin
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn v-on:click="newFirebin()" flat class="secondary--text">
          <v-icon left>add_box</v-icon>New
        </v-btn>
        <v-btn v-on:click="saveText()" flat class="primary--text" :disabled="!canSave" :loading="busySave">
          <v-icon left>save</v-icon>Save
        </v-btn>
        <v-btn flat class="secondary--text" :disabled="!canCopy" :loading="busyCopy">
          <v-icon left>file_copy</v-icon>Copy
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['canSave', 'canCopy', 'busySave', 'busyCopy'])
  },
  methods: {
    ...mapActions(['newFirebin', 'saveText'])
  }
}
</script>
