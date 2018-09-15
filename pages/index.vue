<template>
  <!-- <no-ssr> -->
  <v-ons-navigator swipeable
    :page-stack="pageStack"
    :pop-page="pagePop"
  ></v-ons-navigator>
  <!-- </no-ssr> -->
</template>

<script>
import Home from './Home'
import TypeSelect from './TypeSelect'
import Vue from 'vue'
import { mapActions } from 'vuex'
import { throws } from 'assert';

export default {

  beforeCreate() {
    this.$store.commit('clear')
    this.$store.commit('push', Home)
  },

  mounted() {
      // this.$ons.platform.select('android')//検証用
      Vue.prototype.md = this.$ons.platform.isAndroid()//onsenui.jsで定義すべきか検討。

      // Promise.resolve()
      //   .then( () => this.bindTeam())
        
      //   .then( () => this.bindSchedule())
      //   .then( () => this.bindTeamU())
  },

  destroyed() {
      // Promise.resolve()
      //   .then( () => this.unBindTeam())
      //   .then( () => this.unBindSchedule())
      //   .then( () => this.unBindTeamU())
  },

  computed: {
    pageStack() {
      return this.$store.state.pageStack
    }
  },

  methods: {
    ...mapActions({
      bindTeam: 'bindTeam',
      bindSchedule: 'bindSchedule',
      bindTeamU: 'bindTeamU',
    }),

    pagePop() {
      this.$store.commit('pop')
    },
  }
}

</script>

<style>

</style>
