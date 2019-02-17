<template>
  <v-container fluid fill-height pa-0>
    <v-layout v-if="inPreview" column>
      <v-select
        solo
        v-model="language"
        :items="listHljsLanguages"></v-select>
      <v-container
        mx-3 my-2 pa-0
        v-html="formattedText"
        class="render-text"
        :style="'font-family: \'Roboto Mono\', monospace; font-size: 0.9em;' +
                (previewUsePre ? 'white-space: pre-wrap; word-wrap: break-word;' : '')">
      </v-container>
    </v-layout>

    <v-layout v-else fill-height v-on:click="focus()" style="cursor: text;" my-0 mx-1 pa-0>
      <v-textarea
        v-model="newText"
        full-width
        auto-grow
        autofocus
        :readonly="!canEdit"
        placeholder="Start typing here"
        ref="textarea"
        v-on:click.stop
        style="font-family: 'Roboto Mono', monospace; font-size: 0.9em;"
        v-on:keydown.tab.prevent="insertTab()">
      </v-textarea>
    </v-layout>

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
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState(['canEdit', 'inPreview', 'formattedText', 'previewUsePre']),
    ...mapGetters(['listHljsLanguages']),
    newText: {
      get: function () { return this.$store.state.newText },
      set: function (text) { this.$store.commit('setNewText', text) }
    },
    newDialog: {
      get: function () { return this.$store.state.newDialog },
      set: function (value) { this.$store.commit('setNewDialog', value) }
    },
    language: {
      get: function () { return this.$store.state.formattedLanguage },
      set: function (value) {
        this.$store.commit('setFormattedLanguage', value)
        this.rerenderPreview(value)
      }
    }
  },
  methods: {
    ...mapActions(['newFirebin', 'loadDraft', 'rerenderPreview']),
    focus () {
      let element = this.$refs.textarea
      element.focus()
      element.setCaretPosition(-1)
    },
    insertTab () {
      let element = this.$refs.textarea
      let textarea = element.$el.querySelector('textarea')

      let start = textarea.selectionStart
      let end = textarea.selectionEnd
      this.newText = element.value.substring(0, start) + '    ' + element.value.substring(end)
      element.setCaretPosition(start + 4)
    }
  },
  mounted () {
    if (this.newText === '') {
      this.loadDraft()
    }
  }
}
</script>
