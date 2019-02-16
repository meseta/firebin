<template>
  <v-layout fill-width v-if="inPreview">
    <v-container
      mx-3 my-2 pa-0
      v-html="formattedText"
      style="font-family: 'Roboto Mono', monospace;
              font-size: 0.9em;
              white-space: pre-wrap;">
    </v-container>
  </v-layout>

  <v-layout v-else fill-height v-on:click="focus()" style="cursor: text;" my-0 mx-1 pa-0>
    <v-dialog v-model="newDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Erase previous work?</v-card-title>
        <v-card-text>
          You have unsaved text, are you sure you want to erase and start fresh?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" flat @click="newDialog=false">Cancel</v-btn>
          <v-btn color="primary" flat @click="newFirebin()">Erase</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-textarea
      v-model="newText"
      full-width
      auto-grow
      autofocus
      :readonly="!canEdit"
      placeholder="Start typing here"
      ref="textarea"
      v-on:click.stop
      style="font-family: 'Roboto Mono', monospace;
              font-size: 0.9em;
              white-space: pre;"
    >

    </v-textarea>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['canEdit', 'inPreview', 'formattedText']),
    newText: {
      get: function () { return this.$store.state.newText },
      set: function (text) { this.$store.commit('setNewText', text) }
    },
    newDialog: {
      get: function () { return this.$store.state.newDialog },
      set: function (value) { this.$store.commit('setNewDialog', value) }
    }
  },
  methods: {
    ...mapActions(['newFirebin', 'loadDraft']),
    focus: function () {
      let element = this.$refs.textarea
      element.focus()
      element.setCaretPosition(-1)
    }
  },
  mounted () {
    if (this.newText === '') {
      this.loadDraft()
    }
  }
}
</script>
