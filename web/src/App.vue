<template>
  <v-app class="grey lighten-4">
    <v-toolbar flat app>
      <v-toolbar-title class="text-uppercase red--text font-weight-light">
          FireBin
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat class="orange--text" :disabled="!canSave">
          <v-icon left>save</v-icon>Save
        </v-btn>
        <v-btn flat class="red--text">
          <v-icon left>add_box</v-icon>New
        </v-btn>
        <v-btn flat class="orange--text" :disabled="!canCopy">
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
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: mapState(['canSave', 'canCopy'])
}
</script>
