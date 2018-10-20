<template>
<!-- <no-ssr> -->
<v-ons-page>
    <div class="container">
        <p class="request">利用タイプを選んでください。</p>
        <div class="types">
            <div class="type"  @click="pushPage(TeamId)">
                <img src="../assets/athlete.png" alt="チームに参加" class="typeImg"><br>
                チームに参加
            </div>
            <hr width="1" size="105">
            <div class="type" @click="pushPage(TeamRegist)">
                <img src="../assets/coach.png" alt="チームを登録" class="typeImg"><br>
                チームを登録
            </div>
        </div>
        <v-ons-button class="cancel-b" modifier="quiet" @click.prevent="popPage">キャンセル</v-ons-button>
    </div>
</v-ons-page>
<!-- </no-ssr> -->
</template>

<script>
import TeamId from './TeamId';
import TeamRegist from './TeamRegist';
export default {
    data() {
        return {
            TeamRegist: TeamRegist,
            TeamId: TeamId
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
        justify-content: center;
        height: 90%;
    }

    .request {
        margin-bottom: 48px;
    }

    .types {
        width: 216px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 48px;
    }

    .type {
        text-align: center;
    }

    .typeImg {
        width: 80px;
        height: 80px;
    }
</style>
