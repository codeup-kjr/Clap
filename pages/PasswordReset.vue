<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <p class="title">パスワードの変更</p>
            <div class="description">
                <p v-show="!$store.state.confirmed">メールアドレスを入力ください。</p>
                <p class="success" v-show="$store.state.confirmed&&$store.state.emailFlg&&$store.state.sentFlg">メールを送信しました。<br>メールの内容に従い、<br>手続きを進めてください。</p>
                <!-- querySnapshotはerrorを返すことができないため、未登録か、ネットワークの問題かをわけないことにした。 -->
                <p class="error" v-show="$store.state.confirmed&&!$store.state.emailFlg&&!$store.state.sentFlg">そのメールアドレスは未登録か、<br>ネットワークに問題があります。</p>
            </div>

            <v-ons-input modifier="material" type="email" placeholder="メールアドレス" v-model="email" class="email"/>
            <v-ons-button class="confirm-b" @click.prevent="confirm">確定</v-ons-button>
            <div class="cancel-b" @click.prevent="cancel">{{btnTxt}}</div>

        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>

export default {
    data() {
        return {
            email: '',
            btnTxt: 'キャンセル'
        }
    },

    methods: {

        async confirm() {
            if(this.email == '') {
                this.$ons.notification.alert('メールアドレスを入力ください。', {title:''});
                return;
            }

            if (!navigator.onLine) {
                this.$ons.notification.alert('ネットワークの接続を確認ください。', {title:''});
                return;
            }
            
            this.$store.dispatch('searchEmail', {email: this.email});
            this.btnTxt = '戻る';
        },

        cancel() {
            this.btnTxt = 'キャンセル';
            this.$store.commit('setConfirmed', false);
            this.$store.commit('pop');
        }
    },

}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #ffff;
        background: linear-gradient(0deg,#6fb1fc,#4364f7, #0052D4);
        background-size: 100vw 100vh;
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
        color: #ffff;
    }

    .error {
        color: #fff703;
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
        border-radius: 24px;
        background-color: #ffbb00e7;
    }


    .cancel-b {
        width: 200px;
        text-align: center;
        height: fit-content;   
    }

</style>
