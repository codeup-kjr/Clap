<template>
  <no-ssr>
   <v-ons-page>
    <div class="container">
      <img :src="logo" class="logo"/>
      <!-- <p class="lead">仲間のいいとこ見つけよう</p> -->
      <!-- <div class="spinner"></div> -->
    </div>
  </v-ons-page>
  </no-ssr>
</template>

<script>
import Home from './Home';
import TabBar from './TabBar';
import logo from '../assets/clapLogo@2x.png';

export default {
  mounted() {
    this.$store.dispatch('checkLogin', {page1: Home, page2: TabBar});
  },

  data() {
    return {
      logo: logo
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(0deg,#6fb1fc,#4364f7, #0052D4);
    background-size: 100vw 100vh;
  }

  .logo {
    width: 40vw;
    margin-bottom: 8vh;
  }

  @media (min-width: 700px){
    .logo {
        width: 24vw;
      }
  }

  @media (min-width: 1200px){
    .logo {
        width: 12vw;
      }
  }

  .lead {
    font-style: italic;
    font-size: 1.1rem;
    margin-bottom: 24px;
  }

  .msg {
    height: 40px;
    font-size: 1.2rem;
    color: #db2e76;
    margin-bottom: 8px;
  }

  .spinner {
        will-change: rotate;
        height: 60px;
        width: 60px;
        -webkit-animation: spin 1s linear infinite;
                animation: spin 1s linear infinite;
        border: 3px solid #ddd;
        border-top: 3px solid #f0be42;
        border-radius: 50%;
    }

    @-webkit-keyframes spin {
    to {
        border-top-color: #ec407a;
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    }

    @keyframes spin {
    to {
        border-top-color: #ec407a;
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    }
</style>

