<template>
  <no-ssr>
   <v-ons-page>
    <div class="container">
      <img :src="logo" class="logo"/>

      <div v-html="$sanitize(errMsg)" class="err-msg"></div>
      <v-ons-input modifier="material" type="email" placeholder="メールアドレス" class="input" v-model="mail"/>

      <v-ons-input modifier="material" type="password" placeholder="パスワード" class="input" v-model="pass"/>

      <div class="forgot-b" @click="forgotPass">パスワードを忘れた方</div>

      <v-ons-button class="btn" @click.prevent="login">ログイン</v-ons-button>
      <v-ons-button class="btn btn-new" @click.prevent="regist">新規登録</v-ons-button>
    </div>
  </v-ons-page>
  </no-ssr>
</template>

<script>
import Logo from '../components/Logo';
import TabBar from './TabBar';
import TypeSelect from './TypeSelect';
import PasswordReset from './PasswordReset';
import logo from '../assets/clapLogo@2x.png'; 

export default {
  data() {
    return {
      logo: logo,
      mail: '',
      pass: '',
      errMsg: '',
    }
  },

    methods: {
        async login() {
          if(this.mail == '') {
              this.$ons.notification.alert('メールアドレスを入力ください。', {title:''});
              return;
          }
          if(this.pass == '') {
            this.$ons.notification.alert('パスワードを入力ください。', {title:''});
            return;
          }

          if (!navigator.onLine) {
            this.$ons.notification.alert('ネットワークの接続を確認ください。', {title:''});
            return;
          }

          this.errMsg = 'ロード中...';
          await this.$store.dispatch('login', {mail: this.mail, pass: this.pass});
          const loginErrMsg = this.$store.state.loginErrMsg;
          if(loginErrMsg) {
              // errMsgの内容によって、表示を変える場合は、switch文を採用する。
              if(loginErrMsg=='We have blocked all requests from this device due to unusual activity. Try again later.') {
                this.errMsg = 'ネットワークの問題が発生しました。<br>少し時間を置いてから試してください。';
              } else if(loginErrMsg=='A network error (such as timeout, interrupted connection or unreachable host) has occurred.'){
                this.errMsg = 'ネットワークの問題が発生しました。';
              } else {
                this.errMsg = 'メールアドレスかパスワードを間違えています。';
              }
              this.pass = '';
          } else {
          }
       
        },

        regist() {
          this.$store.commit('push', TypeSelect);
        },

        forgotPass() {
          this.$store.commit('push', PasswordReset);
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
    width: 38vw;
    margin-bottom: 8px;
  }

  @media (min-width: 600px){
    .logo {
        width: 20vw;
      }
  }

  @media (min-width: 1200px){
    .logo {
        width: 12vw;
      }
  }

  .lead {
    font-style: italic;
    margin-bottom: 8px;
  }

  .err-msg {
    height: 40px;
    font-size: 0.85rem;
    color: #fff703;
    margin-bottom: 8px;
  }

  .input {
    width: 240px;
    margin-bottom: 24px;
    font-size: 1.6rem;
    color: #ffff !important;
  }

  .forgot-b {
    text-align: center;
    margin-top: 8px;
    margin-bottom: 10vh;
    width: 200px;
    font-size: 0.9rem;
    color: #ffff;
  }

  .btn {
      text-align: center;
      margin-bottom: 16px;
      width: 185px;
      border-radius: 24px;
      background-color: #ffbb00e7;
  }

  .btn-new {
      background-color: transparent;
  }
</style>

