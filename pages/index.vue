<template>
  <no-ssr>
  <v-ons-navigator swipeable
    :page-stack="pageStack"
    :pop-page="pagePop"
  ></v-ons-navigator>
  </no-ssr>
</template>

<script>
import LoginCheck from './LoginCheck'
import Vue from 'vue'
export default {

  beforeCreate() {
    this.$store.commit('clear')
    this.$store.commit('push', LoginCheck)
  },

  mounted() {
      // this.$ons.platform.select('android')//検証用
      Vue.prototype.md = this.$ons.platform.isAndroid()//onsenui.jsで定義すべきか検討。
      // this.$store.commit('push', TabBar)
  },

  destroyed() {

  },

  computed: {
    pageStack() {
      return this.$store.state.pageStack
    }
  },

  methods: {
    pagePop() {
      this.$store.commit('pop')
    },
  }
}

</script>

<style>

  ::placeholder{
    color:#999;
  }
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:#999;
  }

</style>
