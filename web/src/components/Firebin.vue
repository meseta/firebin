<template>
  <v-layout fill-height v-on:click="focus()" style="cursor: text;">
    <v-textarea
      v-model="newText"
      full-width
      auto-grow
      autofocus
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
// import { mapState } from 'vuex'

export default {
  computed: {
    newText: {
      get: function () {
        return this.$store.state.newText
      },
      set: function (text) {
        this.$store.commit('setNewText', text)
      }
    }
  },
  methods: {
    focus: function () {
      let element = this.$refs.textarea
      element.focus()
      element.setCaretPosition(-1)
    }
  }
}
</script>
