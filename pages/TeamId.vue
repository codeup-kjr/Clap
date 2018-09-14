<template>
    <!-- <no-ssr> -->
    <v-ons-page>
        <div class="container">
            <div class="route">
                <div class="point">
                    <img src="../assets/group.png" alt="チームに参加" class="img"><br>
                    チームに参加
                </div>
                <div class="arrow"/>
                <div class="point">
                    <img src="../assets/group.png" alt="チーム情報" class="img"><br>
                    チーム情報
                </div>
            </div>
            <div v-show="!confirmed&&!incorrect">
                <p class="description">チームIDを入力ください。
                <br>わからない場合は、<br>使用中のチームメンバーに
                <br>MyPageを確認してもらいましょう。</p>
            </div>

            <div v-show="confirmed&&!incorrect">
                <p class="description">あなたのチームはこちらですか？
                <br><span class="name-emp">{{teamName}}</span></p>
            </div>

            <div v-show="incorrect">
                <p class="description">そのIDは登録されていません。
                <br>正しいチームIDを入力ください。</p>
            </div>
            <div class="height-container">
                <div class="un-confirmed" v-show="!confirmed">
                    <v-ons-input modifier="material" type="text" placeholder="チームID" v-model="teamId" class="input"/>
                    <v-ons-button class="confirm-b" @click.prevent="confirm">確定</v-ons-button>
                </div>
                <div class="confirmed-btns" v-show="confirmed">
                    <v-ons-button class="confirmed-b" @click.prevent="yes">はい</v-ons-button>
                    <v-ons-button class="confirmed-b" modifier="quiet" @click.prevent="no">いいえ</v-ons-button>
                </div>
            </div>
            <v-ons-button class="confirmed-b" modifier="quiet" @click.prevent="cancel">キャンセル</v-ons-button>

        </div>
    </v-ons-page>
    <!-- </no-ssr> -->
</template>

<script>
import UserRegist from './UserRegist'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            teamId: '',
            teamName: '',
            confirmed: false,
            incorrect: false
            
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

        confirm() {
            if(this.teamId == '') {
                this.$ons.notification.alert('チームIDを入力ください。', {title:''})
                return
            }
            
            let teamName = ''
            Promise.resolve()
                //store/index.jsで引数を複数指定しているため、呼び出し元では引数をオブジェクトで指定する。
                .then( () => this.$store.dispatch('searchTeamId', {teamId: this.teamId}))
                .then( () => teamName = this.$store.state.schTeamId.name)
                .then( () => {
                                if(teamName) {
                                    this.teamName = teamName
                                    this.incorrect = false
                                    this.confirmed = true

                                } else {
                                    this.incorrect = true
                                }
                            })
        },

        yes() {
            this.$store.commit('setTeamId', this.teamId)
            this.$store.commit('push', {extends: UserRegist, data(){return{teamRegist: false}}})
        },

        no() {
            this.teamId = ''
            this.confirmed = false 
        },

        cancel() {
            this.$store.commit('pop')
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

    .route {
        width: 200px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-top: 16px;
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

    .description {
        width: 270px;
        height: 96px;
        margin-bottom: 32px;
        text-align: center;
    }

    .name-emp {
        font-size: 1.3rem;
        font-weight: bold;
        overflow: auto;
        font-style: italic;
    }

    .height-container {
        margin-bottom: 24px;
        height: 88px;
        text-align: center;
    }

    .un-confirmed {
        height: 84px;
        /* confirmed-btnsの高さと同じにする。 */
    }

    .input {
        font-size: 1.6rem;
        margin-bottom: 8px
    }


    .confirm-b {
        text-align: center;
        margin: 6px 0;
        width: 200px;
    }

    .confirmed-btns {
        width: 200px;
        display: flex;
        align-items: flex-end;
        height: 84px;
        /* un-confirmedの高さと同じにする。 */
    }

    .confirmed-b {
        width: 110px;
        text-align: center;
        height: fit-content;
    }

</style>
