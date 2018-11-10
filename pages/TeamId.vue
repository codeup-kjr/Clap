<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <div class="route">
                <img :src="$store.state.schTIdConfirmed == true &&!$store.state.schTIdErrbar == true ? barId : bar"
                        alt="チームに参加" class="bar">
            </div>
            <div v-show="!$store.state.schTIdConfirmed&&!$store.state.schTIdErr">
                <p class="request">チームIDを入力ください。</p>
                <p class="description">わからない場合は、すでに登録しているチームメンバーに確認ください。</p>
            </div>

            <div v-show="$store.state.schTIdConfirmed&&!$store.state.schTIdErr">
                <p class="request">チームを確認ください。</p>
                <div class="description name"><div class="your">あなたのチームは</div>
                <div class="name-emp">{{$store.state.schTeamId.name}}</div>
                でお間違いないですか？</div>
            </div>

            <div v-show="$store.state.schTIdErr">
                <p class="request">チームIDを確認ください。</p>
                <div v-html="$sanitize($store.state.schTIdErr)" class="description"></div>
            </div>
            <div class="height-container">
                <div class="un-confirmed" v-show="!$store.state.schTIdConfirmed">
                    <v-ons-input modifier="material" type="text" placeholder="チームID" v-model="teamId" class="input"/>
                    <v-ons-button class="confirm" @click.prevent="confirm">確定</v-ons-button>
                </div>
                <div v-show="$store.state.schTIdConfirmed">
                    <v-ons-button class="yes" @click.prevent="yes">はい</v-ons-button>
                    <div class="no" @click.prevent="no">いいえ</div>
                </div>
            </div>
            <div :style="$store.state.schTIdConfirmed == true ? {marginTop: '36px'} : {marginTop: '84px'}" @click.prevent="cancel">キャンセル</div>

        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import UserRegist from './UserRegist';
import bar from '../assets/teamJoinBar@2x.png';
import barId from '../assets/teamJoinIdBar@2x.png';

export default {
    data() {
        return {
            bar: bar,
            barId: barId,
            teamId: '',
        }
    },

    destroyed() {
        this.$store.commit('setSchTIdConfirmed', false);
    },

    methods: {

        confirm() {
            if(this.teamId == '') {
                this.$ons.notification.alert('チームIDを入力ください。', {title:''});
                return;
            }

            if (!navigator.onLine) {
                this.$ons.notification.alert('ネットワークの接続を確認ください。', {title:''});
                return;
            }
            //store/index.jsで引数を複数指定しているため、呼び出し元では引数をオブジェクトで指定する。
            this.$store.dispatch('searchTeamId', {teamId: this.teamId});
        },

        yes() {
            this.$store.commit('setTeamId', this.teamId);
            this.$store.commit('push', {extends: UserRegist, data(){return{teamRegist: false}}});
        },

        no() {
            this.teamId = '';
            this.$store.commit('setSchTIdConfirmed', false);
        },

        cancel() {
            this.$store.commit('pop');
            this.$store.commit('pop');
            this.$store.commit('setSchTIdConfirmed', false);
            this.$store.commit('setSchTIdErr', '');
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

    .description {
        width: 280px;
        margin-bottom: 32px;
        /* text-align: center; */
    }

    .name {
        text-align: center;
    }

    .your {
        margin-bottom: 10px;
    }

    .name-emp {
        font-size: 1.3rem;
        font-weight: bold;
        overflow: auto;
        border-bottom: solid 1px #ffff;
        padding-bottom: 4px;
        margin-bottom: 16px;
    }

    .height-container {
        /* margin-bottom: 24px;
        height: 88px;
        text-align: center; */
    }

    .un-confirmed {
        display: flex;
        flex-direction: column;
    }

    .input {
        font-size: 1.6rem;
        margin-bottom: 31px
    }


    .confirm {
        text-align: center;
        width: 200px;
        border-radius: 24px;
        background-color: #ffbb00e7;
    }

    .yes {
        text-align: center;
        margin-bottom: 24px;
        width: 200px;
        border-radius: 24px;
        background-color: #ffbb00e7;
    }

    .no {
        text-align: center;
        width: 200px;
    }

    .cancel {
        
    }

</style>
