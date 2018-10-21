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
    this.$store.commit('clear');
    this.$store.commit('push', LoginCheck);
  },

  mounted() {
      // this.$ons.platform.select('android');//検証用
      Vue.prototype.md = this.$ons.platform.isAndroid();//onsenui.jsで定義すべきか検討。
  },

  computed: {
    pageStack() {
      return this.$store.state.pageStack;
    }
  },

  methods: {
    pagePop() {
      this.$store.commit('pop');
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

  .tabbar--material {
    background-image: none;
  }

  .toolbar {
    background: #fefefe;
    background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);
    background-size: 100% 2px;
    background-position: bottom;
    background-repeat: no-repeat;
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi), (min-resolution: 2dppx) {
    .toolbar {
      /* background-image: linear-gradient(0deg, #b2b2b2, #b2b2b2 50%, transparent 50%); */
      background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);

    }
  }
  
  .toolbar__bg {
    background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);
    /* background-image: rgb(31, 158, 120) */
  }

  .toolbar--material {
    background-image: linear-gradient(-90deg, #2FF4B9, #0D4B91);
    background-size: 100% 2px;
    background-position: bottom;
    background-repeat: no-repeat;
  }

  /* Calendar.vue用 */
 .c-day-content[data-v-3db80f80] {
    font-size: 1rem;
  }
  
  .c-weekdays[data-v-2083cb72]{
    margin-bottom: -5px;
  }

  .c-header{
    color: rgb(210, 30, 30);
    width: 296px;
    margin: 0 auto;
  }

  .c-week[data-v-28896542] {
    border-top: solid .5px rgb(206, 206, 206);
  }

  .c-day[data-v-3db80f80]{
    min-height:42px;
    padding: 2px 0;
  }

  .c-day-backgrounds .c-day-background[data-v-3db80f80] {
    position: relative;
    top: -2.7px;
  }

  .c-day-bars[data-v-3db80f80] {
    width: 3px;
    height: 3px;
    position: relative;
    top: -3.5px;
  }

  /* Diary.vueのcreateElement用 */
  .d-date {
    margin-left:  16px;
    font-weight:  bold;
    color:  #444444;
  }

  .d-hc-check {
    font-size: 2.2rem;
    float:  right;
    margin-right: -8px;
    margin-top: -24px;
  }

  .d-img-div {
    display: flex;
    justify-content: flex-start;
  }

  .d-img {
    height: 14vw;
    max-height: 56px;
    width: 14vw;
    max-width: 56px;
    border-radius: 8vw;
    margin-right: 3vw;
  }

  .d-t-div {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 14vw;
    max-height: 56px;
    width: 78%;
  }

  .d-title {
    font-size: calc(0.8rem + 0.4vw);
  }

  .d-n-t {
    display: flex;
    justify-content: space-between;
  }

  .d-name {
    color: #8e8e8e;
    font-size: calc(0.6rem + 0.5vw);
  }

  .d-time {
    color: #8e8e8e;
    font-size: calc(0.6rem + 0.5vw);
  }

/* onsenui animationパフォーマンス用 */
  .text-input--material {
    will-change: background-image, background-size;
  }

  .text-input--material__label {
    will-change: transform;
  }

  .button--material {
    will-change: box-shadow, opacity;
  }

  .select-input--material {
    will-change: background-size;
  }

  .select-input--material__label {
    will-change: transform;
  }
</style>
