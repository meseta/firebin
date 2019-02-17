<template>
  <v-container fluid pa-0>
    <v-layout v-if="loadingText" my-0 py-0>
      <v-progress-linear indeterminate full-width></v-progress-linear>
    </v-layout>
    <v-layout row wrap v-else-if="formattedText===''">
      <v-flex class="text-xs-center" my-5>
        <h1 class="headline font-weight-light" my-5>Page Not Found</h1>
      </v-flex>
    </v-layout>
    <v-layout v-else>
      <v-container
        mx-3 my-2 pa-0
        v-html="formattedText"
        class="render-text"
        :style="'font-family: \'Roboto Mono\', monospace; font-size: 0.9em; ' +
                '' +
                (previewUsePre ? 'white-space: pre-wrap; word-wrap: break-word;' : '')">
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      binId: this.$route.params.binId
    }
  },
  computed: {
    ...mapState(['formattedText', 'loadingText', 'previewUsePre', 'inPreview']),
    language: {
      get: function () { return this.$store.state.formattedLanguage },
      set: function (value) {
        this.$store.commit('setFormattedLanguage', value)
        this.rerenderPreview(value)
      }
    }
  },
  methods: {
    ...mapActions(['loadFirebin']),
    ...mapMutations(['setCanCopy'])
  },
  mounted () {
    let bits = this.binId.split('.')
    this.loadFirebin({binId: bits[0], language: bits[1]})
  },
  beforeDestroy () {
    this.setCanCopy(false)
  }
}
</script>
