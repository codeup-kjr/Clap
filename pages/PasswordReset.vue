<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <p class="title">パスワードの変更</p>
            <div class="description">
                <p v-show="!$store.state.confirmed">メールアドレスを入力ください。</p>
                <p class="success" v-show="$store.state.confirmed&&$store.state.emailFlg&&$store.state.sentFlg">メールを送信しました。<br>メールの内容に従い、<br>手続きを進めてください。</p>
                <!-- <p class="error" v-show="$store.state.confirmed&&$store.state.emailFlg&&!$store.state.sentFlg">メールの送信に失敗しました。<br>しばらくしてから再実行ください。</p> -->
                <p class="error" v-show="$store.state.confirmed&&!$store.state.emailFlg&&!$store.state.sentFlg">そのメールアドレスは未登録です。</p>
            </div>

            <v-ons-input modifier="material" type="email" placeholder="メールアドレス" v-model="email" class="email"/>
            <v-ons-button class="confirm-b" @click.prevent="confirm">確定</v-ons-button>
            <v-ons-button class="cancel-b" modifier="quiet" @click.prevent="cancel">{{btnTxt}}</v-ons-button>

        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            email: '',
            btnTxt: 'キャンセル'
        }
    },

    mounted() {
        // Promise.resolve()
        //     .then( () => this.bindTeam())
    },

    destroyed() {
        // Promise.resolve()
        //     .then( () => this.unBindTeam())
    },

    methods: {
        ...mapActions({
            // bindTeam: 'bindTeam',
            // unBindTeam: 'unBindTeam'
        }),

        async confirm() {
            if(this.email == '') {
                this.$ons.notification.alert('メールアドレスを入力ください。', {title:''})
                return
            }
            
            this.$store.dispatch('searchEmail', {email: this.email})
            this.btnTxt = '戻る'
        },

        cancel() {
            this.btnTxt = 'キャンセル'
            this.$store.commit('setConfirmed', false)
            this.$store.commit('pop')
        }
    },

    computed: {
        
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

   .title {
       font-size: 1.2rem;
       font-weight: bold;
       margin-bottom: 48px;
   }

    .description {
        width: 270px;
        height: 96px;
        margin-bottom: 32px;
        text-align: center;
    }

    .success {
        color: #0c55ad;
    }

    .error {
        color: #db2e76;
    }

    .height-container {
        margin-bottom: 24px;
        height: 88px;
        text-align: center;
    }

    .email {
        font-size: 1.6rem;
        margin-bottom: 24px
    }


    .confirm-b {
        text-align: center;
        margin-bottom: 32px;
        width: 200px;
    }


    .cancel-b {
        width: 110px;
        text-align: center;
        height: fit-content;
    }

</style>
