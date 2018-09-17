<template>
  <no-ssr>
  <v-ons-navigator swipeable
    :page-stack="pageStack"
    :pop-page="pagePop"
  ></v-ons-navigator>
  </no-ssr>
</template>

<script>
import Home from './Home'
import TypeSelect from './TypeSelect'
import PasswordReset from './PasswordReset'
import TabBar from './TabBar'
import { mapActions } from 'vuex'
import Vue from 'vue'
export default {

  beforeCreate() {
    this.$store.commit('clear')
    this.$store.commit('push', Home)
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

</style>
