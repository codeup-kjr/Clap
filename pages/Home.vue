<template>
  <no-ssr>
   <v-ons-page>
    <div class="container">
      <Logo class="logo"/>
      <p class="lead">仲間のいいとこ見つけよう</p>

      <div v-html="errMsg" class="err-msg"></div>
      <v-ons-input modifier="material" type="email" placeholder="メールアドレス" class="input" v-model="mail"/>

      <v-ons-input modifier="material" type="password" placeholder="パスワード" class="input" v-model="pass"/>

      <v-ons-button class="btn" @click.prevent="login">ログイン</v-ons-button>

      <v-ons-button modifier="quiet" class="forgot-b" @click="forgotPass">パスワードを忘れた方</v-ons-button>

      <v-ons-button class="btn" @click.prevent="regist">新規登録</v-ons-button>
    </div>
  </v-ons-page>
  </no-ssr>
</template>

<script>
import Logo from '../components/Logo'
import TabBar from './TabBar'
import TypeSelect from './TypeSelect'
import PasswordReset from './PasswordReset'

export default {
  data() {
    return {
      mail: '',
      pass: '',
      errMsg: '',
    }
  },

  mounted() {
    // this.$store.dispatch('checkLogin', {page: TabBar})
  },

  destroyed() {

  },

  components: {
    Logo,
  },
    methods: {
        async login() {
          if(this.mail == '') {
              this.$ons.notification.alert('メールアドレスを入力ください。', {title:''})
              return
          }
          if(this.pass == '') {
            this.$ons.notification.alert('パスワードを入力ください。', {title:''})
            return
          }

          if (!navigator.onLine) {
            this.$ons.notification.alert('ネットワークの接続を確認ください。', {title:''})
            return
          }

          this.errMsg = 'ロード中...'
          await this.$store.dispatch('login', {mail: this.mail, pass: this.pass})
          const loginErrMsg = this.$store.state.loginErrMsg
          if(loginErrMsg) {
              // errMsgの内容によって、表示を変える場合は、switch文を採用する。
              if(loginErrMsg=='We have blocked all requests from this device due to unusual activity. Try again later.') {
                this.errMsg = 'ネットワークの問題が発生しました。<br>少し時間を置いてから試してください。'  
              } else if(loginErrMsg=='A network error (such as timeout, interrupted connection or unreachable host) has occurred.'){
                this.errMsg = 'ネットワークの問題が発生しました。'  
              } else {
                this.errMsg = 'メールアドレスかパスワードを間違えています。'
              }
              this.pass = ''
          } else {
          }
       
        },

        regist() {
          this.$store.commit('push', TypeSelect)
        },

        forgotPass() {
          this.$store.commit('push', PasswordReset)
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
  }

  .logo {
    font-size: 3rem;
    color: rgb(210, 30, 30);
    margin-bottom: 8px;
  }

  .lead {
    font-style: italic;
    margin-bottom: 8px;
  }

  .err-msg {
    height: 40px;
    font-size: 0.85rem;
    color: #db2e76;
    margin-bottom: 8px;
  }

  .input {
    margin-bottom: 16px;
    font-size: 1.6rem;
  }

  .btn {
      text-align: center;
      margin: 24px 0;
      width: 200px;
  }

  .forgot-b {
    text-align: center;
    margin: 6px 0;
    width: 200px;
    font-size: 0.9rem;
    margin: -8px 0 0 -4px;
  }
</style>

