<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <div class="route">
                <img :src="bar" alt="チーム登録" class="bar">
            </div>
            <p class="request">チーム情報を登録ください。</p>
            
            <v-ons-input modifier="material" type="text" placeholder="チーム名" v-model="teamName" class="input"/>

            <v-ons-select modifier="material" v-model="teamType" class="select">
                <option disabled selected>種別</option>
                <option v-for="item in $store.state.types" :key="item.id">
                    {{ item.text }}
                </option>
            </v-ons-select>

            <v-ons-select modifier="material" v-model="teamEvent" class="select">
                <option disabled selected>競技種目</option>
                <option v-for="item in $store.state.events" :key="item.id">
                    {{ item.text }}
                </option>
            </v-ons-select>

            <v-ons-button class="regist-b" @click.prevent="regist">次へ</v-ons-button>
            <div class="cancel-b" @click.prevent="cancel">キャンセル</div>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import UserRegist from './UserRegist';
import bar from '../assets/teamRegBar@2x.png';

export default {
    data() {
        return {
            bar: bar,
            teamName: '',
            teamType: '種別',
            teamEvent: '競技種目'
        }
    },

    methods: {
        regist() {
            if(this.teamName == '') {
                this.$ons.notification.alert('チーム名を入力ください。', {title:''});
                return;
            }
            if(this.teamType == '種別') {
                this.$ons.notification.alert('種別を選択ください。', {title:''});
                return;
            }
            if(this.teamEvent == '競技種目') {
                this.$ons.notification.alert('競技種目を選択ください。', {title:''});
                return;
            }

            if (!navigator.onLine) {
                this.$ons.notification.alert('ネットワークの接続を確認ください。', {title:''});
                return;
            }
            
            // 生成する文字列の長さ
            const l = 20;
            // 生成する文字列に含める文字セット
            const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const cl = c.length;
            let teamId = "";
            for(var i=0; i<l; i++){
                teamId += c[Math.floor(Math.random()*cl)];
            }
            this.$store.commit('setTeamId', teamId);
            this.$store.dispatch('teamRegist', {
                                                name: this.teamName,
                                                type: this.teamType,
                                                event: this.teamEvent
                                });
            this.$store.commit('push', {extends: UserRegist, data(){return{teamRegist: true}}});
        },
     
        cancel() {
            this.$store.commit('pop');
            this.$store.commit('pop');
        }
    }
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        background: linear-gradient(0deg,#6fb1fc,#4364f7, #0052D4);
        background-size: 100vw 100vh;
        color: #ffff;
    }

    .route {
        padding-top: 6vh;
        margin-bottom: 9vh;
    }
    
    .bar {
        width: 100vw; 
    }

    @media (min-width: 700px){
        .bar {
            width: 50vw; 
        }
    }

    @media (min-width: 1200px){
        .bar {
            width: 30vw; 
        }
    }

    .request {
        color: #ffbd00;
        font-size: 1.4rem;
        margin-bottom: 8vh;
    }

    .input {
        margin-bottom: 24px;
        font-size: 1.6rem;
    }

    .select {
        margin-bottom: 24px;
        font-size: 1.6rem;
        width: 185px;
    }

    .regist-b {
        text-align: center;
        margin: 5vh 0 6vh;
        width: 185px;
        border-radius: 24px;
        background-color: #ffbb00e7;
    }
</style>
