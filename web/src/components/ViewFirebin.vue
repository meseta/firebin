<template>
  <v-layout v-if="loadingText" my-0 py-0>
    <v-progress-linear indeterminate full-width></v-progress-linear>
  </v-layout>
  <v-layout row wrap v-else-if="formattedText===''">
    <v-flex class="text-xs-center" my-5>
      <h1 class="headline font-weight-light" my-5>Page Not Found</h1>
    </v-flex>
  </v-layout>
  <v-layout fill-width v-else>
    <v-container
      mx-3 my-2 pa-0
      v-html="formattedText"
      style="font-family: 'Roboto Mono', monospace;
              font-size: 0.9em;
              white-space: pre-wrap;">
    </v-container>
  </v-layout>
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
    ...mapState(['formattedText', 'loadingText'])
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

<style>
@import 'highlight.js/styles/gml.css';

.hljs-string-replacement { /* replacement color to make it darker  */
  color: #aaaa00;
}
</style>
