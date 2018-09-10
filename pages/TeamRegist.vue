<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <div class="route">
                <div class="point">
                    <img src="../assets/coach.png" alt="チームを登録" class="img"><br>
                    チームを登録
                </div>
                <div class="arrow"/>
                <div class="point">
                    <img src="../assets/group.png" alt="チーム情報" class="img"><br>
                    チーム情報
                </div>
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

            <v-ons-button class="regist-b" @click.prevent="regist">登録する</v-ons-button>
            <v-ons-button class="cancel-b" modifier="quiet" @click.prevent="cancel">キャンセル</v-ons-button>
        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import UserRegist from './UserRegist'

export default {
    data() {
        return {
            teamName: '',
            teamType: '種別',
            teamEvent: '競技種目'
        }
    },

    methods: {
        regist() {
            if(this.teamName == '') {
                this.$ons.notification.alert('チーム名を入力ください。', {title:''})
                return
            }
            if(this.teamType == '種別') {
                this.$ons.notification.alert('種別を選択ください。', {title:''})
                return
            }
            if(this.teamEvent == '競技種目') {
                this.$ons.notification.alert('競技種目を選択ください。', {title:''})
                return
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
            this.$store.commit('setTeamId', teamId)
            this.$store.dispatch('teamRegist', {
                                                name: this.teamName,
                                                type: this.teamType,
                                                event: this.teamEvent
                                })
            this.$store.commit('push', {extends: UserRegist, data(){return{teamRegist: true}}})
        },
     
        cancel() {
            this.$store.commit('pop')
            this.$store.commit('pop')
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
        height: 90%;
    }

    .route {
        width: 160px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .point {
        text-align: center;
        font-size: 0.8rem;
        color: rgb(109, 108, 108);
    }

    .arrow{
        position: relative;
        display: inline-block;
        padding-left: 10px;
    }

    .arrow::before{
        content: '';
        width: 12px;
        height: 12px;
        border: 0px;
        border-top: solid 2px #499cb6;
        border-right: solid 2px #499cb6;
        -ms-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -8px;
    }

    .img {
        width: 40px;
        height: 40px;
    }

    .request {
        margin-bottom: 48px;
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
        margin: 8px 0 12px;
        width: 200px;
    }

</style>
