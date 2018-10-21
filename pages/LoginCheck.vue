<template>
  <no-ssr>
   <v-ons-page>
    <div class="container">
      <Logo class="logo"/>
      <p class="lead">仲間のいいとこ見つけよう</p>
      <div class="spinner"></div>
    </div>
  </v-ons-page>
  </no-ssr>
</template>

<script>
import Logo from '../components/Logo';
import Home from './Home';
import TabBar from './TabBar';


export default {
  mounted() {
    this.$store.dispatch('checkLogin', {page1: Home, page2: TabBar});
  },

  components: {
    Logo
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
  }

  .logo {
    font-size: 4rem;
    color: rgb(210, 30, 30);
    margin-bottom: 16px;
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
        border-top: 3px solid #42a5f5;
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

