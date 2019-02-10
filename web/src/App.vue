<template>
  <v-app>
    <v-toolbar flat app>
      <v-toolbar-title class="text-uppercase grey--text">
        <router-link to="/" tag="span" style="cursor: pointer" class="font-weight-light">
          FireBin
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat class="grey--text">
          <v-icon left>save</v-icon>Save
        </v-btn>
        <v-btn flat class="grey--text">
          <v-icon left>add_box</v-icon>New
        </v-btn>
        <v-btn flat class="grey--text">
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
export default {
  name: 'App'
}
</script>
