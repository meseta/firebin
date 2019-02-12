<template>
  <v-layout v-if="loadingText" my-0 py-0>
    <v-progress-linear indeterminate full-width></v-progress-linear>
  </v-layout>
  <v-layout fill-height v-else>
    <v-textarea
      v-model="viewText"
      full-width
      auto-grow
      readonly
      style="font-family: 'Roboto Mono', monospace;
              font-size: 0.9em;
              white-space: pre;"
    >

    </v-textarea>
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
    ...mapState(['viewText', 'loadingText'])
  },
  methods: {
    ...mapActions(['loadFirebin']),
    ...mapMutations(['setCanCopy'])
  },
  mounted () {
    this.loadFirebin(this.binId)
  },
  beforeDestroy () {
    this.setCanCopy(false)
  }
}
</script>
