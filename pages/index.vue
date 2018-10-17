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
/* OnsenUIのCSS調整。 */
  ::placeholder{
    color:#999;
  }
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:#999;
  }

  .page {
    background-color: #fcfcfc;
  }

  .page__content {
    background-color: #fcfcfc;
  }

  .page__background {
    background-color: #fcfcfc;
  }

  .page--material {
    background-color: #fcfcfc;
  }

  .page--material__background {
    background-color: #fcfcfc;
  }

  .list {
    border: none;
    background-color: #fff;
  }

  .list--material {
    border: none;
    background-color: #fff;
  }

  .tabbar {
      background-color: #fafafa;
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
    .tabbar {
      border-top: none;
      background-size: 100% 1.7px;
      background-repeat: no-repeat;
      background-position: top;
      background-image: linear-gradient(-90deg, #0D4B91, #2FF4B9);
    }
  }

  :checked + .tabbar__button {
    color: #4ABEC8;
  }

  .toolbar {
    background: #fefefe;
    background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);
    background-size: 100% 2px;
    background-position: bottom;
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
    .toolbar {
      /* background-image: linear-gradient(0deg, #b2b2b2, #b2b2b2 50%, transparent 50%); */
      background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);

    }
  }
  .toolbar__bg {
    /* background: #a72020; */
    background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);
  }

  .toolbar--material {
    background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);
    background-size: 100% 2px;
}

</style>
