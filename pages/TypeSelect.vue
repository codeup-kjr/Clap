<template>
<!-- <no-ssr> -->
<v-ons-page>
    <div class="container">
        <div class="point-title">
            <v-ons-icon icon='fa-hand-o-up' class="point"/>
            <div class="title">利用タイプ選択</div>
        </div>
        <p class="question">あなたはどちらですか？</p>
        <div class="types">
            <img :src="join" alt="チームに参加" class="typeImg" @click="pushPage(TeamId)">
            <img :src="reg" alt="チームを登録" class="typeImg" @click="pushPage(TeamRegist)">
        </div>
        <div class="cancel-b" @click.prevent="popPage">キャンセル</div>
    </div>
</v-ons-page>
<!-- </no-ssr> -->
</template>

<script>
import TeamId from './TeamId';
import TeamRegist from './TeamRegist';
import join from '../assets/teamJoinButton@2x.png';
import reg from '../assets/teamRegButton@2x.png';

export default {
    data() {
        return {
            join: join,
            reg: reg,
            TeamId: TeamId,
            TeamRegist: TeamRegist
        }
    },

    methods: {
        pushPage(page){
            this.$store.commit('push', page);
        },

        popPage(){
            this.$store.commit('pop');
        },
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

    .point-title {
        margin-bottom: 9vh;
        border-bottom: solid 1px #ffff;
        width: 100vw;
        display: flex;
        justify-content: center;
        padding-top: 6vh;
        padding-bottom: 16px;
    }

    .point {
        margin-right: 12px;
        font-size: 1.4rem;
    }

    .title {

    }

    .question {
        color: #ffbd00;
        font-size: 1.4rem;
        margin-bottom: 8vh;
    }

    .types {
        width: 84vw;
        max-width: 376px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 12vh;
    }

    .typeImg {
        width: 40vw;
        height: 40vw;
        max-width: 160px;
        max-height: 160px;
        /* height: 80px; */
    }

    .cancel-b {
        color: #ffff;
    }
</style>
