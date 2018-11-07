<template>
  <no-ssr>
  <v-ons-navigator swipeable
    :page-stack="pageStack"
    :pop-page="pagePop"
  ></v-ons-navigator>
  </no-ssr>
</template>

<script>
import LoginCheck from './LoginCheck';
import Vue from 'vue';

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
    color:#dbdbdb !important;
  }
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color:#dbdbdb !important;
  }

  .text-input:invalid,
  .text-input--material {
    color: #ffff !important;
  }

  .text-input--material__label {
    color: #ffff !important;
    position: absolute !important;
    left: 0 !important;
    top: 4px !important;
  }

  .text-input--material:focus {
  background-image:
    linear-gradient(#ffbd00, #ffbd00),
    linear-gradient(to top, transparent 1px, #afafaf 1px) !important;
  }

  .select-input--material {
    color: #ffff !important;
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
    background-color: #fcfcfc;
  }

  .list--material {
    border: none;
    background-color: #fcfcfc;
  }

  .tabbar {
      background-color: #fcfcfc;
  }

  :checked + .tabbar__button {
    color: #1251c4;
  }

  .tabbar--material {
    background-image: none;
  }

  .toolbar {
    background: #1251c4;
  }

  .toolbar__left {
    padding-left: 16px;
  }

  .toolbar__center {
    color: #fefefe;
    font-size: 1.2rem;
    font-weight: 550;
  }

  .toolbar  {
    color: #fefefe;
    font-size: 1.2rem;
    font-weight: 550;
  }

 .c-day-content[data-v-3db80f80] {
    font-size: 1rem;
  }
  
  .c-weekdays[data-v-2083cb72] {

  }

  .c-header[data-v-2083cb72] {
    /* カレンダーのheaderは、Carendar.vue内のthemeStylesによって決めている。これはDatePicker用。 */
  }

  .c-week[data-v-28896542] {
    /* border-top: solid .5px rgb(206, 206, 206); */
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
    /* color: transparent; */
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

  .left > .close-icon {
    font-size: 1.3rem;
    padding-left: 12px;
    transform: translateY(-4px);
  }


  /* DiaryDetail.vue, DiaryDrafts.vue, MyPage.vue用 */

    .diary-wrap {
        border-bottom: solid 1px #575757;
        padding-bottom: 0;
    }

    .header {
        width: 100vw;
        padding: 16px 16px;
        margin-bottom: 8px;
        border-bottom: solid 1px #e2e1e1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title-date {
        display: flex;
        flex-direction: column;
    }

    .diary-title {
        font-size: 1.2rem;
    }

    .diary-date {
        padding-left: 8px;
        color: #575757;
    }

    .diary-contents {
        width: 96vw;
        word-wrap: break-word;
    }

    .qTitle {
        padding: 8px 16px 0;
        margin-bottom: 8px;
    }

    .qAnswer {
        padding: 0 16px 16px;
        border-bottom: solid 1px #e2e1e1;
        color: #575757;
        white-space: pre-wrap;
    }

    .actions {
      display: flex;
      align-items: center;
    }

    .icon-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #575757;
    }
    
    .edit {
      margin-right: 16px;
    }

    .pen {
      font-size: 1.5rem;
    }

    .trash {
        font-size: 1.5rem;
    }

    .text {
        font-size: 0.9rem;
    }
</style>
